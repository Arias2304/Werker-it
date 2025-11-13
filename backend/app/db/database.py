from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker

from app.config import get_settings
from app.constants import COUNTRY_CONFIG
from app.models.base import Base
from app.services.user_service import ensure_admin_user

settings = get_settings()

DATABASE_URL = (
    f"postgresql+psycopg2://{settings.db_user}:{settings.db_password}"
    f"@{settings.db_host}:{settings.db_port}/{settings.db_name}"
)

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)


def init_db() -> None:
    """Crea las tablas si aún no existen."""
    import app.models.user  # noqa: F401
    import app.models.service_request  # noqa: F401
    import app.models.wallet_transaction  # noqa: F401
    import app.models.professional_service  # noqa: F401

    Base.metadata.create_all(bind=engine)
    _ensure_wallet_columns()
    _ensure_user_type_enum()
    _ensure_transaction_type_enum()
    _ensure_service_status_enum()
    _ensure_service_request_columns()
    with SessionLocal() as session:
        for country_code in COUNTRY_CONFIG.keys():
            ensure_admin_user(
                session,
                country=country_code,
                password=settings.admin_password,
            )


def _ensure_wallet_columns() -> None:
    """Agrega columnas nuevas si el esquema ya existía antes."""
    with engine.connect() as conn:
        inspector = inspect(conn)
        user_columns = {column["name"] for column in inspector.get_columns("users")}
        if "wallet_balance" not in user_columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN wallet_balance NUMERIC(14,2) DEFAULT 0"))
            conn.execute(text("UPDATE users SET wallet_balance = 0 WHERE wallet_balance IS NULL"))
            conn.commit()


def _ensure_user_type_enum() -> None:
    """Incluye el valor 'admin' en el enum usertype si no existe."""
    with engine.connect() as conn:
        conn.execute(text("ALTER TYPE usertype ADD VALUE IF NOT EXISTS 'admin'"))
        conn.commit()


def _ensure_transaction_type_enum() -> None:
    """Incluye valores faltantes en el enum transactiontype."""
    with engine.connect() as conn:
        conn.execute(text("ALTER TYPE transactiontype ADD VALUE IF NOT EXISTS 'service_payment'"))
        conn.execute(text("ALTER TYPE transactiontype ADD VALUE IF NOT EXISTS 'service_payout'"))
        conn.execute(text("ALTER TYPE transactiontype ADD VALUE IF NOT EXISTS 'commission_income'"))
        conn.commit()


def _ensure_service_status_enum() -> None:
    """Incluye el valor 'disputed' en el enum servicestatus si no existe."""
    with engine.connect() as conn:
        conn.execute(text("ALTER TYPE servicestatus ADD VALUE IF NOT EXISTS 'disputed'"))
        conn.commit()


def _ensure_service_request_columns() -> None:
    """Agrega columnas nuevas a service_requests cuando ya existA-a la tabla."""
    with engine.connect() as conn:
        inspector = inspect(conn)
        tables = inspector.get_table_names()
        if "service_requests" not in tables:
            return
        columns = {column["name"] for column in inspector.get_columns("service_requests")}
        statements = []
        if "client_feedback" not in columns:
            statements.append("ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS client_feedback VARCHAR(255)")
        if "satisfaction" not in columns:
            statements.append("ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS satisfaction BOOLEAN")
        if "completed_at" not in columns:
            statements.append("ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP")
        if "admin_reviewed_by" not in columns:
            statements.append("ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS admin_reviewed_by VARCHAR(120)")
        if "admin_reviewed_at" not in columns:
            statements.append("ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS admin_reviewed_at TIMESTAMP")
        if "admin_review_notes" not in columns:
            statements.append("ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS admin_review_notes VARCHAR(255)")
        for statement in statements:
            conn.execute(text(statement))
        if statements:
            conn.commit()


def get_db():
    """Provee una sesión de base de datos para inyección en FastAPI."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
