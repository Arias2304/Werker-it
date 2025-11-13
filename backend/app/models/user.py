from decimal import Decimal
import enum

from sqlalchemy import Enum, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING

from app.models.base import Base, CountryCurrencyMixin

if TYPE_CHECKING:
    from app.models.professional_service import ProfessionalService


class UserType(str, enum.Enum):
    client = "client"
    professional = "professional"
    admin = "admin"


class User(Base, CountryCurrencyMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    first_name: Mapped[str] = mapped_column(String(80))
    last_name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    phone: Mapped[str] = mapped_column(String(32))
    address: Mapped[str | None] = mapped_column(String(160), nullable=True)
    specialty: Mapped[str | None] = mapped_column(String(80), nullable=True)
    language_code: Mapped[str] = mapped_column(String(8))
    password_hash: Mapped[str] = mapped_column(String(255))
    user_type: Mapped[UserType] = mapped_column(Enum(UserType))
    wallet_balance: Mapped[Decimal] = mapped_column(Numeric(14, 2), default=0)
    rating: Mapped[float | None] = mapped_column(nullable=True)

    service_requests = relationship("ServiceRequest", back_populates="client", foreign_keys="ServiceRequest.client_id")
    assignments = relationship(
        "ServiceRequest", back_populates="professional", foreign_keys="ServiceRequest.professional_id"
    )
    wallet_transactions = relationship("WalletTransaction", back_populates="user", cascade="all, delete-orphan")
    services_offered: Mapped[list["ProfessionalService"]] = relationship(
        "ProfessionalService", back_populates="professional", cascade="all, delete-orphan"
    )
