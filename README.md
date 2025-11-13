# Plataforma Multipaís de Servicios para el Hogar

Este repositorio contiene la base del proyecto que digitaliza la contratación de servicios domésticos (plomería, electricidad, carpintería, etc.) en cinco países y monedas. El objetivo es ofrecer una plataforma confiable que conecte clientes y profesionales con procesos trazables, pagos electrónicos y formalización digital.

## Estructura del proyecto

- `backend/`: Aplicación Python (FastAPI + SQLAlchemy) y utilidades de configuración.
- `frontend/`: Prototipo HTML/CSS para validar el flujo principal de usuario.
- `docs/`: Documentación estratégica, incluyendo el plan de desarrollo solicitado.

## Puesta en marcha rápida

1. Crear y activar un entorno virtual de Python 3.11+.
2. Instalar dependencias `pip install -r backend/requirements.txt`.
3. Configurar un archivo `.env` en `backend/` basado en `.env.example`.
4. Ejecutar `uvicorn app.main:app --reload` desde la carpeta `backend/` **o** levantar todo con `docker compose up --build`.
5. Servir el frontend con cualquier servidor estático (por ejemplo `python -m http.server` dentro de `frontend/`).

## Funcionalidades actuales

- **Autenticación y registro:** endpoints REST para crear clientes (`/auth/register/client`) y profesionales (`/auth/register/professional`) almacenando la información en PostgreSQL con contraseñas hasheadas.
- **Login básico:** `/auth/login` valida credenciales para ambos tipos de usuario y devuelve los datos esenciales sin exponer contraseñas.
- **Catálogo multirregional:** `/meta/countries` expone los cinco países soportados (México, Estados Unidos, Brasil, Francia y Japón) con su idioma y moneda; `/meta/specialties` lista diez especialidades.
- **Billeteras simuladas:** cada usuario posee un saldo en su moneda local. Los clientes pueden fondear su cuenta vía `/payments/deposit`, los profesionales retiran mediante `/payments/withdraw`, y cualquier rol puede consultar `/payments/balance/{email}` o revisar movimientos con `/payments/transactions/{email}`.
- **Rol administrador por país:** se provisiona un usuario por mercado (`adminmexico@servicioshogar.com`, `adminusa@servicioshogar.com`, `adminbrasil@servicioshogar.com`, `adminfrancia@servicioshogar.com` y `adminjapon@servicioshogar.com`, todos con la clave `Admin123!`) para auditar operaciones con idioma y reglas locales.
- **Frontend conectado:** la SPA ligera en `frontend/` consume los metadatos, ofrece formularios de login/registro, y expone controles para depósitos y retiros simulados usando `fetch`.

## Próximos pasos recomendados

La ruta técnica completa se detalla en `docs/development_plan.md`. El siguiente entregable consiste en profundizar la persistencia de servicios, integrar pasarelas de pago multi-moneda y completar los flujos de reputación y soporte.
