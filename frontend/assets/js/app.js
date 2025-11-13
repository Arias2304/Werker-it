
const API_BASE = "http://localhost:8000/api/v1";

const countryList = document.getElementById("country-list");
const countrySelects = document.querySelectorAll("[data-country-select]");
const specialtySelects = document.querySelectorAll("[data-specialty-select]");
const languageSelect = document.getElementById("language-select");
const sessionEmailPlaceholders = document.querySelectorAll("[data-session-email]");
const catalogSpecialtySelect = document.getElementById("catalog-specialty");
const serviceCatalogContainer = document.getElementById("service-catalog");
const professionalServiceList = document.getElementById("professional-service-list");
const professionalServiceEmptyState = document.getElementById("professional-service-empty");
const professionalRequestList = document.getElementById("professional-request-list");
const professionalRequestEmptyState = document.getElementById("professional-request-empty");
const professionalRequestMessage = document.getElementById("professional-request-message");
const clientRequestList = document.getElementById("client-request-list");
const clientRequestEmptyState = document.getElementById("client-request-empty");
const clientRequestMessage = document.getElementById("client-request-message");
const adminDisputeList = document.getElementById("admin-dispute-list");
const adminDisputeEmptyState = document.getElementById("admin-dispute-empty");
const adminDisputeMessage = document.getElementById("admin-dispute-message");
const walletBalanceTargets = document.querySelectorAll("[data-wallet-balance]");
const walletBalanceLabelKeys = {
  client: "wallet_balance_client_label",
  professional: "wallet_balance_professional_label",
  admin: "wallet_balance_admin_label",
};
const professionalServiceSpecialtySelect = document.querySelector(
  "#professional-service-form select[name='specialty']"
);
const serviceSelectionSummary = document.getElementById("selected-service-summary");
const serviceSelectionDetails = serviceSelectionSummary?.querySelector(".service-selection__details") || null;
const serviceSelectionPlaceholder = serviceSelectionSummary?.querySelector(".service-selection__placeholder") || null;
const selectedServiceNameNode = document.getElementById("selected-service-name");
const selectedServicePriceNode = document.getElementById("selected-service-price");
const selectedServiceProfessionalNode = document.getElementById("selected-service-professional");
const selectedServiceInput = document.getElementById("service-request-service-id");
const registerTabs = document.querySelectorAll("[data-register-tab]");
const registerPanels = document.querySelectorAll("[data-register-panel]");
const adminIdentityNodes = document.querySelectorAll("[data-admin-identity]");
const adminUsernameNodes = document.querySelectorAll("[data-admin-username]");
const adminEmailNodes = document.querySelectorAll("[data-admin-email]");
const adminCredentialList = document.getElementById("admin-credential-list");
const authViewTabs = document.querySelectorAll("[data-auth-view]");
const authViewPanels = document.querySelectorAll("[data-auth-panel]");
const authViewTriggers = document.querySelectorAll("[data-auth-trigger]");

const messageMap = {
  "login-form": document.getElementById("login-form-message"),
  "client-form": document.getElementById("client-form-message"),
  "professional-form": document.getElementById("professional-form-message"),
  "deposit-form": document.getElementById("deposit-form-message"),
  "withdraw-form": document.getElementById("withdraw-form-message"),
  "professional-service-form": document.getElementById("professional-service-form-message"),
  "service-request-form": document.getElementById("service-request-form-message"),
  "professional-request-message": professionalRequestMessage,
  "client-request-message": clientRequestMessage,
  "admin-dispute-message": adminDisputeMessage,
};

const WORKSPACE_ROUTES = {
  client: "client.html",
  professional: "professional.html",
  admin: "admin.html",
};

const SESSION_KEY = "activeUserSession";
const workspaceType = document.body?.dataset?.workspace || null;

const STORAGE_KEYS = {
  preferences: "userPreferences",
  language: "uiLanguage",
};

let activeSession = null;

const getActiveSession = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const persistSession = (session) => {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  activeSession = session;
};

const clearSession = () => {
  sessionStorage.removeItem(SESSION_KEY);
  activeSession = null;
};

const getSession = () => {
  if (!activeSession) {
    activeSession = getActiveSession();
  }
  return activeSession;
};

const setAdminTheme = (countryCode) => {
  if (!document?.body) return;
  if (!countryCode) {
    document.body.removeAttribute("data-admin-country");
    return;
  }
  document.body.dataset.adminCountry = countryCode.toLowerCase();
};

