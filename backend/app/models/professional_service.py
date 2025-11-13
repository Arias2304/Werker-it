from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class ProfessionalService(Base):
    __tablename__ = "professional_services"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    professional_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(120))
    description: Mapped[str] = mapped_column(String(255))
    specialty: Mapped[str | None] = mapped_column(String(80), nullable=True)
    base_cost: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(3))

    professional = relationship("User", back_populates="services_offered")
