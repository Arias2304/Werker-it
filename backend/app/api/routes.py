from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.constants import COUNTRY_CONFIG, SPECIALTIES
from app.db.database import get_db
from app.models.service_request import ServiceStatus
from app.models.user import UserType
from app.schemas import (
    ClientServiceRequestPayload,
    ClientRegisterRequest,
    CountryOption,
    AdminDisputeDecision,
    LoginRequest,
    LoginResponse,
    ProfessionalServiceCatalogEntry,
    ProfessionalServiceCreateRequest,
    ProfessionalServiceRead,
    ProfessionalSummary,
    ProfessionalRegisterRequest,
    SpecialtyOption,
    UserRead,
    WalletOperationRequest,
    WalletOperationResponse,
    WalletTransactionRead,
    ServiceRequestRead,
    ServiceRequestDecision,
    ClientRequestConfirmation,
)
from app.services import wallet_service
from app.services import professional_service
from app.services import service_request_service
from app.services.user_service import authenticate_user, create_client, create_professional, get_admin_identity

router = APIRouter()


@router.get("/health", tags=["core"])
def healthcheck():
    return {"status": "ok"}


@router.get("/meta/countries", response_model=list[CountryOption], tags=["meta"])
def list_supported_countries():
    countries: list[CountryOption] = []
    for code, profile in COUNTRY_CONFIG.items():
        identity = get_admin_identity(code)
        countries.append(
            CountryOption(
                code=code,
                name=profile["country_name"],
                language_label=profile["language_label"],
                language_code=profile["language_code"],
                currency=profile["currency"],
                nationality_label=profile.get("nationality_label", profile["country_name"]),
                admin_username=identity["username"],
                admin_email=identity["email"],
            )
        )
    return countries


@router.get("/meta/specialties", response_model=list[SpecialtyOption], tags=["meta"])
def list_specialties():
    return [SpecialtyOption(name=item) for item in SPECIALTIES]


@router.post(
    "/auth/register/client",
    response_model=UserRead,
    status_code=201,
    tags=["auth"],
)
def register_client(payload: ClientRegisterRequest, db: Session = Depends(get_db)):
    user = create_client(
        db,
        email=payload.email,
        password=payload.password,
        first_name=payload.first_name,
        last_name=payload.last_name,
        phone=payload.phone,
        address=payload.address,
        country=payload.country,
    )
    return user


@router.post(
    "/auth/register/professional",
    response_model=UserRead,
    status_code=201,
    tags=["auth"],
)
def register_professional(payload: ProfessionalRegisterRequest, db: Session = Depends(get_db)):
    user = create_professional(
        db,
        email=payload.email,
        password=payload.password,
        first_name=payload.first_name,
        last_name=payload.last_name,
        phone=payload.phone,
        specialty=payload.specialty,
        country=payload.country,
    )
    return user


@router.post("/auth/login", response_model=LoginResponse, tags=["auth"])
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, email=payload.email, password=payload.password, user_type=payload.user_type)
    return LoginResponse(message="Login exitoso", user=user)


@router.post(
    "/payments/deposit",
    response_model=WalletOperationResponse,
    tags=["pagos"],
)
def deposit(payload: WalletOperationRequest, db: Session = Depends(get_db)):
    user = wallet_service.deposit(db, email=payload.email, amount=payload.amount)
    return WalletOperationResponse(
        email=user.email,
        new_balance=user.wallet_balance,
        currency=user.currency,
        message="Depósito registrado",
    )


@router.post(
    "/payments/withdraw",
    response_model=WalletOperationResponse,
    tags=["pagos"],
)
def withdraw(payload: WalletOperationRequest, db: Session = Depends(get_db)):
    user = wallet_service.withdraw(db, email=payload.email, amount=payload.amount)
    return WalletOperationResponse(
        email=user.email,
        new_balance=user.wallet_balance,
        currency=user.currency,
        message="Retiro registrado",
    )


@router.get(
    "/payments/balance/{email}",
    response_model=WalletOperationResponse,
    tags=["pagos"],
)
def get_balance(email: str, db: Session = Depends(get_db)):
    user = wallet_service.get_balance(db, email=email)
    return WalletOperationResponse(
        email=user.email,
        new_balance=user.wallet_balance,
        currency=user.currency,
        message="Balance consultado",
    )


@router.get(
    "/payments/transactions/{email}",
    response_model=list[WalletTransactionRead],
    tags=["pagos"],
)
def list_transactions(email: str, db: Session = Depends(get_db)):
    return wallet_service.list_transactions(db, email=email)