const translations = {
  es: {
    hero_chip: "5 países · 5 idiomas · 5 monedas",
    language_label: "Idioma",
    hero_heading: "Conecta clientes y profesionales con procesos seguros",
    hero_subtitle:
      "Operamos en español, inglés, portugués, francés y japonés, respetando la divisa local de cada mercado.",
    hero_cta: "Comenzar ahora",
    how_title: "Cómo funciona",
    how_step_one: "Regístrate como cliente o profesional validado.",
    how_step_two: "Selecciona país, idioma y moneda disponibles.",
    how_step_three: "Recibe confirmaciones y seguimiento automatizado.",
    how_step_four: "Gestiona pagos electrónicos y reputación transparente.",
    markets_title: "Mercados activos",
    auth_title: "Gestiona tu acceso",
    auth_copy: "Inicia sesión o regístrate sin cambiar de página.",
    auth_brand_headline: "Bienvenido a WERKER-IT",
    auth_brand_copy: "Conecta clientes y profesionales con seguimiento transparente.",
    auth_benefit_one: "Onboarding guiado para clientes y especialistas.",
    auth_benefit_two: "Registro y login en un mismo flujo.",
    auth_benefit_three: "Operaciones seguras en toda la región.",
    role_selection_title: "Elige tu experiencia",
    role_selection_copy: "Ingresa directamente al ambiente que corresponde a tu rol.",
    role_card_client_description:
      "Solicita servicios, gestiona pagos locales y haz seguimiento a profesionales verificados.",
    role_card_professional_description:
      "Administra tus retiros, agenda servicios y mantén tu reputación al día.",
    role_card_admin_description: "Audita operaciones, revisa balances y ejecuta controles de cumplimiento.",
    role_card_button: "Abrir página",
    role_back_home: "Volver al inicio",
    client_workspace_heading: "Ambiente de clientes",
    client_workspace_intro: "Accede a tus registros, depósitos y seguimiento personalizado.",
    professional_workspace_heading: "Ambiente de profesionales",
    professional_workspace_intro: "Gestiona agenda, retiros y reputación global en un solo lugar.",
    admin_workspace_heading: "Ambiente de administración",
    admin_workspace_intro: "Supervisa balances, auditorías y controles regulatorios en la región.",
    admin_workspace_point_one: "Controla saldos en tiempo real.",

    admin_workspace_point_two: "Revisa logs y evidencias exportables.",

    admin_workspace_point_three: "Coordina acciones con equipos locales.",
    admin_identity_title: "Administrador nacional activo",
    admin_identity_username: "Usuario asignado",
    admin_identity_email: "Correo corporativo",
    admin_identity_hint: "Este entorno adopta el idioma y las normas del país que administras.",
    admin_wallet_title: "Comisiones retenidas",
    admin_wallet_hint: "Visualiza el 10% transferido al administrador regional por trabajos completados.",
    admin_credentials_title: "Administradores por país",
    admin_credentials_copy: "Cada mercado tiene su usuario corporativo y comparte la misma clave maestra.",
    admin_credentials_empty: "Aún no hay credenciales para mostrar.",

    logout_button: "Cerrar sesión",

    auth_tab_login: "Iniciar sesión",
    auth_tab_register: "Registrarse",
    login_title: "Iniciar sesión",
    login_email_label: "Correo electrónico",
    login_email_placeholder: "usuario@correo.com",
    login_password_label: "Contraseña",
    login_password_placeholder: "********",
    login_user_type_label: "Tipo de usuario",
    login_button: "Ingresar",
    user_type_client: "Cliente",
    user_type_professional: "Profesional",
    user_type_admin: "Administrador",
    register_title: "Registro rápido",
    register_caption: "Elige el tipo de cuenta que deseas crear.",
    registration_fee_notice:
      "WERKER-IT retiene automaticamente un 10% de cada trabajo completado y lo transfiere al administrador regional.",
    registration_fee_accept_label: "Acepto este cobro administrativo y deseo crear mi cuenta.",
    register_tab_client: "Cliente",
    register_tab_professional: "Profesional",
    client_name_label: "Nombre",
    client_lastname_label: "Apellidos",
    client_email_label: "Correo",
    client_password_label: "Contraseña (min. 8 caracteres)",
    client_phone_label: "Teléfono",
    client_address_label: "Dirección",
    client_country_label: "País e idioma / Nacionalidad",
    client_submit: "Crear cuenta cliente",
    professional_name_label: "Nombre",
    professional_lastname_label: "Apellidos",
    professional_email_label: "Correo",
    professional_password_label: "Contraseña (min. 8 caracteres)",
    professional_phone_label: "Teléfono",
    professional_specialty_label: "Especialidad",
    professional_country_label: "País e idioma / Nacionalidad",
    professional_submit: "Crear cuenta profesional",
    deposit_title: "Depósito de clientes",
    deposit_email_label: "Correo del cliente",
    deposit_amount_label: "Monto (moneda local)",
    deposit_button: "Depositar",
    withdraw_title: "Retiro de profesionales",
    withdraw_email_label: "Correo del profesional",
    withdraw_amount_label: "Monto (moneda local)",
    withdraw_button: "Retirar",
    session_context_professional: "Sesión activa como profesional: {email}",
    session_context_client: "Sesión activa como cliente: {email}",
    session_context_admin: "Sesión activa como administrador: {email}",
    session_missing: "Tu sesión no está disponible. Vuelve a iniciar sesión.",
    session_wrong_workspace: "Tu sesión no coincide con esta vista. Vuelve a iniciar sesión.",
    professional_services_card_title: "Catálogo de trabajos",
    professional_services_card_subtitle: "Describe los servicios que ofreces y cuánto cobra cada uno.",
    professional_services_email_label: "Correo profesional",
    professional_services_specialty_label: "Especialidad del trabajo",
    professional_services_specialty_locked: "Esta especialidad se toma de tu perfil y no se puede cambiar aqui.",
    professional_services_name_label: "Nombre del trabajo",
    professional_services_description_label: "Descripción",
    professional_services_cost_label: "Costo base",
    professional_services_submit: "Registrar trabajo",
    professional_services_preview_title: "Trabajos registrados recientemente",
    professional_services_empty: "Aún no has registrado trabajos.",
    professional_services_specialty_unknown: "Especialidad sin definir",
    professional_requests_title: "Solicitudes recibidas",
    professional_requests_caption: "Revisa las solicitudes entrantes y decide si las aceptas o rechazas.",
    professional_requests_empty: "Aun no tienes solicitudes pendientes.",
    professional_requests_accept: "Aceptar",
    professional_requests_reject: "Rechazar",
    professional_requests_error: "No pudimos actualizar la solicitud",
    professional_requests_accept_success: "Solicitud aceptada",
    professional_requests_reject_success: "Solicitud rechazada",
    professional_requests_schedule_label: "Fecha programada",
    professional_requests_schedule_hint: "Selecciona el d\u00eda y hora para realizar el trabajo.",
    professional_requests_schedule_required: "Debes seleccionar una fecha para aceptar la solicitud.",
    professional_requests_client_label: "Cliente: {email}",
    client_requests_title: "Solicitudes activas",
    client_requests_caption: "Monitorea tus solicitudes y confirma el resultado una vez realizado el trabajo.",
    client_requests_empty: "A\u00fan no has creado solicitudes.",
    client_requests_status_pending: "En revisi\u00f3n",
    client_requests_status_assigned: "Programada",
    client_requests_status_completed: "Completada",
    client_requests_status_cancelled: "Cancelada",
    client_requests_status_disputed: "En revisi\u00f3n administrativa",
    client_requests_schedule_pending: "Esperando confirmaci\u00f3n del profesional.",
    client_requests_schedule_info: "Programado para {date}.",
    client_requests_wait_for_date: "Podr\u00e1s confirmar cuando llegue la fecha programada.",
    client_requests_ready_to_confirm: "Tu opini\u00f3n liberar\u00e1 el pago al profesional.",
    client_requests_feedback_placeholder: "Comentarios para el profesional (opcional)",
    client_requests_accept_action: "Trabajo satisfactorio",
    client_requests_reject_action: "Hubo un problema",
    client_requests_error: "No pudimos actualizar la solicitud",
    client_requests_success_positive: "Gracias por confirmar, liberamos el pago.",
    client_requests_success_negative: "Registramos tu comentario. Un administrador revisar\u00e1 la disputa.",
    client_requests_disputed_message: "Un administrador revisar\u00e1 el caso antes de liberar el pago.",
    client_requests_dispute_rejected: "La administraci\u00f3n confirm\u00f3 que no se realizar\u00e1 el pago.",
    client_requests_dispute_approved: "La administraci\u00f3n autoriz\u00f3 el pago aun con tu inconformidad.",
    client_requests_admin_resolution: "Revisado por: {email}",
    client_requests_admin_notes_label: "Notas de administraci\u00f3n: {notes}",
    client_requests_professional_label: "Profesional: {email}",
    client_requests_cost_label: "Costo estimado: {amount}",
    client_requests_urgency_label: "Urgencia: {urgency}",
    client_requests_rejected_by_professional: "El profesional rechaz\u00f3 esta solicitud.",
    wallet_balance_client_label: "Fondos disponibles: {amount}",
    wallet_balance_professional_label: "Saldo disponible: {amount}",
    wallet_balance_admin_label: "Comisiones administradas: {amount}",
    wallet_balance_error: "No pudimos consultar tu balance",
    catalog_title: "Catálogo de profesionales",
    catalog_caption: "Explora los perfiles disponibles y conoce los trabajos registrados.",
    catalog_filter_label: "Especialidad",
    catalog_empty: "No hay profesionales con servicios registrados para esta especialidad.",
    catalog_error: "No pudimos cargar el catálogo",
    catalog_country_required: "Inicia sesión para ver los servicios disponibles en tu país.",
    catalog_select_button: "Seleccionar",
    specialty_filter_all: "Todas las especialidades",
    service_request_title: "Solicita un servicio",
    service_request_caption: "Selecciona un trabajo del catálogo y envía tu solicitud.",
    service_request_client_email_label: "Correo del cliente",
    service_request_description_label: "Descripción de la necesidad",
    service_request_urgency_label: "Urgencia",
    service_request_submit: "Enviar solicitud",
    service_request_selected_placeholder: "Ningún servicio seleccionado todavía.",
    service_request_professional_label: "Atenderá {professional} - {specialty}",
    service_request_missing_service: "Selecciona un servicio antes de enviar tu solicitud.",
    urgency_low: "Baja",
    urgency_normal: "Normal",
    urgency_high: "Alta",
    admin_title: "Modo administrador",
    admin_copy: "El administrador puede iniciar sesión para auditar balances y operaciones.",
    admin_user_label: "Usuario:",
    admin_password_label: "Contraseña:",
    admin_hint: "Consulta saldos y transacciones por correo usando las APIs de pagos.",
    admin_disputes_title: "Solicitudes en disputa",
    admin_disputes_caption: "Decide si corresponde liberar o retener el pago seg\u00fan la informaci\u00f3n recibida.",
    admin_disputes_empty: "No hay disputas pendientes por revisar.",
    admin_disputes_error: "No pudimos cargar las disputas",
    admin_disputes_notes_placeholder: "Notas administrativas (opcional)",
    admin_disputes_action_pay: "Liberar pago",
    admin_disputes_action_uphold: "Mantener sin pago",
    admin_disputes_paid_success: "Pago liberado correctamente.",
    admin_disputes_denied_success: "Confirmaste que no se realizar\u00e1 el pago.",
    admin_disputes_client_feedback: "Comentario del cliente: {feedback}",
    admin_disputes_client_feedback_missing: "El cliente no dej\u00f3 comentarios.",
    dashboard_close: "Cerrar vista",
    footer_copy: "© 2024 Plataforma Multiplataforma · Cumplimos normativas locales.",
    country_item_label: "{name} · Idioma: {language} · {nationality}",
    processing: "Procesando...",
    generic_error: "Ocurrió un error",
    success_default: "Operación exitosa",
    country_error: "No se pudo cargar la configuración regional",
    language_names: {
      es: "español",
      en: "inglés",
      pt: "portugués",
      fr: "francés",
      ja: "japonés",
    },
    dashboard: {
      client: {
        eyebrow: "Experiencia de cliente",
        title: "Panel personal de servicios",
        message: "Gestionas tus solicitudes en {language} gracias a tu registro desde {country}.",
        highlights: [
          "Seguimiento en vivo de profesionales confiables",
          "Pagos protegidos en la moneda local",
          "Historial y reputación sincronizados",
        ],
      },
      professional: {
        eyebrow: "Zona profesional",
        title: "Agenda inteligente y cobros seguros",
        message: "Tu portafolio se muestra en {language} para clientes de {country} y de la región.",
        highlights: [
          "Agenda con recordatorios automáticos",
          "Herramientas para enviar cotizaciones y facturas",
          "Acceso rápido a retiros y reputación",
        ],
      },
      admin: {
        eyebrow: "Centro administrativo",
        title: "Supervisión y auditoría",
        message: "Revisa operaciones globales y asegura el cumplimiento en todos los idiomas.",
        highlights: [
          "Panel consolidado de pagos y saldos",
          "Alertas de riesgos y conciliaciones",
          "Controles avanzados de auditoría",
        ],
      },
    },
  },
  en: {
    hero_chip: "5 countries · 5 languages · 5 currencies",
    language_label: "Language",
    hero_heading: "Connect clients and professionals with safe workflows",
    hero_subtitle:
      "We operate in Spanish, English, Portuguese, French and Japanese while respecting every market's local currency.",
    hero_cta: "Get started",
    how_title: "How it works",
    how_step_one: "Register as a client or verified professional.",
    how_step_two: "Choose your available country, language and currency.",
    how_step_three: "Receive confirmations and automated follow-up.",
    how_step_four: "Manage digital payments and transparent reputation.",
    markets_title: "Active markets",
    auth_title: "Manage your access",
    auth_copy: "Sign in or register without leaving this page.",
    auth_brand_headline: "Welcome to WERKER-IT",
    auth_brand_copy: "Connect clients and professionals with transparent tracking.",
    auth_benefit_one: "Guided onboarding for clients and specialists.",
    auth_benefit_two: "Sign up and login in a single flow.",
    auth_benefit_three: "Secure operations across the region.",
    role_selection_title: "Choose your workspace",
    role_selection_copy: "Jump straight into the environment that matches your role.",
    role_card_client_description:
      "Request services, manage local payments and follow verified professionals.",
    role_card_professional_description:
      "Handle withdrawals, schedule jobs and keep your reputation up to date.",
    role_card_admin_description:
      "Audit operations, review balances and run the necessary compliance controls.",
    role_card_button: "Open page",
    role_back_home: "Back to home",
    client_workspace_heading: "Client workspace",
    client_workspace_intro: "Access registrations, deposits and personalized tracking.",
    professional_workspace_heading: "Professional workspace",
    professional_workspace_intro: "Manage your schedule, payouts and reputation in one place.",
    admin_workspace_heading: "Admin workspace",
    admin_workspace_intro: "Supervise balances, audits and regulatory controls across the region.",
    admin_workspace_point_one: "Monitor real-time balances.",

    admin_workspace_point_two: "Review logs and exportable evidence.",

    admin_workspace_point_three: "Coordinate actions with local teams.",
    admin_identity_title: "Active national administrator",
    admin_identity_username: "Assigned username",
    admin_identity_email: "Corporate email",
    admin_identity_hint: "This view adopts the language and rules of the country you oversee.",
    admin_wallet_title: "Retained commissions",
    admin_wallet_hint: "Shows the 10% routed to the regional administrator for completed jobs.",
    admin_credentials_title: "Country administrators",
    admin_credentials_copy: "Each market has its own corporate user while sharing the master password.",
    admin_credentials_empty: "No credential data available yet.",

    logout_button: "Log out",

    auth_tab_login: "Sign in",
    auth_tab_register: "Register",
    login_title: "Sign in",
    login_email_label: "Email",
    login_email_placeholder: "user@email.com",
    login_password_label: "Password",
    login_password_placeholder: "********",
    login_user_type_label: "User type",
    login_button: "Enter",
    user_type_client: "Client",
    user_type_professional: "Professional",
    user_type_admin: "Admin",
    register_title: "Quick registration",
    register_caption: "Choose the account type you want to create.",
    registration_fee_notice:
      "WERKER-IT automatically withholds 10% from every completed job and transfers it to the regional administrator.",
    registration_fee_accept_label: "I accept this administrative fee and want to create my account.",
    register_tab_client: "Client",
    register_tab_professional: "Professional",
    client_name_label: "First name",
    client_lastname_label: "Last name",
    client_email_label: "Email",
    client_password_label: "Password (min. 8 characters)",
    client_phone_label: "Phone",
    client_address_label: "Address",
    client_country_label: "Country & language / Nationality",
    client_submit: "Create client account",
    professional_name_label: "First name",
    professional_lastname_label: "Last name",
    professional_email_label: "Email",
    professional_password_label: "Password (min. 8 characters)",
    professional_phone_label: "Phone",
    professional_specialty_label: "Specialty",
    professional_country_label: "Country & language / Nationality",
    professional_submit: "Create professional account",
    deposit_title: "Client deposit",
    deposit_email_label: "Client email",
    deposit_amount_label: "Amount (local currency)",
    deposit_button: "Deposit",
    withdraw_title: "Professional withdrawal",
    withdraw_email_label: "Professional email",
    withdraw_amount_label: "Amount (local currency)",
    withdraw_button: "Withdraw",
    session_context_professional: "Signed in as professional: {email}",
    session_context_client: "Signed in as client: {email}",
    session_context_admin: "Signed in as administrator: {email}",
    session_missing: "We couldn't verify your session. Please log in again.",
    session_wrong_workspace: "Your current session doesn't match this workspace. Log in again.",
    professional_services_card_title: "Service catalog",
    professional_services_card_subtitle: "Describe the jobs you offer and their base prices.",
    professional_services_email_label: "Professional email",
    professional_services_specialty_label: "Job specialty",
    professional_services_specialty_locked: "This specialty comes from your profile and can't be changed here.",
    professional_services_name_label: "Job name",
    professional_services_description_label: "Description",
    professional_services_cost_label: "Base cost",
    professional_services_submit: "Save job",
    professional_services_preview_title: "Recently registered jobs",
    professional_services_empty: "You haven't registered jobs yet.",
    professional_services_specialty_unknown: "Specialty not defined",
    professional_requests_title: "Incoming requests",
    professional_requests_caption: "Review new client requests and decide whether to accept or reject them.",
    professional_requests_empty: "You don't have pending requests yet.",
    professional_requests_accept: "Accept",
    professional_requests_reject: "Reject",
    professional_requests_error: "We couldn't update the request",
    professional_requests_accept_success: "Request accepted",
    professional_requests_reject_success: "Request rejected",
    professional_requests_schedule_label: "Scheduled date",
    professional_requests_schedule_hint: "Pick the day and time you will handle this job.",
    professional_requests_schedule_required: "Select a date before accepting the request.",
    professional_requests_client_label: "Client: {email}",
    client_requests_title: "Active requests",
    client_requests_caption: "Track your requests and confirm the outcome once the work is done.",
    client_requests_empty: "You haven't created any requests yet.",
    client_requests_status_pending: "Under review",
    client_requests_status_assigned: "Scheduled",
    client_requests_status_completed: "Completed",
    client_requests_status_cancelled: "Cancelled",
    client_requests_status_disputed: "Under admin review",
    client_requests_schedule_pending: "Waiting for the professional to confirm.",
    client_requests_schedule_info: "Scheduled for {date}.",
    client_requests_wait_for_date: "You can confirm once the scheduled date arrives.",
    client_requests_ready_to_confirm: "Your confirmation will release the payment.",
    client_requests_feedback_placeholder: "Comments for the professional (optional)",
    client_requests_accept_action: "Job completed successfully",
    client_requests_reject_action: "Report an issue",
    client_requests_error: "We couldn't update the request",
    client_requests_success_positive: "Thanks! We released the payment.",
    client_requests_success_negative: "We recorded your report. An admin will review the dispute.",
    client_requests_disputed_message: "An administrator is reviewing the case before releasing the payment.",
    client_requests_dispute_rejected: "Administration confirmed the payment will remain blocked.",
    client_requests_dispute_approved: "Administration authorized the payment despite your claim.",
    client_requests_admin_resolution: "Reviewed by: {email}",
    client_requests_admin_notes_label: "Admin notes: {notes}",
    client_requests_professional_label: "Professional: {email}",
    client_requests_cost_label: "Estimated cost: {amount}",
    client_requests_urgency_label: "Urgency: {urgency}",
    client_requests_rejected_by_professional: "The professional rejected this request.",
    wallet_balance_client_label: "Available funds: {amount}",
    wallet_balance_professional_label: "Available balance: {amount}",
    wallet_balance_admin_label: "Managed commissions: {amount}",
    wallet_balance_error: "We couldn't fetch your balance",
    catalog_title: "Professional catalog",
    catalog_caption: "Browse available profiles and review their posted jobs.",
    catalog_filter_label: "Specialty",
    catalog_empty: "No professionals have jobs for this specialty yet.",
    catalog_error: "We couldn't load the catalog",
    catalog_country_required: "Please sign in to view services available in your country.",
    catalog_select_button: "Select",
    specialty_filter_all: "All specialties",
    service_request_title: "Request a service",
    service_request_caption: "Pick a job from the catalog and submit your request.",
    service_request_client_email_label: "Client email",
    service_request_description_label: "Service description",
    service_request_urgency_label: "Urgency",
    service_request_submit: "Send request",
    service_request_selected_placeholder: "No service selected yet.",
    service_request_professional_label: "{professional} - Specialty: {specialty}",
    service_request_missing_service: "Select a job from the catalog before sending your request.",
    urgency_low: "Low",
    urgency_normal: "Normal",
    urgency_high: "High",
    admin_title: "Admin mode",
    admin_copy: "Admins can sign in to audit balances and operations.",
    admin_user_label: "User:",
    admin_password_label: "Password:",
    admin_hint: "Use the payments APIs to review balances and transactions by email.",
    admin_disputes_title: "Disputed requests",
    admin_disputes_caption: "Decide whether to release or withhold the payment based on the evidence provided.",
    admin_disputes_empty: "There are no disputes pending review.",
    admin_disputes_error: "We couldn't load the disputes",
    admin_disputes_notes_placeholder: "Internal notes (optional)",
    admin_disputes_action_pay: "Release payment",
    admin_disputes_action_uphold: "Keep blocked",
    admin_disputes_paid_success: "Payment released successfully.",
    admin_disputes_denied_success: "You confirmed the payment will remain blocked.",
    admin_disputes_client_feedback: "Client comment: {feedback}",
    admin_disputes_client_feedback_missing: "The client did not leave comments.",
    dashboard_close: "Close view",
    footer_copy: "© 2024 Multiplatform Service · Compliant with local regulations.",
    country_item_label: "{name} · Language: {language} · {nationality}",
    processing: "Processing...",
    generic_error: "Something went wrong",
    success_default: "Action completed",
    country_error: "We could not load the regional configuration",
    language_names: {
      es: "Spanish",
      en: "English",
      pt: "Portuguese",
      fr: "French",
      ja: "Japanese",
    },
    dashboard: {
      client: {
        eyebrow: "Client experience",
        title: "Personal service panel",
        message: "Your requests run in {language} thanks to your registration from {country}.",
        highlights: [
          "Live tracking of trusted professionals",
          "Protected payments in local currency",
          "Synced history and reputation",
        ],
      },
      professional: {
        eyebrow: "Pro workspace",
        title: "Smart agenda and secure payouts",
        message: "Your portfolio is showcased in {language} for customers in {country} and beyond.",
        highlights: [
          "Agenda with automatic reminders",
          "Tools to share quotes and invoices",
          "Fast access to withdrawals and ratings",
        ],
      },
      admin: {
        eyebrow: "Admin center",
        title: "Oversight and audit",
        message: "Monitor global operations and guarantee compliance in every language.",
        highlights: [
          "Consolidated payments and balance board",
          "Risk alerts and reconciliations",
          "Advanced audit controls",
        ],
      },
    },
  },
  pt: {
    hero_chip: "5 países · 5 idiomas · 5 moedas",
    language_label: "Idioma",
    hero_heading: "Conecte clientes e profissionais com processos seguros",
    hero_subtitle:
      "Operamos em espanhol, inglês, português, francês e japonês, respeitando a moeda local de cada mercado.",
    hero_cta: "Começar agora",
    how_title: "Como funciona",
    how_step_one: "Cadastre-se como cliente ou profissional verificado.",
    how_step_two: "Selecione país, idioma e moeda disponíveis.",
    how_step_three: "Receba confirmações e acompanhamento automatizado.",
    how_step_four: "Gerencie pagamentos eletrônicos e reputação transparente.",
    markets_title: "Mercados ativos",
    auth_title: "Gerencie seu acesso",
    auth_copy: "Faça login ou cadastre-se sem trocar de página.",
    auth_brand_headline: "Bem-vindo à WERKER-IT",
    auth_brand_copy: "Conecte clientes e profissionais com acompanhamento transparente.",
    auth_benefit_one: "Onboarding guiado para clientes e especialistas.",
    auth_benefit_two: "Cadastro e login no mesmo fluxo.",
    auth_benefit_three: "Operações seguras em toda a região.",
    role_selection_title: "Escolha sua experiência",
    role_selection_copy: "Acesse imediatamente o ambiente que corresponde ao seu papel.",
    role_card_client_description:
      "Solicite serviços, gerencie pagamentos locais e acompanhe profissionais verificados.",
    role_card_professional_description:
      "Administre seus saques, agende trabalhos e mantenha sua reputação atualizada.",
    role_card_admin_description:
      "Audite operações, revise saldos e execute os controles de compliance necessários.",
    role_card_button: "Abrir página",
    role_back_home: "Voltar ao início",
    client_workspace_heading: "Ambiente de clientes",
    client_workspace_intro: "Acesse cadastros, depósitos e acompanhamento personalizado.",
    professional_workspace_heading: "Ambiente de profissionais",
    professional_workspace_intro: "Gerencie agenda, pagamentos e reputação em um só lugar.",
    admin_workspace_heading: "Ambiente administrativo",
    admin_workspace_intro: "Supervisione saldos, auditorias e controles regulatórios na região.",
    admin_workspace_point_one: "Controle saldos em tempo real.",

    admin_workspace_point_two: "Revise logs e evidências exportáveis.",

    admin_workspace_point_three: "Coordene ações com equipes locais.",
    admin_identity_title: "Administrador nacional ativo",
    admin_identity_username: "Usuário designado",
    admin_identity_email: "E-mail corporativo",
    admin_identity_hint: "Esta tela adota o idioma e as normas do país que você administra.",
    admin_wallet_title: "Comissões retidas",
    admin_wallet_hint: "Mostra os 10% direcionados ao administrador regional por trabalhos concluídos.",
    admin_credentials_title: "Administradores por país",
    admin_credentials_copy: "Cada mercado possui seu usuário corporativo e compartilha a senha mestre.",
    admin_credentials_empty: "Nenhuma credencial disponível no momento.",

    logout_button: "Sair",

    auth_tab_login: "Entrar",
    auth_tab_register: "Registrar",
    login_title: "Entrar",
    login_email_label: "E-mail",
    login_email_placeholder: "usuario@email.com",
    login_password_label: "Senha",
    login_password_placeholder: "********",
    login_user_type_label: "Tipo de usuário",
    login_button: "Acessar",
    user_type_client: "Cliente",
    user_type_professional: "Profissional",
    user_type_admin: "Administrador",
    register_title: "Registro rápido",
    register_caption: "Escolha o tipo de conta que deseja criar.",
    registration_fee_notice:
      "A WERKER-IT ret�m automaticamente 10% de cada trabalho conclu�do e envia ao administrador regional.",
    registration_fee_accept_label: "Aceito essa taxa administrativa e desejo criar minha conta.",
    register_tab_client: "Cliente",
    register_tab_professional: "Profissional",
    client_name_label: "Nome",
    client_lastname_label: "Sobrenome",
    client_email_label: "E-mail",
    client_password_label: "Senha (mín. 8 caracteres)",
    client_phone_label: "Telefone",
    client_address_label: "Endereço",
    client_country_label: "País e idioma / Nacionalidade",
    client_submit: "Criar conta cliente",
    professional_name_label: "Nome",
    professional_lastname_label: "Sobrenome",
    professional_email_label: "E-mail",
    professional_password_label: "Senha (mín. 8 caracteres)",
    professional_phone_label: "Telefone",
    professional_specialty_label: "Especialidade",
    professional_country_label: "País e idioma / Nacionalidade",
    professional_submit: "Criar conta profissional",
    deposit_title: "Depósito de clientes",
    deposit_email_label: "E-mail do cliente",
    deposit_amount_label: "Valor (moeda local)",
    deposit_button: "Depositar",
    withdraw_title: "Saque de profissionais",
    withdraw_email_label: "E-mail do profissional",
    withdraw_amount_label: "Valor (moeda local)",
    withdraw_button: "Sacar",
    session_context_professional: "Sessão ativa como profissional: {email}",
    session_context_client: "Sessão ativa como cliente: {email}",
    session_context_admin: "Sessão ativa como administrador: {email}",
    session_missing: "Não encontramos sua sessão. Faça login novamente.",
    session_wrong_workspace: "Sua sessão atual não corresponde a esta área. Entre novamente.",
    admin_title: "Modo administrador",
    admin_copy: "O administrador pode entrar para auditar saldos e operações.",
    admin_user_label: "Usuário:",
    admin_password_label: "Senha:",
    admin_hint: "Use as APIs de pagamentos para consultar saldos e transações por e-mail.",
    admin_disputes_title: "Solicitações em disputa",
    admin_disputes_caption: "Decida se deve liberar ou manter o pagamento retido conforme as informações recebidas.",
    admin_disputes_empty: "Não há disputas pendentes para revisar.",
    admin_disputes_error: "Não pudemos carregar as disputas",
    admin_disputes_notes_placeholder: "Notas administrativas (opcional)",
    admin_disputes_action_pay: "Liberar pagamento",
    admin_disputes_action_uphold: "Manter bloqueado",
    admin_disputes_paid_success: "Pagamento liberado com sucesso.",
    admin_disputes_denied_success: "Você confirmou que o pagamento permanecerá bloqueado.",
    admin_disputes_client_feedback: "Comentário do cliente: {feedback}",
    admin_disputes_client_feedback_missing: "O cliente não deixou comentários.",
    dashboard_close: "Fechar vista",
    footer_copy: "© 2024 Plataforma Multiplataforma · Cumprimos normas locais.",
    country_item_label: "{name} · Idioma: {language} · {nationality}",
    processing: "Processando...",
    generic_error: "Ocorreu um erro",
    success_default: "Operação concluída",
    country_error: "Não foi possível carregar a configuração regional",
    language_names: {
      es: "espanhol",
      en: "inglês",
      pt: "português",
      fr: "francês",
      ja: "japonês",
    },
    dashboard: {
      client: {
        eyebrow: "Experiência do cliente",
        title: "Painel pessoal de serviços",
        message: "Suas solicitações funcionam em {language} graças ao cadastro feito em {country}.",
        highlights: [
          "Acompanhamento em tempo real de profissionais confiáveis",
          "Pagamentos protegidos na moeda local",
          "Histórico e reputação sincronizados",
        ],
      },
      professional: {
        eyebrow: "Espaço profissional",
        title: "Agenda inteligente e recebimentos seguros",
        message: "Seu portfólio aparece em {language} para clientes de {country} e da região.",
        highlights: [
          "Agenda com lembretes automáticos",
          "Ferramentas para cotações e faturas",
          "Saques rápidos e visibilidade da reputação",
        ],
      },
      admin: {
        eyebrow: "Centro administrativo",
        title: "Supervisão e auditoria",
        message: "Monitore operações globais e garanta conformidade em todos os idiomas.",
        highlights: [
          "Painel consolidado de pagamentos e saldos",
          "Alertas de risco e conciliações",
          "Controles avançados de auditoria",
        ],
      },
    },
  },
  fr: {
    hero_chip: "5 pays · 5 langues · 5 monnaies",
    language_label: "Langue",
    hero_heading: "Reliez clients et professionnels avec des processus sécurisés",
    hero_subtitle:
      "Nous opérons en espagnol, anglais, portugais, français et japonais tout en respectant la monnaie locale de chaque marché.",
    hero_cta: "Commencer",
    how_title: "Comment ça marche",
    how_step_one: "Inscrivez-vous comme client ou professionnel vérifié.",
    how_step_two: "Choisissez pays, langue et monnaie disponibles.",
    how_step_three: "Recevez confirmations et suivi automatisé.",
    how_step_four: "Gérez paiements électroniques et réputation transparente.",
    markets_title: "Marchés actifs",
    auth_title: "Gérez votre accès",
    auth_copy: "Connectez-vous ou inscrivez-vous sans changer de page.",
    auth_brand_headline: "Bienvenue sur WERKER-IT",
    auth_brand_copy: "Connectez clients et professionnels avec un suivi transparent.",
    auth_benefit_one: "Onboarding guidé pour clients et spécialistes.",
    auth_benefit_two: "Inscription et connexion dans un même flux.",
    auth_benefit_three: "Opérations sécurisées dans toute la région.",
    role_selection_title: "Choisissez votre espace",
    role_selection_copy: "Accédez directement à l'environnement correspondant à votre rôle.",
    role_card_client_description:
      "Demandez des services, gérez les paiements locaux et suivez des professionnels vérifiés.",
    role_card_professional_description:
      "Gérez vos retraits, planifiez vos missions et gardez votre réputation à jour.",
    role_card_admin_description:
      "Auditez les opérations, consultez les soldes et appliquez les contrôles de conformité.",
    role_card_button: "Ouvrir la page",
    role_back_home: "Retour à l'accueil",
    client_workspace_heading: "Espace clients",
    client_workspace_intro: "Accédez à vos dossiers, dépôts et suivi personnalisé.",
    professional_workspace_heading: "Espace professionnels",
    professional_workspace_intro: "Gérez agenda, paiements et réputation en un seul endroit.",
    admin_workspace_heading: "Espace administrateur",
    admin_workspace_intro: "Supervisez soldes, audits et contrôles réglementaires dans la région.",
    admin_workspace_point_one: "Contrôlez les soldes en temps réel.",

    admin_workspace_point_two: "Consultez journaux et preuves exportables.",

    admin_workspace_point_three: "Coordonnez les actions avec les équipes locales.",
    admin_identity_title: "Administrateur national actif",
    admin_identity_username: "Identifiant attribué",
    admin_identity_email: "Courriel professionnel",
    admin_identity_hint: "Cette vue adopte la langue et la réglementation du pays que vous supervisez.",
    admin_wallet_title: "Commissions retenues",
    admin_wallet_hint: "Affiche les 10 % envoyés à l’administrateur régional pour les travaux réalisés.",
    admin_credentials_title: "Administrateurs par pays",
    admin_credentials_copy: "Chaque marché dispose de son utilisateur corporate et partage le mot de passe maître.",
    admin_credentials_empty: "Aucune donnée d'identifiants pour le moment.",

    logout_button: "Se déconnecter",

    auth_tab_login: "Connexion",
    auth_tab_register: "Inscription",
    login_title: "Connexion",
    login_email_label: "Email",
    login_email_placeholder: "utilisateur@email.com",
    login_password_label: "Mot de passe",
    login_password_placeholder: "********",
    login_user_type_label: "Type d'utilisateur",
    login_button: "Entrer",
    user_type_client: "Client",
    user_type_professional: "Professionnel",
    user_type_admin: "Administrateur",
    register_title: "Inscription rapide",
    register_caption: "Choisissez le type de compte à créer.",
    registration_fee_notice:
      "WERKER-IT retient automatiquement 10 % de chaque intervention réalisée et le transfère à l’administrateur régional.",
    registration_fee_accept_label: "J’accepte ces frais administratifs et souhaite créer mon compte.",
    register_tab_client: "Client",
    register_tab_professional: "Professionnel",
    client_name_label: "Prénom",
    client_lastname_label: "Nom",
    client_email_label: "Email",
    client_password_label: "Mot de passe (min. 8 caractères)",
    client_phone_label: "Téléphone",
    client_address_label: "Adresse",
    client_country_label: "Pays et langue / Nationalité",
    client_submit: "Créer un compte client",
    professional_name_label: "Prénom",
    professional_lastname_label: "Nom",
    professional_email_label: "Email",
    professional_password_label: "Mot de passe (min. 8 caractères)",
    professional_phone_label: "Téléphone",
    professional_specialty_label: "Spécialité",
    professional_country_label: "Pays et langue / Nationalité",
    professional_submit: "Créer un compte professionnel",
    deposit_title: "Dépôt client",
    deposit_email_label: "Email du client",
    deposit_amount_label: "Montant (monnaie locale)",
    deposit_button: "Déposer",
    withdraw_title: "Retrait professionnel",
    withdraw_email_label: "Email du professionnel",
    withdraw_amount_label: "Montant (monnaie locale)",
    withdraw_button: "Retirer",
    session_context_professional: "Session active en tant que professionnel : {email}",
    session_context_client: "Session active en tant que client : {email}",
    session_context_admin: "Session active en tant qu’administrateur : {email}",
    session_missing: "Votre session est introuvable. Reconnectez-vous.",
    session_wrong_workspace: "Votre session ne correspond pas à cet espace. Reconnectez-vous.",
    admin_title: "Mode administrateur",
    admin_copy: "L'administrateur peut se connecter pour auditer soldes et opérations.",
    admin_user_label: "Utilisateur :",
    admin_password_label: "Mot de passe :",
    admin_hint: "Utilisez les API de paiements pour consulter soldes et transactions.",
    admin_disputes_title: "Demandes en litige",
    admin_disputes_caption: "Décidez de libérer ou de maintenir le paiement selon les informations disponibles.",
    admin_disputes_empty: "Aucun litige en attente de révision.",
    admin_disputes_error: "Impossible de charger les litiges",
    admin_disputes_notes_placeholder: "Notes administratives (optionnel)",
    admin_disputes_action_pay: "Libérer le paiement",
    admin_disputes_action_uphold: "Maintenir bloqué",
    admin_disputes_paid_success: "Paiement libéré avec succès.",
    admin_disputes_denied_success: "Vous avez confirmé que le paiement restera bloqué.",
    admin_disputes_client_feedback: "Commentaire du client : {feedback}",
    admin_disputes_client_feedback_missing: "Le client n'a laissé aucun commentaire.",
    dashboard_close: "Fermer la vue",
    footer_copy: "© 2024 Plateforme Multiplateforme · Conforme aux réglementations locales.",
    country_item_label: "{name} · Langue : {language} · {nationality}",
    processing: "Traitement...",
    generic_error: "Une erreur est survenue",
    success_default: "Opération réussie",
    country_error: "Impossible de charger la configuration régionale",
    language_names: {
      es: "espagnol",
      en: "anglais",
      pt: "portugais",
      fr: "français",
      ja: "japonais",
    },
    dashboard: {
      client: {
        eyebrow: "Expérience client",
        title: "Tableau de bord personnel",
        message: "Vos demandes sont gérées en {language} grâce à votre inscription depuis {country}.",
        highlights: [
          "Suivi en direct de professionnels fiables",
          "Paiements protégés dans la monnaie locale",
          "Historique et réputation synchronisés",
        ],
      },
      professional: {
        eyebrow: "Espace pro",
        title: "Agenda intelligent et paiements sécurisés",
        message: "Votre portfolio apparaît en {language} pour les clients de {country} et d'ailleurs.",
        highlights: [
          "Agenda avec rappels automatiques",
          "Outils pour devis et factures",
          "Accès rapide aux retraits et avis",
        ],
      },
      admin: {
        eyebrow: "Centre administratif",
        title: "Supervision et audit",
        message: "Surveillez les opérations globales et garantissez la conformité dans chaque langue.",
        highlights: [
          "Tableau consolidé des paiements et soldes",
          "Alertes de risques et rapprochements",
          "Contrôles d'audit avancés",
        ],
      },
    },
  },
  ja: {
    hero_chip: "5か国・5言語・5通貨",
    language_label: "言語",
    hero_heading: "安全なプロセスで顧客と専門家をつなぐ",
    hero_subtitle: "スペイン語・英語・ポルトガル語・フランス語・日本語で運用し、各市場の通貨に対応します。",
    hero_cta: "今すぐ始める",
    how_title: "ご利用方法",
    how_step_one: "顧客または認定プロとして登録します。",
    how_step_two: "利用可能な国・言語・通貨を選びます。",
    how_step_three: "確認とフォローアップを自動で受け取ります。",
    how_step_four: "電子決済と評価を透明に管理します。",
    markets_title: "提供中の地域",
    auth_title: "アクセスを管理",
    auth_copy: "このページでログインまたは登録できます。",
    auth_brand_headline: "WERKER-IT へようこそ",
    auth_brand_copy: "クライアントとプロを透明なトラッキングでつなぎます。",
    auth_benefit_one: "クライアントと専門家のためのガイド付きオンボーディング。",
    auth_benefit_two: "登録とログインを同じフローで。",
    auth_benefit_three: "地域全体で安全なオペレーション。",
    role_selection_title: "ワークスペースを選択",
    role_selection_copy: "自分の役割に合った画面へすぐに移動できます。",
    role_card_client_description:
      "サービスを依頼し、現地通貨での支払いと認定プロの追跡を管理します。",
    role_card_professional_description:
      "出金、スケジュール、評価を一つの画面で管理します。",
    role_card_admin_description: "オペレーションを監査し、残高とコンプライアンスを確認します。",
    role_card_button: "ページを開く",
    role_back_home: "ホームに戻る",
    client_workspace_heading: "クライアント画面",
    client_workspace_intro: "登録情報、入金、フォローアップにアクセスします。",
    professional_workspace_heading: "プロフェッショナル画面",
    professional_workspace_intro: "予定、受取、評価をまとめて管理します。",
    admin_workspace_heading: "管理者画面",
    admin_workspace_intro: "地域全体の残高、監査、規制チェックを監督します。",
    admin_workspace_point_one: "リアルタイムで残高を確認。",

    admin_workspace_point_two: "ログや証跡をエクスポート。",

    admin_workspace_point_three: "各地域チームと連携。",
    admin_identity_title: "担当国の管理者",
    admin_identity_username: "割り当てられたユーザー",
    admin_identity_email: "公式メール",
    admin_identity_hint: "この画面は担当国の言語と規制に合わせて表示されます。",
    admin_wallet_title: "保持中のコミッション",
    admin_wallet_hint: "地域で完了した仕事から差し引かれた10%を表示します。",
    admin_credentials_title: "国別の管理者",
    admin_credentials_copy: "各マーケットに専用ユーザーがあり、共通のマスターパスワードを共有します。",
    admin_credentials_empty: "現在表示できる認証情報はありません。",

    logout_button: "ログアウト",

    auth_tab_login: "ログイン",
    auth_tab_register: "登録",
    login_title: "ログイン",
    login_email_label: "メールアドレス",
    login_email_placeholder: "user@example.com",
    login_password_label: "パスワード",
    login_password_placeholder: "********",
    login_user_type_label: "ユーザー種別",
    login_button: "入室",
    user_type_client: "クライアント",
    user_type_professional: "プロ",
    user_type_admin: "管理者",
    register_title: "かんたん登録",
    register_caption: "作成したいアカウントを選択してください。",
    registration_fee_notice:
      "WERKER-IT は完了した仕事ごとに料金の10%を自動で差し引き、地域管理者へ送金します。",
    registration_fee_accept_label: "この手数料に同意し、アカウント作成を続けます。",
    register_tab_client: "クライアント",
    register_tab_professional: "プロ",
    client_name_label: "名",
    client_lastname_label: "姓",
    client_email_label: "メール",
    client_password_label: "パスワード (8文字以上)",
    client_phone_label: "電話",
    client_address_label: "住所",
    client_country_label: "国と言語 / 国籍",
    client_submit: "クライアント登録",
    professional_name_label: "名",
    professional_lastname_label: "姓",
    professional_email_label: "メール",
    professional_password_label: "パスワード (8文字以上)",
    professional_phone_label: "電話",
    professional_specialty_label: "専門分野",
    professional_country_label: "国と言語 / 国籍",
    professional_submit: "プロ登録",
    deposit_title: "クライアント入金",
    deposit_email_label: "クライアントのメール",
    deposit_amount_label: "金額 (現地通貨)",
    deposit_button: "入金",
    withdraw_title: "プロ出金",
    withdraw_email_label: "プロのメール",
    withdraw_amount_label: "金額 (現地通貨)",
    withdraw_button: "出金",
    session_context_professional: "プロとしてログイン中: {email}",
    session_context_client: "クライアントとしてログイン中: {email}",
    session_context_admin: "管理者としてログイン中: {email}",
    session_missing: "セッションを確認できませんでした。再度ログインしてください。",
    session_wrong_workspace: "このエリアとセッションが一致しません。もう一度ログインしてください。",
    admin_title: "管理者モード",
    admin_copy: "管理者は残高と取引を監査できます。",
    admin_user_label: "ユーザー:",
    admin_password_label: "パスワード:",
    admin_hint: "支払いAPIでメール別の残高と取引を確認します。",
    admin_disputes_title: "紛争中の申請",
    admin_disputes_caption: "受け取った情報に基づいて支払いを解放するか保留を続けるか判断してください。",
    admin_disputes_empty: "確認待ちの紛争はありません。",
    admin_disputes_error: "紛争データを読み込めませんでした",
    admin_disputes_notes_placeholder: "管理メモ（任意）",
    admin_disputes_action_pay: "支払いを解放",
    admin_disputes_action_uphold: "保留を維持",
    admin_disputes_paid_success: "支払いを正常に解放しました。",
    admin_disputes_denied_success: "支払いを保留のままにすることを確認しました。",
    admin_disputes_client_feedback: "クライアントのコメント: {feedback}",
    admin_disputes_client_feedback_missing: "クライアントからのコメントはありません。",
    dashboard_close: "ビューを閉じる",
    footer_copy: "© 2024 マルチプラットフォームサービス · 各国の規制に準拠しています。",
    country_item_label: "{name} · 言語: {language} · {nationality}",
    processing: "処理中...",
    generic_error: "エラーが発生しました",
    success_default: "処理が完了しました",
    country_error: "地域設定を読み込めませんでした",
    language_names: {
      es: "スペイン語",
      en: "英語",
      pt: "ポルトガル語",
      fr: "フランス語",
      ja: "日本語",
    },
    dashboard: {
      client: {
        eyebrow: "クライアントビュー",
        title: "パーソナルサービスパネル",
        message: "{country}の登録により、{language}でリクエストを管理できます。",
        highlights: [
          "信頼できるプロのリアルタイム追跡",
          "現地通貨での安全な支払い",
          "履歴と評価の同期",
        ],
      },
      professional: {
        eyebrow: "プロフェッショナルゾーン",
        title: "スマートな予定表と安全な入出金",
        message: "{country}を含む地域の顧客に向け、{language}でポートフォリオを表示します。",
        highlights: [
          "自動リマインダー付きの予定表",
          "見積もりと請求書の送信ツール",
          "迅速な出金と評価管理",
        ],
      },
      admin: {
        eyebrow: "管理センター",
        title: "監視と監査",
        message: "すべての言語でグローバルな運用を監視し、コンプライアンスを確保します。",
        highlights: [
          "支払いと残高の統合ボード",
          "リスク警告と照合作業",
          "高度な監査コントロール",
        ],
      },
    },
  },
};

