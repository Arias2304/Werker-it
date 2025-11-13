from decimal import Decimal
from typing import Sequence

from fastapi import HTTPException, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from app.models.professional_service import ProfessionalService
from app.models.user import User, UserType


def _ensure_table(db: Session) -> None:
    ProfessionalService.__table__.create(bind=db.get_bind(), checkfirst=True)


def _get_professional(db: Session, *, email: str | None = None, professional_id: int | None = None) -> User:
    if professional_id is not None:
        statement = select(User).where(User.id == professional_id, User.user_type == UserType.professional)
        professional = db.scalar(statement)
        if professional:
            return professional
    if email:
        statement = select(User).where(User.email == email.lower(), User.user_type == UserType.professional)
        professional = db.scalar(statement)
        if professional:
            return professional
    identifier = professional_id if professional_id is not None else email or "desconocido"
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Profesional no encontrado ({identifier})",
    )


def create_service_offering(
    db: Session,
    *,
    professional_email: str | None,
    professional_id: int | None,
    title: str,
    description: str,
    base_cost: Decimal,
    specialty: str | None = None,
) -> ProfessionalService:
    _ensure_table(db)
    professional = _get_professional(db, email=professional_email, professional_id=professional_id)
    service = ProfessionalService(
        professional_id=professional.id,
        title=title.strip(),
        description=description.strip(),
        specialty=(specialty or professional.specialty or "").strip() or None,
        base_cost=base_cost,
        currency=professional.currency,
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


def list_catalog(
    db: Session, *, specialty: str | None = None, country: str | None = None
) -> list[dict[str, User | Sequence[ProfessionalService]]]:
    _ensure_table(db)
    clean_specialty = specialty.strip() if specialty else None
    clean_country = country.strip().upper() if country else None
    statement = (
        select(User)
        .where(User.user_type == UserType.professional)
        .options(selectinload(User.services_offered))
        .order_by(User.last_name)
    )
    if clean_country:
        statement = statement.where(User.country == clean_country)
    if clean_specialty:
        statement = statement.where(
            or_(
                User.specialty.ilike(clean_specialty),
                User.services_offered.any(ProfessionalService.specialty.ilike(clean_specialty)),
            )
        )
    professionals = db.scalars(statement).unique().all()
    catalog: list[dict[str, User | Sequence[ProfessionalService]]] = []
    normalized_specialty = clean_specialty.lower() if clean_specialty else None

    for professional in professionals:
        services = [
            service
            for service in professional.services_offered
            if not normalized_specialty
            or (service.specialty or professional.specialty or "").strip().lower() == normalized_specialty
        ]
        if services:
            catalog.append({"professional": professional, "services": services})
    return catalog


def get_service(db: Session, service_id: int) -> ProfessionalService:
    _ensure_table(db)
    service = db.get(ProfessionalService, service_id)
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no encontrado")
    return service
