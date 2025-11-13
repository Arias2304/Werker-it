from datetime import datetime, timezone
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.professional_service import ProfessionalService
from app.models.service_request import ServiceRequest, ServiceStatus
from app.models.user import User, UserType
from app.services import wallet_service

ADMIN_COMMISSION_RATE = Decimal("0.10")

ERROR_MESSAGES = {
    "schedule_before_today": {
        "es": "La fecha programada no puede ser anterior al día actual.",
        "en": "The scheduled date cannot be earlier than today.",
        "pt": "A data programada não pode ser anterior ao dia atual.",
        "fr": "La date planifiée ne peut pas être antérieure à aujourd’hui.",
        "ja": "予定日時は本日より前には設定できません。",
    },
    "schedule_in_past": {
        "es": "La fecha programada debe ser posterior al momento actual.",
        "en": "The scheduled time must be later than the current moment.",
        "pt": "O horário programado deve ser posterior ao momento atual.",
        "fr": "L’heure planifiée doit être postérieure au moment actuel.",
        "ja": "予定時刻は現在の時刻より後である必要があります。",
    },
    "confirm_before_time": {
        "es": "Solo puedes confirmar una vez llegada la fecha programada.",
        "en": "You can only confirm once the scheduled time has arrived.",
        "pt": "Você só pode confirmar quando chegar o horário programado.",
        "fr": "Vous ne pouvez confirmer qu’une fois l’heure prévue arrivée.",
        "ja": "予定時刻になってから確認してください。",
    },
}


def _get_language_code(user: User | None) -> str:
    base = (user.language_code if user and user.language_code else "es").split("-")[0].lower()
    return base if base in ERROR_MESSAGES["schedule_in_past"] else "en"


def _get_error_message(user: User | None, key: str) -> str:
    language = _get_language_code(user)
    return ERROR_MESSAGES.get(key, {}).get(language, ERROR_MESSAGES[key]["en"])


def _get_client(db: Session, email: str) -> User:
    statement = select(User).where(User.email == email.lower(), User.user_type == UserType.client)
    client = db.scalar(statement)
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente no encontrado")
    return client


def _get_professional(db: Session, email: str) -> User:
    statement = select(User).where(User.email == email.lower(), User.user_type == UserType.professional)
    professional = db.scalar(statement)
    if not professional:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profesional no encontrado")
    return professional


def _get_admin(db: Session, email: str) -> User:
    statement = select(User).where(User.email == email.lower(), User.user_type == UserType.admin)
    admin = db.scalar(statement)
    if not admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Administrador no encontrado")
    return admin


def _get_country_admin(db: Session, country_code: str | None) -> User:
    if not country_code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No pudimos identificar la region")
    statement = select(User).where(User.country == country_code.upper(), User.user_type == UserType.admin)
    admin = db.scalar(statement)
    if not admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Administrador regional no disponible")
    return admin


def create_from_catalog(
    db: Session,
    *,
    client_email: str,
    service: ProfessionalService,
    description: str,
    urgency: str,
    location_lat: float | None = None,
    location_lng: float | None = None,
    scheduled_at: datetime | None = None,
) -> ServiceRequest:
    client = _get_client(db, client_email)

    request = ServiceRequest(
        category=service.title[:64],
        description=description.strip() or service.description,
        urgency=urgency or "normal",
        location_lat=location_lat if location_lat is not None else 0,
        location_lng=location_lng if location_lng is not None else 0,
        scheduled_at=scheduled_at,
        estimated_cost=service.base_cost,
        country=client.country,
        currency=client.currency,
        client_id=client.id,
        professional_id=service.professional_id,
    )
    db.add(request)
    db.commit()
    db.refresh(request)
    return request


def complete_request(
    db: Session,
    *,
    request_id: int,
    client_email: str,
    satisfied: bool,
    feedback: str | None = None,
) -> ServiceRequest:
    client = _get_client(db, client_email)
    request = db.get(ServiceRequest, request_id)
    if not request or request.client_id != client.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solicitud no encontrada")
    if request.status != ServiceStatus.assigned:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La solicitud no está asignada")
    if not request.scheduled_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="La solicitud no tiene una fecha programada"
        )
    scheduled_value, now_value, is_aware = _as_reference_datetime(request.scheduled_at)
    if is_aware:
        in_future = scheduled_value > now_value
    else:
        in_future = scheduled_value > now_value and scheduled_value.date() >= now_value.date()
    if in_future:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=_get_error_message(client, "confirm_before_time")
        )

    request.client_feedback = (feedback or "").strip() or None
    request.satisfaction = satisfied
    if satisfied:
        request.completed_at = datetime.now(timezone.utc)
        amount = request.estimated_cost or Decimal("0")
        if not request.professional_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="No encontramos al profesional asignado"
            )
        if amount > 0:
            admin = _get_country_admin(db, request.country or client.country)
            wallet_service.transfer(
                db,
                payer_email=client_email,
                payee_email=request.professional_email,
                amount=amount,
                description=f"Servicio #{request.id}",
                commission_email=admin.email,
                commission_percentage=ADMIN_COMMISSION_RATE,
            )
        request.status = ServiceStatus.completed
    else:
        request.status = ServiceStatus.disputed
        request.completed_at = None
        request.admin_reviewed_by = None
        request.admin_reviewed_at = None
        request.admin_review_notes = None

    db.add(request)
    db.commit()
    db.refresh(request)
    return request