const translationOverrides = {
  pt: {
    catalog_title: "Catálogo de profissionais",
    catalog_caption: "Explore os perfis disponíveis e conheça os serviços cadastrados.",
    catalog_filter_label: "Especialidade",
    catalog_empty: "Ainda não há profissionais com serviços cadastrados para esta especialidade.",
    catalog_error: "Não pudemos carregar o catálogo.",
    catalog_country_required: "Faça login para ver os serviços disponíveis no seu país.",
    catalog_select_button: "Selecionar",
    specialty_filter_all: "Todas as especialidades",
    service_request_title: "Solicite um serviço",
    service_request_caption: "Escolha um serviço do catálogo e envie sua solicitação.",
    service_request_client_email_label: "E-mail do cliente",
    service_request_description_label: "Descrição da necessidade",
    service_request_urgency_label: "Urgência",
    service_request_submit: "Enviar solicitação",
    service_request_selected_placeholder: "Nenhum serviço selecionado ainda.",
    service_request_professional_label: "{professional} - Especialidade: {specialty}",
    service_request_missing_service: "Selecione um serviço antes de enviar sua solicitação.",
    urgency_low: "Baixa",
    urgency_normal: "Normal",
    urgency_high: "Alta",
    wallet_balance_client_label: "Fundos disponíveis: {amount}",
    wallet_balance_professional_label: "Saldo disponível: {amount}",
    wallet_balance_admin_label: "Comissões administradas: {amount}",
    wallet_balance_error: "Não pudemos consultar seu saldo",
    client_requests_title: "Solicitações ativas",
    client_requests_caption: "Acompanhe suas solicitações e confirme o resultado após o serviço.",
    client_requests_empty: "Você ainda não criou solicitações.",
    client_requests_status_pending: "Em análise",
    client_requests_status_assigned: "Agendada",
    client_requests_status_completed: "Concluída",
    client_requests_status_cancelled: "Cancelada",
    client_requests_status_disputed: "Em revisão administrativa",
    client_requests_schedule_pending: "Aguardando confirmação do profissional.",
    client_requests_schedule_info: "Agendado para {date}.",
    client_requests_wait_for_date: "Você poderá confirmar quando chegar a data programada.",
    client_requests_ready_to_confirm: "Sua confirmação libera o pagamento ao profissional.",
    client_requests_feedback_placeholder: "Comentários para o profissional (opcional)",
    client_requests_accept_action: "Serviço satisfatório",
    client_requests_reject_action: "Houve um problema",
    client_requests_error: "Não pudemos atualizar a solicitação",
    client_requests_success_positive: "Obrigado pela confirmação, liberamos o pagamento.",
    client_requests_success_negative: "Registramos seu comentário. Um administrador revisará a disputa.",
    client_requests_disputed_message: "Um administrador revisará o caso antes de liberar o pagamento.",
    client_requests_dispute_rejected: "A administração confirmou que o pagamento permanecerá bloqueado.",
    client_requests_dispute_approved: "A administração autorizou o pagamento apesar da reclamação.",
    client_requests_admin_resolution: "Revisado por: {email}",
    client_requests_admin_notes_label: "Notas da administração: {notes}",
    client_requests_professional_label: "Profissional: {email}",
    client_requests_cost_label: "Custo estimado: {amount}",
    client_requests_urgency_label: "Urgência: {urgency}",
    client_requests_rejected_by_professional: "O profissional recusou esta solicitação.",
    professional_services_card_title: "Catálogo de serviços",
    professional_services_card_subtitle: "Descreva os serviços que oferece e quanto cobra cada um.",
    professional_services_email_label: "E-mail do profissional",
    professional_services_specialty_label: "Especialidade do serviço",
    professional_services_specialty_locked: "Esta especialidade vem do seu perfil e não pode ser alterada aqui.",
    professional_services_name_label: "Nome do serviço",
    professional_services_description_label: "Descrição",
    professional_services_cost_label: "Preço base",
    professional_services_submit: "Registrar serviço",
    professional_services_preview_title: "Serviços registrados recentemente",
    professional_services_empty: "Você ainda não cadastrou serviços.",
    professional_services_specialty_unknown: "Especialidade não definida",
    professional_requests_title: "Solicitações recebidas",
    professional_requests_caption: "Revise as solicitações e aceite ou recuse conforme necessário.",
    professional_requests_empty: "Você ainda não tem solicitações pendentes.",
    professional_requests_accept: "Aceitar",
    professional_requests_reject: "Recusar",
    professional_requests_error: "Não pudemos atualizar a solicitação",
    professional_requests_accept_success: "Solicitação aceita",
    professional_requests_reject_success: "Solicitação recusada",
    professional_requests_schedule_label: "Data agendada",
    professional_requests_schedule_hint: "Escolha o dia e o horário em que realizará o serviço.",
    professional_requests_schedule_required: "Selecione uma data antes de aceitar a solicitação.",
    professional_requests_client_label: "Cliente: {email}",
    deposit_title: "Depósito de clientes",
    deposit_email_label: "E-mail do cliente",
    deposit_amount_label: "Valor (moeda local)",
    deposit_button: "Depositar",
    withdraw_title: "Saque de profissionais",
    withdraw_email_label: "E-mail do profissional",
    withdraw_amount_label: "Valor (moeda local)",
    withdraw_button: "Sacar",
  },
  fr: {
    catalog_title: "Catalogue de professionnels",
    catalog_caption: "Parcourez les profils disponibles et consultez les services enregistrés.",
    catalog_filter_label: "Spécialité",
    catalog_empty: "Aucun professionnel n’a encore enregistré de services pour cette spécialité.",
    catalog_error: "Impossible de charger le catalogue.",
    catalog_country_required: "Connectez-vous pour voir les services disponibles dans votre pays.",
    catalog_select_button: "Sélectionner",
    specialty_filter_all: "Toutes les spécialités",
    service_request_title: "Demander un service",
    service_request_caption: "Choisissez un service du catalogue et envoyez votre demande.",
    service_request_client_email_label: "E-mail du client",
    service_request_description_label: "Description du besoin",
    service_request_urgency_label: "Urgence",
    service_request_submit: "Envoyer la demande",
    service_request_selected_placeholder: "Aucun service sélectionné pour le moment.",
    service_request_professional_label: "{professional} - Spécialité : {specialty}",
    service_request_missing_service: "Sélectionnez un service avant d’envoyer votre demande.",
    urgency_low: "Faible",
    urgency_normal: "Normale",
    urgency_high: "Élevée",
    wallet_balance_client_label: "Fonds disponibles : {amount}",
    wallet_balance_professional_label: "Solde disponible : {amount}",
    wallet_balance_admin_label: "Commissions gérées : {amount}",
    wallet_balance_error: "Impossible d’obtenir votre solde",
    client_requests_title: "Demandes actives",
    client_requests_caption: "Surveillez vos demandes et confirmez le résultat une fois la mission terminée.",
    client_requests_empty: "Vous n’avez pas encore créé de demandes.",
    client_requests_status_pending: "En cours",
    client_requests_status_assigned: "Planifiée",
    client_requests_status_completed: "Terminée",
    client_requests_status_cancelled: "Annulée",
    client_requests_status_disputed: "En revue administrative",
    client_requests_schedule_pending: "En attente de confirmation du professionnel.",
    client_requests_schedule_info: "Prévu pour {date}.",
    client_requests_wait_for_date: "Vous pourrez confirmer lorsque la date prévue arrivera.",
    client_requests_ready_to_confirm: "Votre confirmation libérera le paiement au professionnel.",
    client_requests_feedback_placeholder: "Commentaires pour le professionnel (facultatif)",
    client_requests_accept_action: "Travail satisfaisant",
    client_requests_reject_action: "Signaler un problème",
    client_requests_error: "Impossible de mettre à jour la demande",
    client_requests_success_positive: "Merci pour votre confirmation, le paiement a été effectué.",
    client_requests_success_negative: "Nous avons enregistré votre commentaire. Un administrateur examinera la demande.",
    client_requests_disputed_message: "Un administrateur examinera le cas avant de libérer le paiement.",
    client_requests_dispute_rejected: "L’administration a confirmé que le paiement restera bloqué.",
    client_requests_dispute_approved: "L’administration a autorisé le paiement malgré la contestation.",
    client_requests_admin_resolution: "Examiné par : {email}",
    client_requests_admin_notes_label: "Notes de l’administration : {notes}",
    client_requests_professional_label: "Professionnel : {email}",
    client_requests_cost_label: "Coût estimé : {amount}",
    client_requests_urgency_label: "Urgence : {urgency}",
    client_requests_rejected_by_professional: "Le professionnel a refusé cette demande.",
    professional_services_card_title: "Catalogue de services",
    professional_services_card_subtitle: "Décrivez les services proposés et leurs tarifs.",
    professional_services_email_label: "E-mail professionnel",
    professional_services_specialty_label: "Spécialité du service",
    professional_services_specialty_locked: "Cette spécialité provient de votre profil et ne peut pas être modifiée ici.",
    professional_services_name_label: "Nom du service",
    professional_services_description_label: "Description",
    professional_services_cost_label: "Tarif de base",
    professional_services_submit: "Enregistrer le service",
    professional_services_preview_title: "Services enregistrés récemment",
    professional_services_empty: "Vous n’avez pas encore enregistré de services.",
    professional_services_specialty_unknown: "Spécialité non définie",
    professional_requests_title: "Demandes reçues",
    professional_requests_caption: "Examinez les demandes entrantes et acceptez ou refusez-les.",
    professional_requests_empty: "Aucune demande en attente.",
    professional_requests_accept: "Accepter",
    professional_requests_reject: "Refuser",
    professional_requests_error: "Impossible de mettre à jour la demande",
    professional_requests_accept_success: "Demande acceptée",
    professional_requests_reject_success: "Demande refusée",
    professional_requests_schedule_label: "Date planifiée",
    professional_requests_schedule_hint: "Choisissez la date et l’heure auxquelles vous réaliserez la mission.",
    professional_requests_schedule_required: "Sélectionnez une date avant d’accepter la demande.",
    professional_requests_client_label: "Client : {email}",
    deposit_title: "Dépôt client",
    deposit_email_label: "E-mail du client",
    deposit_amount_label: "Montant (monnaie locale)",
    deposit_button: "Déposer",
    withdraw_title: "Retrait professionnel",
    withdraw_email_label: "E-mail du professionnel",
    withdraw_amount_label: "Montant (monnaie locale)",
    withdraw_button: "Retirer",
  },
  ja: {
    catalog_title: "専門家カタログ",
    catalog_caption: "利用可能なプロフィールと登録済みサービスを確認できます。",
    catalog_filter_label: "専門分野",
    catalog_empty: "この専門分野にはまだ登録されたサービスがありません。",
    catalog_error: "カタログを読み込めませんでした。",
    catalog_country_required: "お住まいの国のサービスを見るにはログインしてください。",
    catalog_select_button: "選択",
    specialty_filter_all: "すべての専門分野",
    service_request_title: "サービスを依頼",
    service_request_caption: "カタログからサービスを選び、依頼を送信してください。",
    service_request_client_email_label: "クライアントのメール",
    service_request_description_label: "依頼内容",
    service_request_urgency_label: "緊急度",
    service_request_submit: "依頼を送信",
    service_request_selected_placeholder: "まだサービスが選択されていません。",
    service_request_professional_label: "{professional} - 専門分野: {specialty}",
    service_request_missing_service: "送信する前にサービスを選択してください。",
    urgency_low: "低",
    urgency_normal: "通常",
    urgency_high: "高",
    wallet_balance_client_label: "利用可能残高: {amount}",
    wallet_balance_professional_label: "出金可能残高: {amount}",
    wallet_balance_admin_label: "管理中のコミッション: {amount}",
    wallet_balance_error: "残高を取得できませんでした",
    client_requests_title: "進行中の依頼",
    client_requests_caption: "依頼状況を確認し、完了後に結果を確定してください。",
    client_requests_empty: "まだ依頼がありません。",
    client_requests_status_pending: "確認中",
    client_requests_status_assigned: "日程確定",
    client_requests_status_completed: "完了",
    client_requests_status_cancelled: "キャンセル",
    client_requests_status_disputed: "管理者が審査中",
    client_requests_schedule_pending: "プロの確認を待っています。",
    client_requests_schedule_info: "予定日時: {date}",
    client_requests_wait_for_date: "予定日時になったら確認できます。",
    client_requests_ready_to_confirm: "承認すると支払いが解放されます。",
    client_requests_feedback_placeholder: "プロへのメッセージ (任意)",
    client_requests_accept_action: "満足しました",
    client_requests_reject_action: "問題がありました",
    client_requests_error: "依頼を更新できませんでした",
    client_requests_success_positive: "ご確認ありがとうございます。支払いを実行しました。",
    client_requests_success_negative: "コメントを記録しました。管理者が審査します。",
    client_requests_disputed_message: "支払いの前に管理者が審査します。",
    client_requests_dispute_rejected: "管理者が支払わない判断を確認しました。",
    client_requests_dispute_approved: "管理者が支払いを承認しました。",
    client_requests_admin_resolution: "管理担当: {email}",
    client_requests_admin_notes_label: "管理メモ: {notes}",
    client_requests_professional_label: "プロ: {email}",
    client_requests_cost_label: "見積額: {amount}",
    client_requests_urgency_label: "緊急度: {urgency}",
    client_requests_rejected_by_professional: "プロがこの依頼を拒否しました。",
    professional_services_card_title: "サービス登録",
    professional_services_card_subtitle: "提供する作業内容と料金を登録してください。",
    professional_services_email_label: "プロのメール",
    professional_services_specialty_label: "サービスの専門分野",
    professional_services_specialty_locked: "専門分野はプロフィールの設定が適用されます。",
    professional_services_name_label: "サービス名",
    professional_services_description_label: "説明",
    professional_services_cost_label: "基本料金",
    professional_services_submit: "サービスを登録",
    professional_services_preview_title: "最近登録したサービス",
    professional_services_empty: "まだサービスを登録していません。",
    professional_services_specialty_unknown: "専門分野未設定",
    professional_requests_title: "受信した依頼",
    professional_requests_caption: "新しい依頼を確認し、受諾または辞退してください。",
    professional_requests_empty: "保留中の依頼はありません。",
    professional_requests_accept: "承諾",
    professional_requests_reject: "辞退",
    professional_requests_error: "依頼を更新できませんでした",
    professional_requests_accept_success: "依頼を受諾しました",
    professional_requests_reject_success: "依頼を辞退しました",
    professional_requests_schedule_label: "予定日時",
    professional_requests_schedule_hint: "作業予定の日時を選択してください。",
    professional_requests_schedule_required: "受諾する前に日時を入力してください。",
    professional_requests_client_label: "クライアント: {email}",
    deposit_title: "クライアント入金",
    deposit_email_label: "クライアントのメール",
    deposit_amount_label: "金額 (現地通貨)",
    deposit_button: "入金",
    withdraw_title: "プロの出金",
    withdraw_email_label: "プロのメール",
    withdraw_amount_label: "金額 (現地通貨)",
    withdraw_button: "出金",
  },
};

