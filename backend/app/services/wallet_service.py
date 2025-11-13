from decimal import Decimal, ROUND_HALF_UP

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.constants import COUNTRY_CONFIG
from app.models.user import User, UserType
from app.models.wallet_transaction import TransactionType, WalletTransaction


def _get_user_by_email(db: Session, email: str) -> User:
    statement = select(User).where(User.email == email.lower())
    user = db.scalar(statement)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    return user


def _validate_currency(user: User) -> str:
    profile = COUNTRY_CONFIG.get(user.country)
    if not profile:
        raise HTTPException(status_code=400, detail="Usuario con país no soportado")
    return profile["currency"]


def deposit(db: Session, *, email: str, amount: Decimal) -> User:
    user = _get_user_by_email(db, email)
    if user.user_type != UserType.client:
        raise HTTPException(status_code=403, detail="Solo clientes pueden depositar fondos")

    user.wallet_balance = (user.wallet_balance or Decimal("0")) + amount
    currency = _validate_currency(user)

    transaction = WalletTransaction(
        user_id=user.id,
        amount=amount,
        transaction_type=TransactionType.deposit,
        currency=currency,
        description="Depósito manual",
    )
    db.add(transaction)
    db.commit()
    db.refresh(user)
    return user


def withdraw(db: Session, *, email: str, amount: Decimal) -> User:
    user = _get_user_by_email(db, email)
    if user.user_type != UserType.professional:
        raise HTTPException(status_code=403, detail="Solo profesionales pueden retirar fondos")

    if amount > user.wallet_balance:
        raise HTTPException(status_code=400, detail="Fondos insuficientes")

    user.wallet_balance = user.wallet_balance - amount
    currency = _validate_currency(user)

    transaction = WalletTransaction(
        user_id=user.id,
        amount=amount,
        transaction_type=TransactionType.withdrawal,
        currency=currency,
        description="Retiro manual",
    )
    db.add(transaction)
    db.commit()
    db.refresh(user)
    return user


def transfer(
    db: Session,
    *,
    payer_email: str,
    payee_email: str,
    amount: Decimal,
    description: str | None = None,
    commission_email: str | None = None,
    commission_percentage: Decimal | float | None = None,
) -> tuple[User, User]:
    if amount <= 0:
        raise HTTPException(status_code=400, detail="El monto debe ser mayor a cero")

    if not isinstance(amount, Decimal):
        amount = Decimal(str(amount))

    payer = _get_user_by_email(db, payer_email)
    payee = _get_user_by_email(db, payee_email)

    if payer.user_type != UserType.client:
        raise HTTPException(status_code=403, detail="El pagador debe ser un cliente")
    if payee.user_type != UserType.professional:
        raise HTTPException(status_code=403, detail="El receptor debe ser un profesional")

    if amount > payer.wallet_balance:
        raise HTTPException(status_code=400, detail="El cliente no tiene fondos suficientes")

    payer_currency = _validate_currency(payer)
    payee_currency = _validate_currency(payee)
    if payer_currency != payee_currency:
        raise HTTPException(status_code=400, detail="Los usuarios manejan monedas distintas")

    commission_amount = Decimal("0")
    commission_recipient = None
    if commission_percentage is not None:
        commission_rate = Decimal(str(commission_percentage))
        if commission_rate < 0 or commission_rate >= 1:
            raise HTTPException(status_code=400, detail="Porcentaje de comision invalido")
        if commission_rate > 0:
            if not commission_email:
                raise HTTPException(status_code=400, detail="Debes indicar el administrador que recibe la comision")
            commission_recipient = _get_user_by_email(db, commission_email)
            if commission_recipient.user_type != UserType.admin:
                raise HTTPException(status_code=403, detail="La comision solo puede abonarse a un administrador")
            if commission_recipient.country != payer.country:
                raise HTTPException(status_code=403, detail="La comision debe asignarse al administrador regional")
            commission_currency = _validate_currency(commission_recipient)
            if commission_currency != payer_currency:
                raise HTTPException(status_code=400, detail="El administrador maneja una moneda distinta")
            commission_amount = (amount * commission_rate).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    elif commission_email:
        raise HTTPException(status_code=400, detail="Debes indicar el porcentaje de comision")

    payee_amount = amount - commission_amount
    payer.wallet_balance = payer.wallet_balance - amount
    payee.wallet_balance = (payee.wallet_balance or Decimal("0")) + payee_amount
    if commission_recipient and commission_amount > 0:
        commission_recipient.wallet_balance = (commission_recipient.wallet_balance or Decimal("0")) + commission_amount

    payment_tx = WalletTransaction(
        user_id=payer.id,
        amount=amount,
        transaction_type=TransactionType.service_payment,
        currency=payer_currency,
        description=description or "Pago de servicio completado",
    )
    transactions = [payment_tx]
    if payee_amount > 0:
        transactions.append(
            WalletTransaction(
                user_id=payee.id,
                amount=payee_amount,
                transaction_type=TransactionType.service_payout,
                currency=payee_currency,
                description=description or "Servicio completado",
            )
        )
    if commission_recipient and commission_amount > 0:
        transactions.append(
            WalletTransaction(
                user_id=commission_recipient.id,
                amount=commission_amount,
                transaction_type=TransactionType.commission_income,
                currency=payer_currency,
                description=f"{description or 'Servicio completado'} - Comision",
            )
        )
    db.add_all(transactions)
    db.commit()
    db.refresh(payer)
    db.refresh(payee)
    if commission_recipient and commission_amount > 0:
        db.refresh(commission_recipient)
    return payer, payee


def list_transactions(db: Session, *, email: str) -> list[WalletTransaction]:
    user = _get_user_by_email(db, email)
    statement = (
        select(WalletTransaction)
        .where(WalletTransaction.user_id == user.id)
        .order_by(WalletTransaction.created_at.desc())
    )
    return db.scalars(statement).all()


def get_balance(db: Session, *, email: str) -> User:
    return _get_user_by_email(db, email)
