from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


def _csv_to_list(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Servicios Hogar Multipaís"
    api_prefix: str = "/api/v1"

    allowed_countries_raw: str = Field("MX,US,BR,FR,JP", alias="ALLOWED_COUNTRIES")
    supported_currencies_raw: str = Field("MXN,USD,BRL,EUR,JPY", alias="SUPPORTED_CURRENCIES")

    db_host: str = "localhost"
    db_port: int = 5432
    db_user: str = "postgres"
    db_password: str = "postgres"
    db_name: str = "servicios_hogar"
    admin_email: str = "admin@servicioshogar.com"
    admin_password: str = "Admin123!"
    admin_country: str = "MX"

    @property
    def allowed_countries(self) -> list[str]:
        return _csv_to_list(self.allowed_countries_raw)

    @property
    def supported_currencies(self) -> list[str]:
        return _csv_to_list(self.supported_currencies_raw)


@lru_cache
def get_settings() -> Settings:
    """Retorna la configuración cargada desde variables de entorno."""
    return Settings()