const SPECIALTY_TRANSLATIONS = {
  plomeria: {
    es: "Plomería",
    en: "Plumbing",
    pt: "Encanamento",
    fr: "Plomberie",
    ja: "配管サービス",
  },
  cerrajeria: {
    es: "Cerrajería",
    en: "Locksmith",
    pt: "Chaveiro",
    fr: "Serrurerie",
    ja: "鍵サービス",
  },
  electricista: {
    es: "Electricista",
    en: "Electrician",
    pt: "Eletricista",
    fr: "Électricien",
    ja: "電気工事",
  },
  carpinteria: {
    es: "Carpintería",
    en: "Carpentry",
    pt: "Carpintaria",
    fr: "Menuiserie",
    ja: "木工",
  },
  "instalacion de electrodomesticos": {
    es: "Instalación de electrodomésticos",
    en: "Appliance installation",
    pt: "Instalação de eletrodomésticos",
    fr: "Installation d’électroménagers",
    ja: "家電設置",
  },
  "reparacion de vidrios": {
    es: "Reparación de vidrios",
    en: "Glass repair",
    pt: "Reparo de vidros",
    fr: "Réparation de vitres",
    ja: "ガラス修理",
  },
  "hvac (climatizacion)": {
    es: "HVAC (Climatización)",
    en: "HVAC (Climate control)",
    pt: "HVAC (Climatização)",
    fr: "HVAC (Climatisation)",
    ja: "HVAC（空調）",
  },
  "pintura residencial": {
    es: "Pintura residencial",
    en: "Residential painting",
    pt: "Pintura residencial",
    fr: "Peinture résidentielle",
    ja: "住宅塗装",
  },
  "jardineria y paisajismo": {
    es: "Jardinería y paisajismo",
    en: "Gardening and landscaping",
    pt: "Jardinagem e paisagismo",
    fr: "Jardinage et aménagement paysager",
    ja: "造園・ガーデニング",
  },
  "limpieza profunda": {
    es: "Limpieza profunda",
    en: "Deep cleaning",
    pt: "Limpeza profunda",
    fr: "Nettoyage en profondeur",
    ja: "徹底清掃",
  },
};

