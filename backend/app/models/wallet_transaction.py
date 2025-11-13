from decimal import Decimal
import enum

from sqlalchemy import Enum, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class TransactionType(str, enum.Enum):
    deposit = "deposit"
    withdrawal = "withdrawal"
    service_payment = "service_payment"
    service_payout = "service_payout"
    commission_income = "commission_income"


class WalletTransaction(Base):
    __tablename__ = "wallet_transactions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    amount: Mapped[Decimal] = mapped_column(Numeric(14, 2))
    transaction_type: Mapped[TransactionType] = mapped_column(Enum(TransactionType))
    currency: Mapped[str] = mapped_column(String(3))
    description: Mapped[str | None] = mapped_column(String(160), nullable=True)

    user = relationship("User", back_populates="wallet_transactions")
