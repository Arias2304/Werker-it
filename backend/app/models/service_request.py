from datetime import datetime
from decimal import Decimal

from sqlalchemy import Enum, ForeignKey, String, DateTime, Numeric, Float, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.models.base import Base, CountryCurrencyMixin


class ServiceStatus(str, enum.Enum):
    pending = "pending"
    assigned = "assigned"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"
    disputed = "disputed"


class ServiceRequest(Base, CountryCurrencyMixin):
    __tablename__ = "service_requests"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    category: Mapped[str] = mapped_column(String(64))
    description: Mapped[str] = mapped_column(String(255))
    urgency: Mapped[str] = mapped_column(String(16), default="normal")
    location_lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    location_lng: Mapped[float | None] = mapped_column(Float, nullable=True)
    scheduled_at: Mapped[datetime | None] = mapped_column(DateTime)
    status: Mapped[ServiceStatus] = mapped_column(Enum(ServiceStatus), default=ServiceStatus.pending)
    estimated_cost: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))
    client_feedback: Mapped[str | None] = mapped_column(String(255), nullable=True)
    satisfaction: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    admin_reviewed_by: Mapped[str | None] = mapped_column(String(120), nullable=True)
    admin_reviewed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    admin_review_notes: Mapped[str | None] = mapped_column(String(255), nullable=True)

    client_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    professional_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"))

    client = relationship("User", foreign_keys=[client_id], back_populates="service_requests")
    professional = relationship("User", foreign_keys=[professional_id], back_populates="assignments")

    @property
    def client_email(self) -> str | None:
        return self.client.email if self.client else None

    @property
    def professional_email(self) -> str | None:
        return self.professional.email if self.professional else None