const normalizeSpecialtyKey = (value) => (value || "").toString().trim().toLowerCase();

const getSpecialtyLabel = (value, lang = currentLanguage) => {
  if (!value) return getCopy("professional_services_specialty_unknown", lang);
  const key = normalizeSpecialtyKey(value);
  const translations = SPECIALTY_TRANSLATIONS[key];
  if (!translations) {
    return value;
  }
  const normalizedLang = normalizeUiLanguage(lang);
  return translations[normalizedLang] || translations.es || value;
};


const inferLanguageCode = (raw = "") => {
  const normalized = raw.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (normalized.includes("ingles") || normalized.includes("english") || normalized.includes("ingl")) {
    return "en";
  }
  if (normalized.includes("portu")) {
    return "pt";
  }
  if (normalized.includes("fran") || normalized.includes("franc") || normalized.includes("french")) {
    return "fr";
  }
  if (normalized.includes("jap") || normalized.includes("nihon") || normalized.includes("jpn")) {
    return "ja";
  }
  return "es";
};

const normalizeUiLanguage = (value) => {
  if (!value) return "es";
  const normalized = value.toString().trim().toLowerCase();
  if (translations[normalized]) {
    return normalized;
  }
  const base = normalized.split(/[-_]/)[0];
  if (translations[base]) {
    return base;
  }
  return inferLanguageCode(normalized);
};

let countriesCache = [];
const countryDictionary = new Map();
let specialtiesCache = [];
let serviceCatalogCache = [];
let professionalRequestsCache = [];
let clientRequestsCache = [];
let adminDisputesCache = [];
const catalogServiceMap = new Map();
let selectedCatalogService = null;
const walletBalanceState = new Map();
let currentLanguage = normalizeUiLanguage(
  localStorage.getItem(STORAGE_KEYS.language) || document.documentElement.lang || "es"
);

const formatTemplate = (template = "", replacements = {}) =>
  template.replace(/\{(\w+)\}/g, (_, key) => replacements[key] ?? "");

const getUrgencyLabel = (urgency = "normal") => {
  const normalized = (urgency || "normal").toLowerCase();
  if (normalized === "high") return getCopy("urgency_high");
  if (normalized === "low") return getCopy("urgency_low");
  return getCopy("urgency_normal");
};

const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  try {
    return date.toLocaleString(currentLanguage || "es", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return date.toISOString();
  }
};

const hasDatePassed = (value) => {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date.getTime() <= Date.now();
};