@router.post(
    "/professionals/services",
    response_model=ProfessionalServiceRead,
    status_code=status.HTTP_201_CREATED,
    tags=["profesionales"],
)
def register_professional_service(payload: ProfessionalServiceCreateRequest, db: Session = Depends(get_db)):
    service = professional_service.create_service_offering(
        db,
        professional_email=payload.professional_email,
        professional_id=payload.professional_id,
        title=payload.title,
        description=payload.description,
        base_cost=payload.base_cost,
        specialty=payload.specialty,
    )
    return service


@router.get(
    "/professionals/services",
    response_model=list[ProfessionalServiceCatalogEntry],
    tags=["profesionales"],
)
def list_professional_services(
    specialty: str | None = Query(default=None, description="Filtra por especialidad exacta (opcional)"),
    country: str = Query(..., min_length=2, max_length=2, description="Código de país del cliente (ISO-2)"),
    db: Session = Depends(get_db),
):
    catalog = professional_service.list_catalog(db, specialty=specialty, country=country)
    return [
        ProfessionalServiceCatalogEntry(
            professional=ProfessionalSummary.model_validate(entry["professional"]),
            services=[ProfessionalServiceRead.model_validate(service) for service in entry["services"]],
        )
        for entry in catalog
    ]


@router.post(
    "/services/requests",
    response_model=ServiceRequestRead,
    status_code=status.HTTP_201_CREATED,
    tags=["servicios"],
)
def create_service_request(payload: ClientServiceRequestPayload, db: Session = Depends(get_db)):
    service = professional_service.get_service(db, service_id=payload.service_id)
    request = service_request_service.create_from_catalog(
        db,
        client_email=payload.client_email,
        service=service,
        description=payload.description,
        urgency=payload.urgency,
        location_lat=payload.location_lat,
        location_lng=payload.location_lng,
        scheduled_at=payload.scheduled_at,
    )
    return request


@router.get(
    "/professionals/requests",
    response_model=list[ServiceRequestRead],
    tags=["servicios"],
)
def list_requests_for_professional(
    professional_email: str = Query(..., description="Correo del profesional"),
    status: ServiceStatus | None = Query(default=ServiceStatus.pending),
    db: Session = Depends(get_db),
):
    return service_request_service.list_for_professional(
        db,
        professional_email=professional_email,
        status=status,
    )


@router.post(
    "/professionals/requests/{request_id}/decision",
    response_model=ServiceRequestRead,
    tags=["servicios"],
)
def decide_service_request(request_id: int, payload: ServiceRequestDecision, db: Session = Depends(get_db)):
    return service_request_service.register_decision(
        db,
        request_id=request_id,
        professional_email=payload.professional_email,
        action=payload.action,
        scheduled_at=payload.scheduled_at,
    )


@router.get(
    "/clients/requests",
    response_model=list[ServiceRequestRead],
    tags=["servicios"],
)
def list_requests_for_client(
    client_email: str = Query(..., description="Correo del cliente"),
    status: ServiceStatus | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return service_request_service.list_for_client(
        db,
        client_email=client_email,
        status=status,
    )


@router.get(
    "/clients/{client_email}/requests",
    response_model=list[ServiceRequestRead],
    tags=["servicios"],
)
def list_requests_for_client_path(
    client_email: str,
    status: ServiceStatus | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return service_request_service.list_for_client(
        db,
        client_email=client_email,
        status=status,
    )


@router.post(
    "/clients/requests/{request_id}/confirmation",
    response_model=ServiceRequestRead,
    tags=["servicios"],
)
def confirm_service_request(request_id: int, payload: ClientRequestConfirmation, db: Session = Depends(get_db)):
    return service_request_service.complete_request(
        db,
        request_id=request_id,
        client_email=payload.client_email,
        satisfied=payload.satisfied,
        feedback=payload.feedback,
    )


@router.get(
    "/admin/requests/disputes",
    response_model=list[ServiceRequestRead],
    tags=["administracion"],
)
def list_disputed_requests(
    admin_email: str = Query(..., description="Correo del administrador"),
    db: Session = Depends(get_db),
):
    return service_request_service.list_disputed(db, admin_email=admin_email)


@router.post(
    "/admin/requests/{request_id}/decision",
    response_model=ServiceRequestRead,
    tags=["administracion"],
)
def decide_disputed_request(request_id: int, payload: AdminDisputeDecision, db: Session = Depends(get_db)):
    return service_request_service.resolve_dispute(
        db,
        request_id=request_id,
        admin_email=payload.admin_email,
        approve_payment=payload.approve_payment,
        notes=payload.notes,
    )
