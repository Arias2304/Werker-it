from decimal import Decimal
from functools import lru_cache

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import get_settings
from app.constants import COUNTRY_CONFIG
from app.core.security import get_password_hash, verify_password
from app.models.user import User, UserType


def _get_country_profile(country_code: str) -> dict:
    profile = COUNTRY_CONFIG.get(country_code.upper())
    if not profile:
        raise HTTPException(status_code=400, detail="PaÃ­s no soportado")
    return profile


def _ensure_email_available(db: Session, email: str) -> None:
    exists = db.scalar(select(User).where(User.email == email.lower()))
    if exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El correo ya estÃ¡ registrado")


@lru_cache
def _get_admin_domain() -> str:
    settings = get_settings()
    base_email = settings.admin_email
    if "@" in base_email:
        return base_email.split("@", 1)[1]
    return base_email


def get_admin_identity(country_code: str) -> dict:
    profile = _get_country_profile(country_code)
    slug = profile.get("admin_slug") or country_code.lower()
    username = f"admin{slug}".lower()
    email = f"{username}@{_get_admin_domain()}"
    return {
        "username": username,
        "email": email,
        "nationality_label": profile.get("nationality_label", profile["country_name"]),
    }


def create_client(
    db: Session,
    *,
    email: str,
    password: str,
    first_name: str,
    last_name: str,
    phone: str,
    address: str,
    country: str,
) -> User:
    profile = _get_country_profile(country)
    _ensure_email_available(db, email)

    user = User(
        email=email.lower(),
        first_name=first_name.strip(),
        last_name=last_name.strip(),
        phone=phone,
        address=address,
        specialty=None,
        country=country.upper(),
        currency=profile["currency"],
        language_code=profile["language_code"],
        password_hash=get_password_hash(password),
        user_type=UserType.client,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_professional(
    db: Session,
    *,
    email: str,
    password: str,
    first_name: str,
    last_name: str,
    phone: str,
    specialty: str,
    country: str,
) -> User:
    profile = _get_country_profile(country)
    _ensure_email_available(db, email)

    user = User(
        email=email.lower(),
        first_name=first_name.strip(),
        last_name=last_name.strip(),
        phone=phone,
        address=None,
        specialty=specialty,
        country=country.upper(),
        currency=profile["currency"],
        language_code=profile["language_code"],
        password_hash=get_password_hash(password),
        user_type=UserType.professional,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, *, email: str, password: str, user_type: UserType) -> User:
    statement = select(User).where(User.email == email.lower(), User.user_type == user_type)
    user = db.scalar(statement)
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales invÃ¡lidas")
    return user


def ensure_admin_user(db: Session, *, country: str, password: str) -> User:
    identity = get_admin_identity(country)
    existing = db.scalar(select(User).where(User.email == identity["email"]))
    if existing and existing.user_type == UserType.admin:
        return existing

    profile = _get_country_profile(country)

    admin_user = User(
        email=identity["email"],
        first_name="Admin",
        last_name=profile["country_name"],
        phone="+0000000000",
        address=None,
        specialty=None,
        country=country.upper(),
        currency=profile["currency"],
        language_code=profile["language_code"],
        password_hash=get_password_hash(password),
        user_type=UserType.admin,
        wallet_balance=Decimal("0"),
    )
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    return admin_user