const toIsoDateTime = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    const normalized = value.trim();
    if (!normalized) return null;
    return normalized.length === 16 ? `${normalized}:00` : normalized;
  }
  const pad = (unit) => `${unit}`.padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const getDatetimeLocalValue = (date = new Date()) => {
  const pad = (value) => `${value}`.padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatCurrencyValue = (value, currency) => {
  const amount = Number(value);
  if (Number.isNaN(amount)) {
    return `${value ?? ""} ${currency ?? ""}`.trim();
  }
  try {
    return new Intl.NumberFormat(currentLanguage || "es", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency ?? ""}`.trim();
  }
};

const getDictionary = (lang = currentLanguage) => translations[lang] ?? translations.es;

const getCopy = (key, lang = currentLanguage) => {
  const normalizedLang = normalizeUiLanguage(lang);
  const overrideDict = translationOverrides[normalizedLang];
  if (overrideDict?.[key]) {
    return overrideDict[key];
  }
  const dict = getDictionary(normalizedLang);
  return dict[key] ?? translations.es[key] ?? "";
};

const getLanguageFriendlyName = (code, lang = currentLanguage) => {
  if (!code) return "";
  const normalizedCode = normalizeUiLanguage(code);
  const dict = getDictionary(lang).language_names || {};
  return dict[normalizedCode] || translations.es.language_names?.[normalizedCode] || normalizedCode.toUpperCase();
};

const renderCountries = (countries = countriesCache) => {
  const labelTemplate = getCopy("country_item_label");
  if (countryList) {
    countryList.innerHTML = "";
  }
  if (!Array.isArray(countries) || !countries.length) return;

  if (countryList) {
    countries.forEach((country) => {
      const item = document.createElement("li");
      item.textContent = formatTemplate(labelTemplate, {
        name: country.name,
        language: country.languageLabel,
        nationality: country.nationalityLabel,
      });
      countryList.appendChild(item);
    });
  }

  countrySelects.forEach((select) => {
    const currentValue = select.value;
    select.innerHTML = "";
    countries.forEach((country) => {
      const option = document.createElement("option");
      option.value = country.code;
      option.textContent = formatTemplate(labelTemplate, {
        name: country.name,
        language: country.languageLabel,
        nationality: country.nationalityLabel,
      });
      option.dataset.countryCode = country.code;
      option.dataset.languageCode = country.languageCode;
      option.dataset.countryName = country.name;
      option.dataset.languageLabel = country.languageLabel;
      option.dataset.currency = country.currency;
      option.dataset.nationalityLabel = country.nationalityLabel;
      option.dataset.adminUsername = country.adminUsername || "";
      option.dataset.adminEmail = country.adminEmail || "";
      select.appendChild(option);
    });
    if (currentValue) {
      select.value = currentValue;
    }
  });
  renderAdminCredentialList(countries);
  renderAdminWorkspaceContext();
};

const renderAdminWorkspaceContext = () => {
  const session = getSession();
  const isAdminSession = session?.userType === "admin";
  if (workspaceType === "admin") {
    setAdminTheme(isAdminSession ? session?.countryCode : null);
  }
  if (!isAdminSession) {
    adminIdentityNodes.forEach((node) => {
      if (!node) return;
      node.textContent = "";
      node.hidden = true;
    });
    adminUsernameNodes.forEach((node) => {
      if (!node) return;
      node.textContent = "";
      node.hidden = true;
    });
    adminEmailNodes.forEach((node) => {
      if (!node) return;
      node.textContent = "";
      node.hidden = true;
    });
    return;
  }
  const country = session.countryCode ? countryDictionary.get(session.countryCode) : null;
  const nationalityLabel = session.nationalityLabel || country?.nationalityLabel || "";
  const badgeText = [country?.name, nationalityLabel].filter(Boolean).join(" · ");
  adminIdentityNodes.forEach((node) => {
    if (!node) return;
    node.textContent = badgeText;
    node.hidden = !badgeText;
  });
  const usernameValue = country?.adminUsername || "";
  adminUsernameNodes.forEach((node) => {
    if (!node) return;
    node.textContent = usernameValue;
    node.hidden = !usernameValue;
  });
  const emailValue = country?.adminEmail || "";
  adminEmailNodes.forEach((node) => {
    if (!node) return;
    node.textContent = emailValue;
    node.hidden = !emailValue;
  });
};

const renderAdminCredentialList = (countries = countriesCache) => {
  if (!adminCredentialList) return;
  if (!Array.isArray(countries) || !countries.length) {
    adminCredentialList.innerHTML = `<li class="admin-credential-list__empty">${getCopy(
      "admin_credentials_empty"
    )}</li>`;
    return;
  }
  adminCredentialList.innerHTML = "";
  countries.forEach((country) => {
    const item = document.createElement("li");
    const meta = document.createElement("div");
    meta.className = "admin-credential-list__meta";
    const title = document.createElement("strong");
    title.textContent = country.name;
    const subtitle = document.createElement("span");
    subtitle.textContent = [country.languageLabel, country.nationalityLabel].filter(Boolean).join(" · ");
    meta.appendChild(title);
    meta.appendChild(subtitle);

    const creds = document.createElement("div");
    creds.className = "admin-credential-list__creds";
    const usernameCode = document.createElement("code");
    usernameCode.textContent = country.adminUsername;
    const emailCode = document.createElement("code");
    emailCode.textContent = country.adminEmail;
    creds.appendChild(usernameCode);
    creds.appendChild(emailCode);

    item.appendChild(meta);
    item.appendChild(creds);
    adminCredentialList.appendChild(item);
  });
};

const renderSpecialties = (specialties = specialtiesCache) => {
  if (!Array.isArray(specialties) || !specialties.length) return;
  specialtySelects.forEach((select) => {
    if (!select) return;
    const currentValue = select.value;
    select.innerHTML = "";
    specialties.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.name;
      option.textContent = getSpecialtyLabel(item.name);
      select.appendChild(option);
    });
    if (currentValue) {
      select.value = currentValue;
    }
  });

  if (catalogSpecialtySelect) {
    const currentValue = catalogSpecialtySelect.value;
    catalogSpecialtySelect.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.dataset.i18nOption = "specialty_filter_all";
    defaultOption.textContent = getCopy("specialty_filter_all");
    catalogSpecialtySelect.appendChild(defaultOption);
    specialties.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.name;
      option.textContent = getSpecialtyLabel(item.name);
      catalogSpecialtySelect.appendChild(option);
    });
    catalogSpecialtySelect.value = currentValue || "";
  }
  lockProfessionalSpecialtySelect();
};

const lockProfessionalSpecialtySelect = () => {
  if (!professionalServiceSpecialtySelect) return;
  const session = getSession();
  const specialty =
    session?.userType === "professional" ? (session.specialty || "").trim() : "";
  if (!specialty) {
    professionalServiceSpecialtySelect.disabled = false;
    professionalServiceSpecialtySelect.removeAttribute("title");
    return;
  }
  const hasOption = Array.from(professionalServiceSpecialtySelect.options).some(
    (option) => option.value === specialty
  );
  if (!hasOption) {
    const option = document.createElement("option");
    option.value = specialty;
    option.textContent = getSpecialtyLabel(specialty);
    professionalServiceSpecialtySelect.appendChild(option);
  }
  professionalServiceSpecialtySelect.value = specialty;
  professionalServiceSpecialtySelect.disabled = true;
  professionalServiceSpecialtySelect.title = getCopy("professional_services_specialty_locked");
};

const requireSession = (expectedType) => {
  const session = getSession();
  if (!session?.email) {
    throw new Error(getCopy("session_missing"));
  }
  if (expectedType && session.userType !== expectedType) {
    throw new Error(getCopy("session_wrong_workspace"));
  }
  return session;
};

const renderSessionContext = () => {
  const session = getSession();
  sessionEmailPlaceholders.forEach((node) => {
    if (!session?.email) {
      node.textContent = "";
      node.hidden = true;
      return;
    }
    const contextType = node.dataset.sessionEmail || session.userType;
    let templateKey = "session_context_client";
    if (contextType === "professional") {
      templateKey = "session_context_professional";
    } else if (contextType === "admin") {
      templateKey = "session_context_admin";
    }
    const template = getCopy(templateKey) || "Active session: {email}";
    node.textContent = formatTemplate(template, { email: session.email });
    node.hidden = false;
  });
  renderAdminWorkspaceContext();
};

const updateWalletBalanceNodes = (userType, payload) => {
  const targets = Array.from(walletBalanceTargets).filter(
    (node) => node?.dataset.walletBalance === userType
  );
  if (!targets.length) return;
  if (!payload) {
    targets.forEach((node) => {
      node.textContent = "";
    });
    return;
  }
  const amount = typeof payload.new_balance !== "undefined" ? payload.new_balance : payload.wallet_balance;
  const currency = payload.currency || "";
  const labelKey = walletBalanceLabelKeys[userType] || "wallet_balance_client_label";
  const formattedAmount = formatCurrencyValue(amount, currency);
  targets.forEach((node) => {
    node.textContent = formatTemplate(getCopy(labelKey), { amount: formattedAmount });
  });
};

const refreshWalletBalance = async (userType) => {
  const targets = Array.from(walletBalanceTargets).filter(
    (node) => node?.dataset.walletBalance === userType
  );
  if (!targets.length) return;
  try {
    const session = requireSession(userType);
    const balanceEmail = encodeURIComponent(session.email?.toLowerCase() || "");
    const data = await fetchJson(`${API_BASE}/payments/balance/${balanceEmail}`);
    walletBalanceState.set(userType, data);
    updateWalletBalanceNodes(userType, data);
  } catch (error) {
    targets.forEach((node) => {
      node.textContent = `${getCopy("wallet_balance_error")}: ${error.message}`;
    });
  }
};

const renderCatalogState = (message, type = "info") => {
  if (!serviceCatalogContainer) return;
  const classes = ["catalog-empty"];
  if (type === "error") {
    classes.push("error");
  }
  serviceCatalogContainer.innerHTML = `<p class="${classes.join(" ")}">${message}</p>`;
};

const renderServiceCatalog = (catalog = serviceCatalogCache) => {
  if (!serviceCatalogContainer) return;
  if (!Array.isArray(catalog) || !catalog.length) {
    catalogServiceMap.clear();
    renderCatalogState(getCopy("catalog_empty"));
    return;
  }

  serviceCatalogContainer.innerHTML = "";
  catalogServiceMap.clear();
  catalog.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "service-card";

    const header = document.createElement("div");
    header.className = "service-card__header";
    const strong = document.createElement("strong");
    strong.textContent = `${entry.professional.first_name} ${entry.professional.last_name}`.trim();
    const meta = document.createElement("span");
    meta.className = "service-list__meta";
    meta.textContent =
      getSpecialtyLabel(entry.professional.specialty) || getCopy("professional_services_specialty_unknown");
    header.appendChild(strong);
    header.appendChild(meta);

    const list = document.createElement("ul");
    list.className = "service-card__services";

    entry.services.forEach((service) => {
      catalogServiceMap.set(service.id, { service, professional: entry.professional });
      const item = document.createElement("li");
      item.className = "service-card__service";

      const details = document.createElement("div");
      details.className = "service-card__service-details";
      const title = document.createElement("strong");
      title.textContent = service.title;
      const description = document.createElement("p");
      description.textContent = service.description;
      details.appendChild(title);
      details.appendChild(description);

      const metaColumn = document.createElement("div");
      metaColumn.className = "service-card__service-meta";
      const price = document.createElement("span");
      price.className = "service-price";
      price.textContent = formatCurrencyValue(service.base_cost, service.currency);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn secondary";
      button.dataset.serviceSelect = "true";
      button.dataset.serviceId = service.id;
      button.textContent = getCopy("catalog_select_button");
      metaColumn.appendChild(price);
      metaColumn.appendChild(button);

      item.appendChild(details);
      item.appendChild(metaColumn);
      list.appendChild(item);
    });

    card.appendChild(header);
    card.appendChild(list);
    serviceCatalogContainer.appendChild(card);
  });
};

const selectServiceFromCatalog = (serviceId) => {
  if (!serviceSelectionSummary) return;
  const payload = catalogServiceMap.get(Number(serviceId));
  if (!payload) return;
  selectedCatalogService = payload;
  if (selectedServiceInput) {
    selectedServiceInput.value = payload.service.id;
  }
  if (serviceSelectionPlaceholder) {
    serviceSelectionPlaceholder.hidden = true;
  }
  if (serviceSelectionDetails) {
    serviceSelectionDetails.hidden = false;
  }
  if (selectedServiceNameNode) {
    selectedServiceNameNode.textContent = payload.service.title;
  }
  if (selectedServicePriceNode) {
    selectedServicePriceNode.textContent = formatCurrencyValue(payload.service.base_cost, payload.service.currency);
  }
  if (selectedServiceProfessionalNode) {
    const specialtyLabel = getSpecialtyLabel(
      payload.service.specialty || payload.professional.specialty
    );
    selectedServiceProfessionalNode.textContent = formatTemplate(getCopy("service_request_professional_label"), {
      professional: `${payload.professional.first_name} ${payload.professional.last_name}`.trim(),
      specialty: specialtyLabel || getCopy("professional_services_specialty_unknown"),
    });
  }
};

const clearServiceSelection = () => {
  if (!serviceSelectionSummary) return;
  selectedCatalogService = null;
  if (selectedServiceInput) {
    selectedServiceInput.value = "";
  }
  if (serviceSelectionDetails) {
    serviceSelectionDetails.hidden = true;
  }
  if (serviceSelectionPlaceholder) {
    serviceSelectionPlaceholder.hidden = false;
    serviceSelectionPlaceholder.textContent = getCopy("service_request_selected_placeholder");
  }
};

const updateServiceSelectionCopy = () => {
  if (!serviceSelectionSummary) return;
  if (!selectedCatalogService) {
    if (serviceSelectionPlaceholder) {
      serviceSelectionPlaceholder.textContent = getCopy("service_request_selected_placeholder");
      serviceSelectionPlaceholder.hidden = false;
    }
    if (serviceSelectionDetails) {
      serviceSelectionDetails.hidden = true;
    }
    return;
  }
  if (!catalogServiceMap.has(selectedCatalogService.service.id)) {
    clearServiceSelection();
    return;
  }
  selectServiceFromCatalog(selectedCatalogService.service.id);
};

const handleCatalogClick = (event) => {
  const button = event.target.closest("[data-service-select]");
  if (!button) return;
  selectServiceFromCatalog(button.dataset.serviceId);
};

const loadServiceCatalog = async (specialty = "") => {
  if (!serviceCatalogContainer) return;
  const session = getSession();
  const viewerCountry = session?.countryCode;
  if (!viewerCountry) {
    renderCatalogState(getCopy("catalog_country_required"), "error");
    return;
  }
  renderCatalogState(getCopy("processing"));
  try {
    const params = new URLSearchParams();
    params.append("country", viewerCountry.toUpperCase());
    if (specialty) {
      params.append("specialty", specialty);
    }
    const query = params.toString();
    const data = await fetchJson(`${API_BASE}/professionals/services${query ? `?${query}` : ""}`);
    serviceCatalogCache = data;
    renderServiceCatalog(data);
    clearServiceSelection();
  } catch (error) {
    renderCatalogState(`${getCopy("catalog_error")}: ${error.message}`, "error");
  }
};
const fetchJson = async (endpoint) => {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Error al cargar ${endpoint}`);
  }
  return response.json();
};

const setMessage = (formId, message, type = "success") => {
  const node = messageMap[formId];
  if (!node) return;
  node.textContent = message ?? "";
  node.dataset.type = type;
};

const parseError = async (response) => {
  try {
    const data = await response.json();
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) return data.detail.map((d) => d.msg || d.detail).join(" | ");
    return data.message || getCopy("generic_error");
  } catch {
    return getCopy("generic_error");
  }
};

const normalizeCountry = (country) => {
  const code = country.code || country.currency || country.name;
  const languageSource =
    country.language_code || country.languageCode || country.language_label || country.language;
  const languageCode = normalizeUiLanguage(
    languageSource || inferLanguageCode(country.language_label || country.language)
  );
  const languageLabel = country.language_label || LANGUAGE_FALLBACK_LABEL[languageCode] || languageCode.toUpperCase();
  const nationalityLabel = country.nationality_label || country.nationalityLabel || country.name;
  const adminEmail = country.admin_email || country.adminEmail || "";
  const adminUsername =
    country.admin_username || country.adminUsername || (adminEmail ? adminEmail.split("@")[0] : "");
  const entry = {
    code,
    name: country.name,
    currency: country.currency,
    languageCode,
    languageLabel,
    nationalityLabel,
    adminEmail,
    adminUsername,
  };
  countryDictionary.set(code, entry);
  return entry;
};

const readPreferences = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.preferences) || "{}");
  } catch {
    return {};
  }
};

const writePreferences = (data) => {
  localStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(data));
};

const toggleProfessionalServiceEmptyState = () => {
  if (!professionalServiceList || !professionalServiceEmptyState) return;
  professionalServiceEmptyState.hidden = professionalServiceList.children.length > 0;
};

const appendProfessionalServicePreview = (service) => {
  if (!professionalServiceList || !service) return;
  const item = document.createElement("li");
  item.className = "service-list__item";

  const title = document.createElement("strong");
  title.textContent = service.title;
  const price = document.createElement("span");
  price.className = "service-price";
  price.textContent = formatCurrencyValue(service.base_cost, service.currency);
  const specialty = document.createElement("p");
  specialty.className = "service-list__meta";
    specialty.textContent =
      getSpecialtyLabel(service.specialty) || getCopy("professional_services_specialty_unknown");
  const description = document.createElement("p");
  description.className = "service-list__meta";
  description.textContent = service.description;

  item.appendChild(title);
  item.appendChild(price);
  item.appendChild(specialty);
  item.appendChild(description);
  professionalServiceList.prepend(item);
  toggleProfessionalServiceEmptyState();
};

const renderProfessionalRequests = (requests = professionalRequestsCache) => {
  if (!professionalRequestList) return;
  professionalRequestList.innerHTML = "";
  professionalRequestsCache = Array.isArray(requests) ? requests : [];
  toggleProfessionalRequestEmptyState();
  if (!professionalRequestsCache.length) {
    return;
  }

  professionalRequestsCache.forEach((request) => {
    const item = document.createElement("li");
    item.className = "service-list__item";

    const header = document.createElement("div");
    header.className = "service-card__header";
    const title = document.createElement("strong");
    title.textContent = request.category || getCopy("professional_services_specialty_unknown");
    const urgency = document.createElement("span");
    urgency.className = `chip chip--${request.urgency || "normal"}`;
    urgency.textContent = getUrgencyLabel(request.urgency);
    header.appendChild(title);
    header.appendChild(urgency);

    const description = document.createElement("p");
    description.className = "service-list__meta";
    description.textContent = request.description;

    const clientMeta = document.createElement("p");
    clientMeta.className = "service-list__meta";
    const requestClientEmail = (request.client_email || "").toLowerCase() || getCopy("session_missing");
    clientMeta.textContent = formatTemplate(getCopy("professional_requests_client_label"), {
      email: requestClientEmail,
    });

    const scheduleField = document.createElement("div");
    scheduleField.className = "service-list__field";
    const scheduleLabel = document.createElement("label");
    scheduleLabel.textContent = getCopy("professional_requests_schedule_label");
    const scheduleInput = document.createElement("input");
    scheduleInput.type = "datetime-local";
    scheduleInput.required = false;
    scheduleInput.dataset.requestSchedule = request.id;
    scheduleInput.min = getDatetimeLocalValue(new Date());
    scheduleLabel.appendChild(scheduleInput);
    scheduleField.appendChild(scheduleLabel);
    const scheduleHint = document.createElement("p");
    scheduleHint.className = "service-list__hint";
    scheduleHint.textContent = getCopy("professional_requests_schedule_hint");
    scheduleField.appendChild(scheduleHint);

    const actions = document.createElement("div");
    actions.className = "service-list__actions";

    const acceptButton = document.createElement("button");
    acceptButton.type = "button";
    acceptButton.className = "btn secondary";
    acceptButton.textContent = getCopy("professional_requests_accept");
    acceptButton.dataset.requestId = request.id;
    acceptButton.dataset.requestAction = "accept";

    const rejectButton = document.createElement("button");
    rejectButton.type = "button";
    rejectButton.className = "btn ghost";
    rejectButton.textContent = getCopy("professional_requests_reject");
    rejectButton.dataset.requestId = request.id;
    rejectButton.dataset.requestAction = "reject";

    actions.appendChild(acceptButton);
    actions.appendChild(rejectButton);

    item.appendChild(header);
    item.appendChild(description);
    item.appendChild(clientMeta);
    item.appendChild(scheduleField);
    item.appendChild(actions);
    professionalRequestList.appendChild(item);
  });
};

