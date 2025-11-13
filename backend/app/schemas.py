from datetime import datetime
from decimal import Decimal
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, condecimal, constr

from app.models.service_request import ServiceStatus
from app.models.user import UserType
from app.models.wallet_transaction import TransactionType


class CountryOption(BaseModel):
    code: str
    name: str
    language_label: str
    language_code: str
    currency: str
    nationality_label: str
    admin_username: str
    admin_email: EmailStr


class SpecialtyOption(BaseModel):
    name: str


class ClientRegisterRequest(BaseModel):
    email: EmailStr
    password: constr(min_length=8)
    first_name: constr(min_length=1, max_length=80)
    last_name: constr(min_length=1, max_length=120)
    phone: constr(min_length=7, max_length=32)
    address: constr(min_length=5, max_length=160)
    country: constr(min_length=2, max_length=2)


class ProfessionalRegisterRequest(BaseModel):
    email: EmailStr
    password: constr(min_length=8)
    first_name: constr(min_length=1, max_length=80)
    last_name: constr(min_length=1, max_length=120)
    phone: constr(min_length=7, max_length=32)
    specialty: constr(min_length=3, max_length=80)
    country: constr(min_length=2, max_length=2)


class LoginRequest(BaseModel):
    email: EmailStr
    password: constr(min_length=8)
    user_type: UserType


class UserRead(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str
    phone: str
    address: Optional[str]
    specialty: Optional[str]
    country: str
    currency: str
    language_code: str
    user_type: UserType
    rating: Optional[float] = Field(default=None)
    wallet_balance: Decimal

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    message: str
    user: UserRead


class WalletOperationRequest(BaseModel):
    email: EmailStr
    amount: condecimal(gt=0, max_digits=12, decimal_places=2)


class WalletOperationResponse(BaseModel):
    email: EmailStr
    new_balance: Decimal
    currency: str
    message: str


class WalletTransactionRead(BaseModel):
    id: int
    transaction_type: TransactionType
    amount: Decimal
    currency: str
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ServiceRequestBase(BaseModel):
    category: str
    description: str
    urgency: str = "normal"
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    country: constr(min_length=2, max_length=2)
    currency: constr(min_length=3, max_length=3)


class ServiceRequestCreate(ServiceRequestBase):
    scheduled_at: Optional[datetime] = None
    client_id: int


class ServiceRequestRead(ServiceRequestBase):
    id: int
    professional_id: Optional[int]
    status: ServiceStatus
    estimated_cost: Optional[float]
    scheduled_at: Optional[datetime]
    client_email: Optional[EmailStr]
    professional_email: Optional[EmailStr]
    client_feedback: Optional[str]
    satisfaction: Optional[bool]
    completed_at: Optional[datetime]
    admin_reviewed_by: Optional[str]
    admin_reviewed_at: Optional[datetime]
    admin_review_notes: Optional[str]

    class Config:
        from_attributes = True


class ProfessionalServiceCreateRequest(BaseModel):
    professional_email: Optional[EmailStr] = None
    professional_id: Optional[int] = None
    title: constr(min_length=3, max_length=120)
    description: constr(min_length=3, max_length=255)
    specialty: Optional[constr(min_length=3, max_length=80)] = None
    base_cost: condecimal(gt=0, max_digits=12, decimal_places=2)


class ProfessionalServiceRead(BaseModel):
    id: int
    title: str
    description: str
    specialty: Optional[str]
    base_cost: Decimal
    currency: str
    professional_id: int

    class Config:
        from_attributes = True


class ProfessionalSummary(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    specialty: Optional[str]
    country: str
    currency: str
    rating: Optional[float] = Field(default=None)

    class Config:
        from_attributes = True


class ProfessionalServiceCatalogEntry(BaseModel):
    professional: ProfessionalSummary
    services: list[ProfessionalServiceRead]


class ClientServiceRequestPayload(BaseModel):
    client_email: EmailStr
    service_id: int
    description: constr(min_length=5, max_length=255)
    urgency: constr(min_length=3, max_length=16) = "normal"
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    scheduled_at: Optional[datetime] = None


class ServiceRequestDecision(BaseModel):
    professional_email: EmailStr
    action: Literal["accept", "reject"]
    scheduled_at: Optional[datetime] = None


class ClientRequestConfirmation(BaseModel):
    client_email: EmailStr
    satisfied: bool
    feedback: Optional[constr(max_length=255)] = None


class AdminDisputeDecision(BaseModel):
    admin_email: EmailStr
    approve_payment: bool
    notes: Optional[constr(max_length=255)] = None
