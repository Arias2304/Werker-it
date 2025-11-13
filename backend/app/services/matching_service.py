from collections.abc import Sequence

from app.models.user import User, UserType
from app.models.service_request import ServiceRequest, ServiceStatus


def score_professionals(professionals: Sequence[User], request: ServiceRequest) -> Sequence[User]:
    """Devuelve profesionales ordenados por afinidad básica (placeholder)."""
    return sorted(
        professionals,
        key=lambda prof: (
            prof.country == request.country,
            prof.currency == request.currency,
            prof.rating or 0,
        ),
        reverse=True,
    )


def auto_assign(request: ServiceRequest, professionals: Sequence[User]) -> ServiceRequest:
    """Asigna el primer profesional disponible según el puntaje actual."""
    ranked = score_professionals(professionals, request)
    if ranked:
        request.professional_id = ranked[0].id
        request.status = ServiceStatus.assigned
    return request