const toggleProfessionalRequestEmptyState = () => {
  if (!professionalRequestEmptyState) return;
  const hasRequests = Array.isArray(professionalRequestsCache) && professionalRequestsCache.length > 0;
  professionalRequestEmptyState.hidden = hasRequests;
};

const handleProfessionalRequestAction = (event) => {
  const button = event.target.closest("[data-request-action]");
  if (!button) return;
  const action = button.dataset.requestAction;
  const requestId = Number(button.dataset.requestId);
  if (!requestId || !action) {
    return;
  }
  let scheduleValue = null;
  if (action === "accept") {
    const container = button.closest(".service-list__item");
    const scheduleInput = container?.querySelector("[data-request-schedule]");
    scheduleValue = scheduleInput?.value || "";
    if (!scheduleValue) {
      setMessage("professional-request-message", getCopy("professional_requests_schedule_required"), "error");
      return;
    }
  }
  decideProfessionalRequest(requestId, action, scheduleValue);
};

const loadProfessionalRequests = async () => {
  if (!professionalRequestList) return;
  try {
    const session = requireSession("professional");
    const params = new URLSearchParams({
      professional_email: session.email?.toLowerCase(),
      status: "pending",
    });
    const requestUrl = `${API_BASE}/professionals/requests?${params.toString()}`;
    const data = await fetchJson(requestUrl);
    professionalRequestsCache = data;
    renderProfessionalRequests(data);
  } catch (error) {
    setMessage(
      "professional-request-message",
      `${getCopy("professional_requests_error")}: ${error.message}`,
      "error"
    );
  }
};

const decideProfessionalRequest = async (requestId, action, scheduledAtValue = null) => {
  try {
    const session = requireSession("professional");
    setMessage("professional-request-message", getCopy("processing"), "info");
    const payload = {
      professional_email: session.email?.toLowerCase(),
      action,
    };
    if (action === "accept" && scheduledAtValue) {
      payload.scheduled_at = toIsoDateTime(scheduledAtValue);
    }
    const response = await fetch(`${API_BASE}/professionals/requests/${requestId}/decision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorMessage = (await parseError(response)) || getCopy("professional_requests_error");
      setMessage("professional-request-message", errorMessage, "error");
      return;
    }
    await response.json();
    const successKey =
      action === "accept" ? "professional_requests_accept_success" : "professional_requests_reject_success";
    setMessage("professional-request-message", getCopy(successKey), "success");
    await loadProfessionalRequests();
  } catch (error) {
    setMessage(
      "professional-request-message",
      error.message || getCopy("professional_requests_error"),
      "error"
    );
  }
};

const toggleClientRequestEmptyState = () => {
  if (!clientRequestEmptyState) return;
  const hasRequests = Array.isArray(clientRequestsCache) && clientRequestsCache.length > 0;
  clientRequestEmptyState.hidden = hasRequests;
};

const renderClientRequests = (requests = clientRequestsCache) => {
  if (!clientRequestList) return;
  clientRequestList.innerHTML = "";
  clientRequestsCache = Array.isArray(requests) ? requests : [];
  toggleClientRequestEmptyState();
  if (!clientRequestsCache.length) {
    return;
  }

  clientRequestsCache.forEach((request) => {
    const item = document.createElement("li");
    item.className = "service-list__item";
    item.dataset.requestId = request.id;

    const header = document.createElement("div");
    header.className = "service-card__header";
    const title = document.createElement("strong");
    title.textContent = request.category || getCopy("professional_services_specialty_unknown");
    const statusChip = document.createElement("span");
    statusChip.className = "chip";
    statusChip.textContent = getCopy(`client_requests_status_${request.status}`) || request.status;
    header.appendChild(title);
    header.appendChild(statusChip);

    const description = document.createElement("p");
    description.className = "service-list__meta";
    description.textContent = request.description;

    const professionalMeta = document.createElement("p");
    professionalMeta.className = "service-list__meta";
    professionalMeta.textContent = formatTemplate(getCopy("client_requests_professional_label"), {
      email: request.professional_email || getCopy("session_missing"),
    });

    const costMeta = document.createElement("p");
    costMeta.className = "service-list__meta";
    costMeta.textContent = formatTemplate(getCopy("client_requests_cost_label"), {
      amount: formatCurrencyValue(request.estimated_cost, request.currency),
    });

    const urgencyMeta = document.createElement("p");
    urgencyMeta.className = "service-list__meta";
    urgencyMeta.textContent = formatTemplate(getCopy("client_requests_urgency_label"), {
      urgency: getUrgencyLabel(request.urgency),
    });

    const scheduleMeta = document.createElement("p");
    scheduleMeta.className = "service-list__meta";
    if (request.scheduled_at) {
      scheduleMeta.textContent = formatTemplate(getCopy("client_requests_schedule_info"), {
        date: formatDateTime(request.scheduled_at),
      });
    } else if (request.status === "assigned") {
      scheduleMeta.textContent = getCopy("client_requests_schedule_pending");
    } else if (request.status === "pending") {
      scheduleMeta.textContent = getCopy("client_requests_schedule_pending");
    } else {
      scheduleMeta.textContent = "";
    }

    item.appendChild(header);
    item.appendChild(description);
    item.appendChild(professionalMeta);
    item.appendChild(costMeta);
    item.appendChild(urgencyMeta);
    if (scheduleMeta.textContent) {
      item.appendChild(scheduleMeta);
    }

    if (request.status === "completed") {
      const result = document.createElement("p");
      result.className = "service-list__meta";
      const copyKey =
        request.satisfaction === false && request.admin_reviewed_by
          ? "client_requests_dispute_approved"
          : "client_requests_success_positive";
      result.textContent = getCopy(copyKey);
      item.appendChild(result);
    } else if (request.status === "disputed") {
      const result = document.createElement("p");
      result.className = "service-list__meta";
      result.textContent = getCopy("client_requests_disputed_message");
      item.appendChild(result);
    } else if (request.status === "cancelled" && request.satisfaction === false) {
      const result = document.createElement("p");
      result.className = "service-list__meta";
      const copyKey = request.admin_reviewed_by
        ? "client_requests_dispute_rejected"
        : "client_requests_success_negative";
      result.textContent = getCopy(copyKey);
      item.appendChild(result);
    } else if (request.status === "cancelled") {
      const result = document.createElement("p");
      result.className = "service-list__meta";
      const copyKey =
        request.satisfaction === null
          ? "client_requests_rejected_by_professional"
          : "client_requests_status_cancelled";
      result.textContent = getCopy(copyKey);
      item.appendChild(result);
    }

    if (request.client_feedback) {
      const feedback = document.createElement("p");
      feedback.className = "service-list__meta";
      feedback.textContent = request.client_feedback;
      item.appendChild(feedback);
    }

    if (request.admin_reviewed_by) {
      const reviewer = document.createElement("p");
      reviewer.className = "service-list__meta";
      reviewer.textContent = formatTemplate(getCopy("client_requests_admin_resolution"), {
        email: request.admin_reviewed_by,
      });
      item.appendChild(reviewer);
    }
    if (request.admin_review_notes) {
      const notes = document.createElement("p");
      notes.className = "service-list__meta";
      const template = getCopy("client_requests_admin_notes_label");
      notes.textContent = template?.includes("{notes}")
        ? template.replace("{notes}", request.admin_review_notes)
        : `${template || ""} ${request.admin_review_notes}`.trim();
      item.appendChild(notes);
    }

    const readyForConfirmation =
      request.status === "assigned" && request.scheduled_at && hasDatePassed(request.scheduled_at);
    if (readyForConfirmation) {
      const feedbackField = document.createElement("textarea");
      feedbackField.rows = 2;
      feedbackField.maxLength = 255;
      feedbackField.dataset.feedbackInput = request.id;
      feedbackField.placeholder = getCopy("client_requests_feedback_placeholder");

      const hint = document.createElement("p");
      hint.className = "service-list__hint";
      hint.textContent = getCopy("client_requests_ready_to_confirm");

      const actions = document.createElement("div");
      actions.className = "service-list__actions";

      const successButton = document.createElement("button");
      successButton.type = "button";
      successButton.className = "btn secondary";
      successButton.dataset.clientRequestAction = "success";
      successButton.dataset.requestId = request.id;
      successButton.textContent = getCopy("client_requests_accept_action");

      const issueButton = document.createElement("button");
      issueButton.type = "button";
      issueButton.className = "btn ghost";
      issueButton.dataset.clientRequestAction = "issue";
      issueButton.dataset.requestId = request.id;
      issueButton.textContent = getCopy("client_requests_reject_action");

      actions.appendChild(successButton);
      actions.appendChild(issueButton);

      item.appendChild(feedbackField);
      item.appendChild(hint);
      item.appendChild(actions);
    } else if (request.status === "assigned" && request.scheduled_at && !hasDatePassed(request.scheduled_at)) {
      const waitHint = document.createElement("p");
      waitHint.className = "service-list__hint";
      waitHint.textContent = getCopy("client_requests_wait_for_date");
      item.appendChild(waitHint);
    }

    clientRequestList.appendChild(item);
  });
};

const handleClientRequestAction = (event) => {
  const button = event.target.closest("[data-client-request-action]");
  if (!button) return;
  const requestId = Number(button.dataset.requestId);
  if (!requestId) return;
  const satisfied = button.dataset.clientRequestAction === "success";
  const container = button.closest(".service-list__item");
  const feedbackInput = container?.querySelector("[data-feedback-input]");
  const feedback = feedbackInput?.value || "";
  confirmClientRequest(requestId, satisfied, feedback);
};

const loadClientRequests = async () => {
  if (!clientRequestList) return;
  try {
    const session = requireSession("client");
    const encodedEmail = encodeURIComponent(session.email?.toLowerCase());
    const data = await fetchJson(`${API_BASE}/clients/${encodedEmail}/requests`);
    clientRequestsCache = data;
    renderClientRequests(data);
  } catch (error) {
    setMessage("client-request-message", `${getCopy("client_requests_error")}: ${error.message}`, "error");
  }
};

const confirmClientRequest = async (requestId, satisfied, feedback) => {
  try {
    const session = requireSession("client");
    setMessage("client-request-message", getCopy("processing"), "info");
    const cleanFeedback = (feedback || "").trim();
    const response = await fetch(`${API_BASE}/clients/requests/${requestId}/confirmation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_email: session.email?.toLowerCase(),
        satisfied,
        feedback: cleanFeedback || null,
      }),
    });
    if (!response.ok) {
      const errorMessage = (await parseError(response)) || getCopy("client_requests_error");
      setMessage("client-request-message", errorMessage, "error");
      return;
    }
    await response.json();
    const successKey = satisfied ? "client_requests_success_positive" : "client_requests_success_negative";
    setMessage("client-request-message", getCopy(successKey), "success");
    await loadClientRequests();
    await refreshWalletBalance("client");
    await refreshWalletBalance("professional");
  } catch (error) {
    setMessage("client-request-message", error.message || getCopy("client_requests_error"), "error");
  }
};

const toggleAdminDisputeEmptyState = () => {
  if (!adminDisputeEmptyState) return;
  const hasDisputes = Array.isArray(adminDisputesCache) && adminDisputesCache.length > 0;
  adminDisputeEmptyState.hidden = hasDisputes;
};

const renderAdminDisputes = (requests = adminDisputesCache) => {
  if (!adminDisputeList) return;
  adminDisputeList.innerHTML = "";
  adminDisputesCache = Array.isArray(requests) ? requests : [];
  toggleAdminDisputeEmptyState();
  if (!adminDisputesCache.length) {
    return;
  }
  adminDisputesCache.forEach((request) => {
    const item = document.createElement("li");
    item.className = "service-list__item";
    item.dataset.requestId = request.id;

    const header = document.createElement("div");
    header.className = "service-card__header";
    const title = document.createElement("strong");
    const serviceName = request.category || getCopy("professional_services_specialty_unknown");
    title.textContent = `#${request.id} - ${serviceName}`;
    const statusChip = document.createElement("span");
    statusChip.className = "chip";
    statusChip.textContent = getCopy(`client_requests_status_${request.status}`) || request.status;
    header.appendChild(title);
    header.appendChild(statusChip);

    const description = document.createElement("p");
    description.className = "service-list__meta";
    description.textContent = request.description;

    const clientMeta = document.createElement("p");
    clientMeta.className = "service-list__meta";
    clientMeta.textContent = formatTemplate(getCopy("professional_requests_client_label"), {
      email: request.client_email || getCopy("session_missing"),
    });

    const professionalMeta = document.createElement("p");
    professionalMeta.className = "service-list__meta";
    professionalMeta.textContent = formatTemplate(getCopy("client_requests_professional_label"), {
      email: request.professional_email || getCopy("session_missing"),
    });

    const costMeta = document.createElement("p");
    costMeta.className = "service-list__meta";
    costMeta.textContent = formatTemplate(getCopy("client_requests_cost_label"), {
      amount: formatCurrencyValue(request.estimated_cost, request.currency),
    });

    const urgencyMeta = document.createElement("p");
    urgencyMeta.className = "service-list__meta";
    urgencyMeta.textContent = formatTemplate(getCopy("client_requests_urgency_label"), {
      urgency: getUrgencyLabel(request.urgency),
    });

    const scheduleMeta = document.createElement("p");
    scheduleMeta.className = "service-list__meta";
    scheduleMeta.textContent = request.scheduled_at
      ? formatTemplate(getCopy("client_requests_schedule_info"), {
          date: formatDateTime(request.scheduled_at),
        })
      : getCopy("client_requests_schedule_pending");

    const feedback = document.createElement("p");
    feedback.className = "service-list__meta";
    if (request.client_feedback) {
      const template = getCopy("admin_disputes_client_feedback");
      feedback.textContent = template?.includes("{feedback}")
        ? template.replace("{feedback}", request.client_feedback)
        : `${template || ""} ${request.client_feedback}`.trim();
    } else {
      feedback.textContent = getCopy("admin_disputes_client_feedback_missing");
    }

    const notesField = document.createElement("textarea");
    notesField.rows = 2;
    notesField.maxLength = 255;
    notesField.dataset.adminNotesInput = request.id;
    notesField.placeholder = getCopy("admin_disputes_notes_placeholder");

    const actions = document.createElement("div");
    actions.className = "service-list__actions";

    const payButton = document.createElement("button");
    payButton.type = "button";
    payButton.className = "btn secondary";
    payButton.dataset.adminDisputeAction = "approve";
    payButton.dataset.requestId = request.id;
    payButton.textContent = getCopy("admin_disputes_action_pay");

    const upholdButton = document.createElement("button");
    upholdButton.type = "button";
    upholdButton.className = "btn ghost";
    upholdButton.dataset.adminDisputeAction = "deny";
    upholdButton.dataset.requestId = request.id;
    upholdButton.textContent = getCopy("admin_disputes_action_uphold");

    actions.appendChild(payButton);
    actions.appendChild(upholdButton);

    item.appendChild(header);
    item.appendChild(description);
    item.appendChild(clientMeta);
    item.appendChild(professionalMeta);
    item.appendChild(costMeta);
    item.appendChild(urgencyMeta);
    item.appendChild(scheduleMeta);
    item.appendChild(feedback);
    item.appendChild(notesField);
    item.appendChild(actions);

    adminDisputeList.appendChild(item);
  });
};