def list_for_professional(
    db: Session,
    *,
    professional_email: str,
    status: ServiceStatus | None = ServiceStatus.pending,
) -> list[ServiceRequest]:
    professional = _get_professional(db, professional_email)
    statement = (
        select(ServiceRequest)
        .where(ServiceRequest.professional_id == professional.id)
        .options(selectinload(ServiceRequest.client))
        .order_by(ServiceRequest.id.desc())
    )
    if status:
        statement = statement.where(ServiceRequest.status == status)
    return db.scalars(statement).all()


def list_for_client(
    db: Session,
    *,
    client_email: str,
    status: ServiceStatus | None = None,
) -> list[ServiceRequest]:
    client = _get_client(db, client_email)
    statement = (
        select(ServiceRequest)
        .where(ServiceRequest.client_id == client.id)
        .options(selectinload(ServiceRequest.professional))
        .order_by(ServiceRequest.id.desc())
    )
    if status:
        statement = statement.where(ServiceRequest.status == status)
    return db.scalars(statement).all()


def list_disputed(
    db: Session,
    *,
    admin_email: str,
) -> list[ServiceRequest]:
    admin = _get_admin(db, admin_email)
    statement = (
        select(ServiceRequest)
        .where(
            ServiceRequest.status == ServiceStatus.disputed,
            ServiceRequest.country == admin.country,
        )
        .options(selectinload(ServiceRequest.client), selectinload(ServiceRequest.professional))
        .order_by(ServiceRequest.id.desc())
    )
    return db.scalars(statement).all()


def resolve_dispute(
    db: Session,
    *,
    request_id: int,
    admin_email: str,
    approve_payment: bool,
    notes: str | None = None,
) -> ServiceRequest:
    admin = _get_admin(db, admin_email)
    request = db.get(ServiceRequest, request_id)
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solicitud no encontrada")
    if request.status != ServiceStatus.disputed:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La solicitud no estA� en disputa")
    if request.country != admin.country:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No puedes gestionar disputas de otro paA-s",
        )

    clean_notes = (notes or "").strip() or None
    now_utc = datetime.now(timezone.utc)

    if approve_payment:
        amount = request.estimated_cost or Decimal("0")
        if not request.client_email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No encontramos al cliente asignado")
        if not request.professional_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="No encontramos al profesional asignado"
            )
        if amount > 0:
            wallet_service.transfer(
                db,
                payer_email=request.client_email,
                payee_email=request.professional_email,
                amount=amount,
                description=f"Servicio #{request.id} (decisiA3n admin)",
                commission_email=admin.email,
                commission_percentage=ADMIN_COMMISSION_RATE,
            )
        request.status = ServiceStatus.completed
        request.completed_at = now_utc
    else:
        request.status = ServiceStatus.cancelled
        request.completed_at = now_utc

    request.admin_reviewed_by = admin.email
    request.admin_reviewed_at = now_utc
    request.admin_review_notes = clean_notes

    db.add(request)
    db.commit()
    db.refresh(request)
    return request


def register_decision(
    db: Session,
    *,
    request_id: int,
    professional_email: str,
    action: str,
    scheduled_at: datetime | None = None,
) -> ServiceRequest:
    professional = _get_professional(db, professional_email)
    request = db.get(ServiceRequest, request_id)
    if not request or request.professional_id != professional.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solicitud no encontrada")
    if request.status != ServiceStatus.pending:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="La solicitud ya fue procesada anteriormente"
        )
    normalized_action = action.lower()
    if normalized_action == "accept":
        if not scheduled_at:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Debes definir una fecha para gestionar el trabajo"
            )
        normalized_schedule, now_reference, is_aware = _as_reference_datetime(scheduled_at)
        if is_aware:
            too_early = normalized_schedule <= now_reference
        else:
            too_early = normalized_schedule.date() < now_reference.date()
        if too_early:
            key = "schedule_in_past" if is_aware else "schedule_before_today"
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=_get_error_message(professional, key),
            )
        request.status = ServiceStatus.assigned
        request.scheduled_at = scheduled_at
    elif normalized_action == "reject":
        request.status = ServiceStatus.cancelled
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Acción inválida")
    db.add(request)
    db.commit()
    db.refresh(request)
    return request
def _as_reference_datetime(value: datetime) -> tuple[datetime, datetime, bool]:
    """Normaliza un datetime para compararlo con 'ahora' y marca si manejaba zona horaria."""
    if value.tzinfo:
        return value.astimezone(timezone.utc), datetime.now(timezone.utc), True
    return value, datetime.now(), False