const handleAdminDisputeAction = (event) => {
  const button = event.target.closest("[data-admin-dispute-action]");
  if (!button) return;
  const requestId = Number(button.dataset.requestId);
  if (!requestId) return;
  const approve = button.dataset.adminDisputeAction === "approve";
  const container = button.closest(".service-list__item");
  const notesInput = container?.querySelector("[data-admin-notes-input]");
  const notes = notesInput?.value || "";
  resolveAdminDispute(requestId, approve, notes);
};

const loadAdminDisputes = async () => {
  if (!adminDisputeList) return;
  try {
    const session = requireSession("admin");
    const encodedEmail = encodeURIComponent(session.email?.toLowerCase());
    const data = await fetchJson(`${API_BASE}/admin/requests/disputes?admin_email=${encodedEmail}`);
    adminDisputesCache = data;
    renderAdminDisputes(data);
    setMessage("admin-dispute-message", "", "success");
  } catch (error) {
    setMessage("admin-dispute-message", `${getCopy("admin_disputes_error")}: ${error.message}`, "error");
  }
};

const resolveAdminDispute = async (requestId, approvePayment, notes) => {
  try {
    const session = requireSession("admin");
    setMessage("admin-dispute-message", getCopy("processing"), "info");
    const response = await fetch(`${API_BASE}/admin/requests/${requestId}/decision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        admin_email: session.email?.toLowerCase(),
        approve_payment: approvePayment,
        notes: (notes || "").trim() || null,
      }),
    });
    if (!response.ok) {
      const errorMessage = (await parseError(response)) || getCopy("admin_disputes_error");
      setMessage("admin-dispute-message", errorMessage, "error");
      return;
    }
    await response.json();
    const successKey = approvePayment ? "admin_disputes_paid_success" : "admin_disputes_denied_success";
    setMessage("admin-dispute-message", getCopy(successKey), "success");
    await loadAdminDisputes();
  } catch (error) {
    setMessage("admin-dispute-message", error.message || getCopy("admin_disputes_error"), "error");
  }
};

const persistUserProfile = (email, userType, countryCode, overrides = {}) => {
  if (!email) return;
  const preferences = readPreferences();
  const normalizedEmail = email.toLowerCase();
  const lookupCode = countryCode || overrides.countryCode || null;
  const country = lookupCode ? countryDictionary.get(lookupCode) : null;
  const languageCode = normalizeUiLanguage(
    overrides.languageCode || country?.languageCode || currentLanguage || "es"
  );
  const languageLabel =
    overrides.languageLabel || country?.languageLabel || getLanguageFriendlyName(languageCode, "es");
  const nationalityLabel = overrides.nationalityLabel || country?.nationalityLabel || "";
  preferences[normalizedEmail] = {
    userType,
    countryCode: country?.code || lookupCode || "",
    countryName: overrides.countryName || country?.name || lookupCode || "",
    languageCode,
    languageLabel,
    nationalityLabel,
    updatedAt: new Date().toISOString(),
  };
  writePreferences(preferences);
};

const getCountryPreferenceFromForm = (form) => {
  if (!form) return {};
  const select = form.querySelector("[data-country-select]");
  if (!select) return {};
  const option = select.options[select.selectedIndex];
  if (!option) return {};
  const stored = option.value ? countryDictionary.get(option.value) : null;
  const rawLanguageCode = option.dataset.languageCode || stored?.languageCode;
  const normalizedLanguageCode = rawLanguageCode ? normalizeUiLanguage(rawLanguageCode) : undefined;
  return {
    countryCode: option.value,
    countryName: option.dataset.countryName || stored?.name || option.value,
    languageCode: normalizedLanguageCode,
    languageLabel:
      option.dataset.languageLabel ||
      stored?.languageLabel ||
      (normalizedLanguageCode ? getLanguageFriendlyName(normalizedLanguageCode, "es") : undefined),
    nationalityLabel: option.dataset.nationalityLabel || stored?.nationalityLabel,
  };
};

const getUserPreference = (email) => {
  if (!email) return null;
  const preferences = readPreferences();
  return preferences[email.toLowerCase()] || null;
};

const applyTranslations = (lang = currentLanguage) => {
  const nextLanguage = normalizeUiLanguage(lang);
  currentLanguage = nextLanguage;
  document.documentElement.lang = nextLanguage;
  if (languageSelect) {
    languageSelect.value = nextLanguage;
  }

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    const text = getCopy(key, nextLanguage);
    if (text) {
      node.innerHTML = text;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    const text = getCopy(key, nextLanguage);
    if (text) {
      node.placeholder = text;
    }
  });

  document.querySelectorAll("[data-i18n-option]").forEach((node) => {
    const key = node.dataset.i18nOption;
    const text = getCopy(key, nextLanguage);
    if (text) {
      node.textContent = text;
    }
  });

  renderCountries();
  renderSpecialties();
  renderSessionContext();
  renderServiceCatalog();
  renderProfessionalRequests();
  updateServiceSelectionCopy();
};

const activateAuthView = (target) => {
  if (!target || !authViewTabs.length || !authViewPanels.length) return;
  authViewTabs.forEach((tab) => {
    const isActive = tab.dataset.authView === target;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
    tab.setAttribute("tabindex", isActive ? "0" : "-1");
  });
  authViewPanels.forEach((panel) => {
    const isActive = panel.dataset.authPanel === target;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
};

const setupAuthViewTabs = () => {
  if (!authViewTabs.length || !authViewPanels.length) return;
  const defaultTab =
    Array.from(authViewTabs).find((tab) => tab.classList.contains("is-active")) || authViewTabs[0];
  activateAuthView(defaultTab?.dataset.authView);
  authViewTabs.forEach((tab) => {
    tab.addEventListener("click", () => activateAuthView(tab.dataset.authView));
  });
  if (authViewTriggers.length) {
    authViewTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => activateAuthView(trigger.dataset.authTrigger));
    });
  }
};

const activateRegisterPanel = (target) => {
  if (!target || !registerTabs.length || !registerPanels.length) return;
  registerTabs.forEach((tab) => {
    const isActive = tab.dataset.registerTab === target;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
    tab.setAttribute("tabindex", isActive ? "0" : "-1");
  });
  registerPanels.forEach((panel) => {
    const isActive = panel.dataset.registerPanel === target;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
};

const setupRegisterTabs = () => {
  if (!registerTabs.length || !registerPanels.length) return;
  const defaultTab =
    Array.from(registerTabs).find((tab) => tab.classList.contains("is-active")) || registerTabs[0];
  activateRegisterPanel(defaultTab?.dataset.registerTab);
  registerTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activateRegisterPanel(tab.dataset.registerTab);
    });
  });
};

const setupInteractions = () => {
  if (languageSelect) {
    languageSelect.value = currentLanguage;
    languageSelect.addEventListener("change", (event) => {
      const nextLanguage = event.target.value;
      applyTranslations(nextLanguage);
      localStorage.setItem(STORAGE_KEYS.language, nextLanguage);
    });
  }

  setupRegisterTabs();
  setupAuthViewTabs();

  if (catalogSpecialtySelect && serviceCatalogContainer) {
    catalogSpecialtySelect.addEventListener("change", (event) => {
      loadServiceCatalog(event.target.value);
    });
  }

  if (serviceCatalogContainer) {
    serviceCatalogContainer.addEventListener("click", handleCatalogClick);
  }

  if (professionalRequestList) {
    professionalRequestList.addEventListener("click", handleProfessionalRequestAction);
  }

  if (clientRequestList) {
    clientRequestList.addEventListener("click", handleClientRequestAction);
  }

  if (adminDisputeList) {
    adminDisputeList.addEventListener("click", handleAdminDisputeAction);
  }

  toggleProfessionalServiceEmptyState();
  toggleProfessionalRequestEmptyState();
  toggleClientRequestEmptyState();

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      clearSession();
      setAdminTheme(null);
      window.location.href = "index.html";
    });
  }
};

const redirectToWorkspace = (userType) => {
  const target = WORKSPACE_ROUTES[userType] || WORKSPACE_ROUTES.client;
  window.location.href = target;
};

const handleLoginSuccess = (requestPayload, responseData) => {
  const user = responseData?.user || {};
  const email = (user.email || requestPayload.email || "").toLowerCase();
  const type = user.user_type || requestPayload.user_type;
  const preference = getUserPreference(email);
  const userId = user.id ?? getSession()?.userId ?? null;

  const countryEntry = user.country ? countryDictionary.get(user.country) : null;
  const backendLanguageCode = user.language_code || user.languageCode;
  const backendLanguage = backendLanguageCode ? normalizeUiLanguage(backendLanguageCode) : null;
  const preferenceLanguage = preference?.languageCode;
  const countryLanguage = countryEntry?.languageCode;
  const nextLanguage = backendLanguage || preferenceLanguage || countryLanguage || currentLanguage;

  const countryName = preference?.countryName || countryEntry?.name || user.country || "";
  const languageLabel =
    preference?.languageLabel || countryEntry?.languageLabel || getLanguageFriendlyName(nextLanguage);
  const nationalityLabel = preference?.nationalityLabel || countryEntry?.nationalityLabel || "";

  persistUserProfile(email, type, user.country, {
    countryName,
    languageCode: nextLanguage,
    languageLabel,
    nationalityLabel,
  });

  persistSession({
    email,
    userId,
    userType: type,
    specialty: user.specialty || null,
    languageCode: nextLanguage,
    countryName,
    countryCode: user.country || preference?.countryCode || "",
    languageLabel,
    nationalityLabel,
  });
  renderSessionContext();

  if (nextLanguage !== currentLanguage) {
    applyTranslations(nextLanguage);
    localStorage.setItem(STORAGE_KEYS.language, nextLanguage);
  }

  redirectToWorkspace(type);
};

const ensureWorkspaceAccess = () => {
  if (!workspaceType) return;
  const session = getSession();
  if (!session) {
    window.location.href = "index.html";
    return;
  }

  if (session.userType !== workspaceType) {
    redirectToWorkspace(session.userType);
    return;
  }

  if (workspaceType === "admin") {
    setAdminTheme(session.countryCode);
  }

  const sessionLanguage = session.languageCode || currentLanguage;
  if (sessionLanguage !== currentLanguage) {
    applyTranslations(sessionLanguage);
    localStorage.setItem(STORAGE_KEYS.language, sessionLanguage);
  }
  renderSessionContext();

};

const setupForm = (formId, endpoint, transformPayload, { onSuccess } = {}) => {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage(formId, getCopy("processing"), "info");
    let payload;
    try {
      payload = transformPayload(new FormData(form));
    } catch (error) {
      setMessage(formId, error.message, "error");
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorMessage = await parseError(response);
        setMessage(formId, errorMessage, "error");
        return;
      }

      const data = await response.json();
      let successMessage = data.message ?? getCopy("success_default");
      if (typeof data.new_balance !== "undefined") {
        successMessage = `${successMessage}. ${data.new_balance} ${data.currency ?? ""}`;
      }
      setMessage(formId, successMessage, "success");
      onSuccess?.(payload, data, form);
      form.reset();
    } catch (error) {
      setMessage(formId, error.message, "error");
    }
  });
};

const init = async () => {
  setupForm(
    "login-form",
    `${API_BASE}/auth/login`,
    (formData) => ({
      email: formData.get("email"),
      password: formData.get("password"),
      user_type: formData.get("user_type"),
    }),
    {
      onSuccess: (payload, data) => handleLoginSuccess(payload, data),
    }
  );

  setupForm(
    "client-form",
    `${API_BASE}/auth/register/client`,
    (formData) => ({
      email: formData.get("email"),
      password: formData.get("password"),
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      country: formData.get("country"),
    }),
    {
      onSuccess: (payload, _data, form) => {
        const preference = getCountryPreferenceFromForm(form);
        persistUserProfile(payload.email, "client", payload.country, preference);
      },
    }
  );

  setupForm(
    "professional-form",
    `${API_BASE}/auth/register/professional`,
    (formData) => ({
      email: formData.get("email"),
      password: formData.get("password"),
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      phone: formData.get("phone"),
      specialty: formData.get("specialty"),
      country: formData.get("country"),
    }),
    {
      onSuccess: (payload, _data, form) => {
        const preference = getCountryPreferenceFromForm(form);
        persistUserProfile(payload.email, "professional", payload.country, preference);
      },
    }
  );

  setupForm(
    "deposit-form",
    `${API_BASE}/payments/deposit`,
    (formData) => {
      const session = requireSession("client");
      return {
        email: session.email?.toLowerCase(),
        amount: formData.get("amount"),
      };
    },
    {
      onSuccess: async () => {
        await refreshWalletBalance("client");
      },
    }
  );

  setupForm(
    "withdraw-form",
    `${API_BASE}/payments/withdraw`,
    (formData) => {
      const session = requireSession("professional");
      return {
        email: session.email?.toLowerCase(),
        amount: formData.get("amount"),
      };
    },
    {
      onSuccess: async () => {
        await refreshWalletBalance("professional");
      },
    }
  );

  setupForm(
    "professional-service-form",
    `${API_BASE}/professionals/services`,
    (formData) => {
      const session = requireSession("professional");
      const specialtyFromSession = (session.specialty || "").trim();
      const specialtyFromForm = (formData.get("specialty") || "").toString().trim();
      return {
        specialty: specialtyFromSession || specialtyFromForm,
        title: formData.get("title"),
        description: formData.get("description"),
        base_cost: formData.get("base_cost"),
        professional_email: session.email?.toLowerCase(),
        professional_id: session.userId ?? undefined,
      };
    },
    {
      onSuccess: (_payload, data) => {
        appendProfessionalServicePreview(data);
        setTimeout(() => {
          lockProfessionalSpecialtySelect();
        }, 0);
      },
    }
  );

  setupForm(
    "service-request-form",
    `${API_BASE}/services/requests`,
    (formData) => {
      const serviceId = Number(formData.get("service_id"));
      if (!serviceId) {
        throw new Error(getCopy("service_request_missing_service"));
      }
      const session = requireSession("client");
      return {
        service_id: serviceId,
        client_email: session.email?.toLowerCase(),
        description: formData.get("description"),
        urgency: formData.get("urgency") || "normal",
      };
    },
    {
      onSuccess: async () => {
        clearServiceSelection();
        await loadClientRequests();
      },
    }
  );

  try {
    const [countries, specialties] = await Promise.all([
      fetchJson(`${API_BASE}/meta/countries`),
      fetchJson(`${API_BASE}/meta/specialties`),
    ]);
    countriesCache = countries.map((country) => normalizeCountry(country));
    renderCountries(countriesCache);
    specialtiesCache = specialties;
    renderSpecialties(specialtiesCache);
    if (serviceCatalogContainer) {
      loadServiceCatalog(catalogSpecialtySelect?.value || "");
    }
  } catch (error) {
    if (countryList) {
      countryList.innerHTML = `<li class="error">${getCopy("country_error")}: ${error.message}</li>`;
    }
  }

  if (workspaceType === "professional") {
    refreshWalletBalance("professional");
    if (professionalRequestList) {
      loadProfessionalRequests();
    }
  }
  if (workspaceType === "client") {
    refreshWalletBalance("client");
    if (clientRequestList) {
      loadClientRequests();
    }
  }
  if (workspaceType === "admin") {
    refreshWalletBalance("admin");
    if (adminDisputeList) {
      loadAdminDisputes();
    }
  }
};

const bootstrap = () => {
  applyTranslations(currentLanguage);
  setupInteractions();
  ensureWorkspaceAccess();
  init();
};

bootstrap();
