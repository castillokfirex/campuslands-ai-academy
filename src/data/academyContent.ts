export interface MissionPlan {
  id: string;
  title: string;
  phase: string;
  duration: string;
  ctaLabel: string;
  recommendedFor: string;
  idealTeam: string[];
  idealTime: string[];
  idealGoal: string[];
  includes: string[];
  highlightTag: string;
  externalUrl?: string;
}

export interface ToolItem {
  id: string;
  name: string;
  category: "Asistentes" | "Automatización" | "Conocimiento" | "Multimedia";
  orbitRing: 1 | 2;
  shortCode: string;
  tagline: string;
  description: string;
  highlights: [string, string, string];
  samplePrompt: string;
  sampleOutput: string;
}

export interface UseCaseProfile {
  id: string;
  role: string;
  shortLabel: string;
  before: string;
  after: string;
  metricBadge: string;
  santanderContext: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const WHATSAPP_URL =
  "https://wa.me/573052105674?text=" +
  encodeURIComponent(
    "Hola, quiero información de los programas de Campuslands AI Academy"
  );

export const PORTAL_URLS = {
  inscripcion: "https://campuslands.aiacademy.com.co/inscripcion",
  diagnostico: "https://campuslands.aiacademy.com.co/diagnostico",
  certificado: "https://campuslands.aiacademy.com.co/certificado",
  nebula: "https://campuslands.aiacademy.com.co/nebula",
} as const;

export const ALLOWED_PROGRAMS = [
  "Ignition (4 horas)",
  "Booster (8 horas)",
  "Liftoff (12 horas)",
  "Odyssey (Personalizado)",
  "Nebula (Pregrabado)",
] as const;

export type ProgramOption = (typeof ALLOWED_PROGRAMS)[number];

export const HERO_CREW_PROFILES = [
  {
    id: "empresa",
    label: "Empresa o dirección",
    badge: "Misión corporativa",
    pain: "Tu equipo usa herramientas sueltas sin criterio común, y quieres impacto medible en operación, ventas o servicio en Santander.",
    deliverable:
      "Diagnóstico de procesos reales + ruta de formación a la medida con entregables listos desde la primera sesión.",
    suggestedPlan: "Odyssey (Personalizado)",
    suggestedTarget: "Liftoff (12 horas) u Odyssey",
  },
  {
    id: "lider",
    label: "Líder de equipo",
    badge: "Líder de área",
    pain: "Tu equipo repite reportes semanales, correos y actas manuales que consumen horas de trabajo estratégico.",
    deliverable:
      "Asistentes por rol y flujos automáticos conectados (formularios, hojas de cálculo, avisos) sin depender de ejemplos genéricos.",
    suggestedPlan: "Liftoff (12 horas)",
    suggestedTarget: "Booster (8h) o Liftoff (12h)",
  },
  {
    id: "independiente",
    label: "Profesional independiente",
    badge: "Talento individual",
    pain: "Sabes abrir un chat de IA, pero quieres dominarla como sistema diario para cotizar, investigar y entregar más rápido.",
    deliverable:
      "Banco personal de prompts, asistentes configurados con tus documentos y base práctica desde cero.",
    suggestedPlan: "Ignition (4 horas)",
    suggestedTarget: "Ignition (4h) o Nebula (24/7)",
  },
] as const;

export const BENEFITS = [
  {
    id: "practica",
    step: "01",
    title: "Formación práctica",
    description:
      "Sesiones de 4h, 8h y 12h construidas sobre tareas reales de tu empresa o rol, nunca con ejemplos genéricos.",
  },
  {
    id: "entregables",
    step: "02",
    title: "Entregables listos",
    description:
      "Te llevas banco de prompts, guías operativas y agentes base adaptados a tus herramientas desde la primera sesión.",
  },
  {
    id: "soporte",
    step: "03",
    title: "Soporte continuo",
    description:
      "Comunidad privada de WhatsApp y acompañamiento posventa con trainers que construyen automatizaciones todos los días.",
  },
  {
    id: "rutas",
    step: "04",
    title: "Rutas flexibles",
    description:
      "Presencial en Campuslands (Zona Franca Santander), en tu empresa o en modalidad virtual por niveles con resultados medibles.",
  },
] as const;

export const URGENCY_POINTS = [
  {
    title: "La IA ya es estándar operativo",
    description:
      "Las empresas líderes integran IA en procesos diarios; cada semana de espera amplía la brecha competitiva.",
  },
  {
    title: "El costo de esperar se acumula",
    description:
      "Más horas manuales y más retrabajo frente a competidores en Colombia que automatizan desde hoy.",
  },
  {
    title: "Tu talento quiere crear, no repetir",
    description:
      "Los equipos buscan herramientas que liberen tiempo para tareas estratégicas; si no se las das, las buscarán fuera.",
  },
  {
    title: "Efecto compuesto del aprendizaje",
    description:
      "Cada día sin práctica resta valor acumulado en prompts, asistentes y flujos listos para escalar.",
  },
] as const;

export const MISSION_PLANS: MissionPlan[] = [
  {
    id: "ignition",
    title: "Ignition",
    phase: "Fase 01",
    duration: "4 horas",
    ctaLabel: "Solicitar Ignition",
    recommendedFor: "Despegue rápido y adopción inicial sin jerga",
    idealTeam: ["individual", "equipo"],
    idealTime: ["4h"],
    idealGoal: ["asistente"],
    highlightTag: "Punto de partida",
    includes: [
      "Comprende el impacto real de la IA en tu industria",
      "Domina la IA generativa de tu elección como asistente diario",
      "Conoce las 10 herramientas de IA más relevantes",
      "Aprende a crear agentes básicos de IA en vivo",
    ],
  },
  {
    id: "booster",
    title: "Booster",
    phase: "Fase 02",
    duration: "8 horas",
    ctaLabel: "Solicitar Booster",
    recommendedFor: "Equipos y líderes que buscan precisión por rol",
    idealTeam: ["individual", "equipo"],
    idealTime: ["8h"],
    idealGoal: ["agentes"],
    highlightTag: "Más elegido",
    includes: [
      "Todo Ignition con enfoque profesional avanzado",
      "Técnicas de prompting para resultados precisos",
      "Domina 2 herramientas de IA a tu elección",
      "Construye agentes personalizados para tu rol",
    ],
  },
  {
    id: "liftoff",
    title: "Liftoff",
    phase: "Fase 03",
    duration: "12 horas",
    ctaLabel: "Solicitar Liftoff",
    recommendedFor: "Equipos listos para automatizar procesos reales",
    idealTeam: ["equipo", "empresa"],
    idealTime: ["12h"],
    idealGoal: ["automatizar"],
    highlightTag: "Escala operativa",
    includes: [
      "Todo Booster enfocado en escalar tu operación",
      "Domina una herramienta de IA adicional elegida",
      "Aprende a automatizar procesos reales con n8n",
      "Diseña flujos automáticos aplicados a tu negocio",
    ],
  },
  {
    id: "odyssey",
    title: "Odyssey",
    phase: "Expedición",
    duration: "Personalizado",
    ctaLabel: "Solicitar Odyssey",
    recommendedFor: "Empresas con múltiples áreas y objetivos propios",
    idealTeam: ["empresa"],
    idealTime: ["medida"],
    idealGoal: ["corporativo", "automatizar"],
    highlightTag: "A medida",
    includes: [
      "Programa 100 % personalizado para tu empresa",
      "Elige herramientas, duración y profundidad",
      "Casos de uso reales según tu industria y roles",
      "Acompañamiento estratégico con sesiones tácticas",
    ],
  },
  {
    id: "nebula",
    title: "Nebula",
    phase: "Órbita",
    duration: "Pregrabado",
    ctaLabel: "Explorar Nebula",
    recommendedFor: "Aprendizaje autónomo 24/7 con evaluaciones",
    idealTeam: ["individual"],
    idealTime: ["247"],
    idealGoal: ["asistente", "agentes"],
    highlightTag: "Acceso 24/7",
    externalUrl: PORTAL_URLS.nebula,
    includes: [
      "Contenidos organizados por niveles de aprendizaje",
      "Evaluaciones continuas para medir el progreso",
      "Acceso flexible 24/7 a materiales, recursos y actualizaciones",
      "Comunidad activa de soporte y aprendizaje colaborativo",
    ],
  },
];

export const AI_TOOLS: ToolItem[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "Asistentes",
    orbitRing: 1,
    shortCode: "GPT",
    tagline: "Asistente conversacional para ideas y código",
    description:
      "Potencia tu flujo creativo y técnico con respuestas contextualizadas, generación de contenido y soporte operativo.",
    highlights: ["Redacción inteligente", "Desarrollo y depuración", "Flujos personalizados"],
    samplePrompt:
      "Actúa como analista comercial en Bucaramanga. Redacta 3 correos de seguimiento para clientes B2B que pidieron cotización hace 5 días.",
    sampleOutput:
      "Asunto: ¿Seguimos adelante con la propuesta para tu equipo? · Incluye resumen en 3 líneas, caso aplicado y siguiente paso concreto.",
  },
  {
    id: "claude",
    name: "Claude",
    category: "Asistentes",
    orbitRing: 1,
    shortCode: "CLD",
    tagline: "IA colaborativa con atención al detalle",
    description:
      "Diseñada para equipos que requieren precisión, lectura extensa de contratos, auditoría y control en sus procesos.",
    highlights: ["Memoria extendida", "Verificación y control", "Proyectos con contexto"],
    samplePrompt:
      "Compara estas dos políticas internas de compras y enumera 4 riesgos de incumplimiento en una tabla clara para gerencia.",
    sampleOutput:
      "Tabla comparativa con cláusulas críticas, nivel de riesgo (Alto/Medio) y recomendación accionable sin lenguaje técnico innecesario.",
  },
  {
    id: "gemini",
    name: "Gemini",
    category: "Asistentes",
    orbitRing: 1,
    shortCode: "GEM",
    tagline: "Visión multimodal impulsada por Google",
    description:
      "Analiza texto, imágenes, tablas y documentos complejos integrado al ecosistema diario de Google Workspace.",
    highlights: ["Procesamiento multimodal", "Insights a escala", "Google Workspace"],
    samplePrompt:
      "Extrae los ítems, cantidades y fechas de entrega de esta foto de orden de compra y devuélvelos listos para pegar en Sheets.",
    sampleOutput:
      "Tabla estructurada por SKU, cantidad, fecha prometida y alerta automática sobre 2 ítems sin fecha confirmada.",
  },
  {
    id: "copilot-ms",
    name: "Microsoft Copilot",
    category: "Asistentes",
    orbitRing: 2,
    shortCode: "MSP",
    tagline: "Asistencia integrada en Microsoft 365",
    description:
      "Automatiza documentos, tablas en Excel, reportes y presentaciones dentro de tu entorno corporativo Microsoft.",
    highlights: ["Microsoft 365", "Reportes automáticos", "Seguridad empresarial"],
    samplePrompt:
      "Resume los puntos de decisión de esta minuta en Word y crea una estructura de 5 diapositivas ejecutivas.",
    sampleOutput:
      "Borrador ejecutivo de 5 bloques: contexto, hallazgos de ventas, cuellos de botella, presupuesto y responsables.",
  },
  {
    id: "copilot-gh",
    name: "GitHub Copilot",
    category: "Asistentes",
    orbitRing: 2,
    shortCode: "GHC",
    tagline: "Colaborador de código en tiempo real",
    description:
      "Acelera el trabajo de equipos de ingeniería con sugerencias contextuales, pruebas automatizadas y refactorización.",
    highlights: ["Múltiples lenguajes", "Explicaciones de código", "Integraciones IDE"],
    samplePrompt:
      "Genera pruebas unitarias para esta función de cálculo de facturación con casos borde de IVA y descuentos.",
    sampleOutput:
      "Suite completa con 6 casos de prueba deterministas, validación de redondeo y cobertura de entradas vacías.",
  },
  {
    id: "make",
    name: "Make",
    category: "Automatización",
    orbitRing: 1,
    shortCode: "MAK",
    tagline: "Orquestación visual de procesos",
    description:
      "Diseña escenarios avanzados con IA para conectar servicios, transformar datos y escalar operaciones sin fricción.",
    highlights: ["Editor visual", "Conectores amplios", "Monitoreo real"],
    samplePrompt:
      "Cuando llegue un lead de formulario web, clasifica su industria con IA y crea la tarjeta en el tablero comercial.",
    sampleOutput:
      "Escenario de 4 módulos activo en <3 segundos: Webhook → Clasificador IA → Enrutador → CRM + Alerta.",
  },
  {
    id: "zapier",
    name: "Zapier",
    category: "Automatización",
    orbitRing: 2,
    shortCode: "ZAP",
    tagline: "Automatización con inteligencia contextual",
    description:
      "Conecta aplicaciones cotidianas con flujos que comprenden la intención y ejecutan tareas repetitivas sin código.",
    highlights: ["Sin código", "Plantillas inteligentes", "Flujos multietapa"],
    samplePrompt:
      "Cada correo con factura PDF adjunta debe enviarse a Drive, extraer proveedor y valor, y registrarse en contabilidad.",
    sampleOutput:
      "Registro contable automático con enlace al comprobante y notificación al equipo financiero si supera el tope.",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    category: "Conocimiento",
    orbitRing: 1,
    shortCode: "PPX",
    tagline: "Investigación asistida con fuentes",
    description:
      "Obtén respuestas verificables con citas directas, análisis comparativo de mercado y validación de datos.",
    highlights: ["Citas en contexto", "Análisis comparativo", "Búsqueda enfocada"],
    samplePrompt:
      "Compara requisitos tributarios vigentes para exportación de servicios digitales desde Colombia en 2026 con fuentes oficiales.",
    sampleOutput:
      "Resumen verificado con enlaces a normativa DIAN y lista de verificación de 4 puntos para el equipo financiero.",
  },
  {
    id: "notebooklm",
    name: "NotebookLM",
    category: "Conocimiento",
    orbitRing: 1,
    shortCode: "NLM",
    tagline: "Tu asistente basado en tus propios documentos",
    description:
      "Carga manuales, actas y guías internas para consultar exactamente sobre tus fuentes sin inventar datos externos.",
    highlights: ["Fuentes propias", "Resúmenes y guías", "Respuestas citadas"],
    samplePrompt:
      "Con base únicamente en estos 4 manuales operativos de planta, crea una guía de inducción de 10 minutos.",
    sampleOutput:
      "Guía paso a paso con citas exactas a página y sección de cada manual de seguridad y operación.",
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    category: "Conocimiento",
    orbitRing: 2,
    shortCode: "NOT",
    tagline: "Organización y documentación inteligente",
    description:
      "Transforma notas dispersas de proyectos y bases de datos internas en resúmenes claros y tareas asignables.",
    highlights: ["Resúmenes automáticos", "Notas e ideas", "Integración en equipos"],
    samplePrompt:
      "Convierte estas notas de reunión de 40 minutos en tabla de compromisos con responsable y fecha límite.",
    sampleOutput:
      "Base de tareas estructurada con 7 entregables, dueños claros y alertas para el comité del lunes.",
  },
  {
    id: "read-ai",
    name: "Read AI",
    category: "Conocimiento",
    orbitRing: 2,
    shortCode: "RAD",
    tagline: "Resúmenes y análisis de reuniones",
    description:
      "Genera transcripciones, acuerdos y puntos clave automáticos en videollamadas para enfocarte en conversar.",
    highlights: ["Transcripciones automáticas", "Temas clave", "Seguimiento de acuerdos"],
    samplePrompt:
      "Extrae únicamente las objeciones del cliente y los compromisos comerciales de la llamada de hoy.",
    sampleOutput:
      "Minuta accionable de 1 minuto enviada por correo con 3 objeciones resueltas y 2 pendientes para propuesta.",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    category: "Multimedia",
    orbitRing: 2,
    shortCode: "MID",
    tagline: "Diseño conceptual e identidad visual",
    description:
      "Explora conceptos visuales, prototipos de campaña y direcciones artísticas ágiles con prompts estructurados.",
    highlights: ["Alta fidelidad visual", "Dirección de arte", "Iteración rápida"],
    samplePrompt:
      "Concepto de empaque minimalista para café especial de Santander, iluminación de estudio y tonos tierra.",
    sampleOutput:
      "4 variantes de dirección visual listas para presentar al equipo de marca antes de producción física.",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    category: "Multimedia",
    orbitRing: 2,
    shortCode: "11L",
    tagline: "Locución natural y audio multilingüe",
    description:
      "Produce narraciones claras en varios idiomas para tutoriales internos, capacitaciones y piezas informativas.",
    highlights: ["Audio natural", "Multilingüe", "Estabilidad vocal"],
    samplePrompt:
      "Convierte este guion de inducción de seguridad industrial en locución en español neutro colombiano.",
    sampleOutput:
      "Pista de audio limpia de 90 segundos lista para acompañar módulos internos de formación.",
  },
  {
    id: "heygen",
    name: "HeyGen",
    category: "Multimedia",
    orbitRing: 2,
    shortCode: "HEY",
    tagline: "Comunicación y traducción de video",
    description:
      "Adapta cápsulas formativas y comunicados corporativos a distintos idiomas manteniendo claridad de mensaje.",
    highlights: ["Traducción de video", "Cápsulas internas", "Producción ágil"],
    samplePrompt:
      "Adapta este video de bienvenida de 1 minuto para aliados internacionales en inglés manteniendo el tono cercano.",
    sampleOutput:
      "Versión traducida con sincronía labial natural lista para compartir en onboarding global.",
  },
];

export const USE_CASES: UseCaseProfile[] = [
  {
    id: "empresario",
    role: "Empresario / Emprendedor",
    shortLabel: "Empresario",
    before:
      "Procesos comerciales manuales, lanzamientos lentos y decisiones a ciegas por falta de contenido y reportes actualizados.",
    after:
      "Asistentes de IA que crean correos, propuestas y reportes en minutos, con métricas claras para escalar ventas sin fricción.",
    metricBadge: "Hasta 6 h semanales recuperadas en gestión comercial",
    santanderContext: "Ejemplo aplicado a pymes de comercio y servicios en Santander",
  },
  {
    id: "innovacion",
    role: "Director(a) de Innovación",
    shortLabel: "Innovación",
    before:
      "Pilotos desconectados que no escalan y escasa evidencia para justificar inversión ante la dirección.",
    after:
      "Talleres intensivos de 4h con agentes funcionales, casos de uso claros y métricas de eficiencia listas para presentar.",
    metricBadge: "Pilotos medibles desde la primera semana",
    santanderContext: "Alineado a comités directivos y equipos multidisciplinarios",
  },
  {
    id: "independiente",
    role: "Profesional Independiente",
    shortLabel: "Independiente",
    before:
      "Demasiado tiempo en tareas repetitivas, poco foco en vender y mínima diferenciación frente al mercado.",
    after:
      "Prompts estratégicos que generan propuestas, automatizan el seguimiento y entregan resultados personalizados en segundos.",
    metricBadge: "Mayor capacidad de entrega por proyecto",
    santanderContext: "Consultores, diseñadores, abogados y contadores",
  },
  {
    id: "rrhh",
    role: "Líder de RR. HH.",
    shortLabel: "RR. HH.",
    before:
      "Inducción genérica, procesos manuales y nulo acompañamiento adaptado a cada rol.",
    after:
      "Rutas de microaprendizaje con asistentes que guían, responden dudas internas y capturan retroalimentación continua.",
    metricBadge: "Inducción consistente y medible por cargo",
    santanderContext: "Equipos de talento humano en crecimiento",
  },
];

export const REVIEWS = [
  {
    quote:
      "Pasamos de copiar datos entre correos y hojas de cálculo a tener un flujo automático que resume solicitudes cada mañana antes del comité.",
    author: "Equipo de Operaciones · Empresa de logística en Santander",
    mission: "Liftoff · 12 horas",
    badge: "Ejemplo representativo de formación",
  },
  {
    quote:
      "No fue teoría abstracta: salimos de la sesión de 4 horas con asistentes configurados usando nuestras propias plantillas comerciales.",
    author: "Gerencia Comercial · Pyme de servicios en Bucaramanga",
    mission: "Ignition · 4 horas",
    badge: "Ejemplo representativo de formación",
  },
  {
    quote:
      "El equipo de talento humano ahora resuelve dudas de inducción con un asistente entrenado únicamente sobre nuestro reglamento y guías.",
    author: "Dirección de Talento Humano · Sector manufactura",
    mission: "Odyssey · Personalizado",
    badge: "Ejemplo representativo de formación",
  },
] as const;

export const FAQS: FaqItem[] = [
  {
    question: "¿Qué modalidades de formación ofrecen?",
    answer:
      "Ofrecemos formación presencial en nuestras instalaciones de Campuslands, presencial en las instalaciones del cliente y modalidad virtual. Todas las modalidades mantienen la misma calidad y contenido práctico.",
  },
  {
    question: "¿Cómo se eligen las fechas de los cursos?",
    answer:
      "El participante individual puede elegir la fecha que mejor le convenga. Para empresas, coordinamos las fechas por WhatsApp para encontrar el momento ideal para todo el equipo.",
  },
  {
    question: "¿Necesito conocimientos previos en IA?",
    answer:
      "No son obligatorios conocimientos previos. Nuestros programas están diseñados desde el despertar digital hasta niveles avanzados, adaptándose al ritmo de cada participante.",
  },
  {
    question: "¿Qué tipo de certificación recibo?",
    answer:
      "Recibes una certificación oficial por las horas cursadas que valida tu conocimiento práctico en las herramientas de IA trabajadas durante la formación.",
  },
  {
    question: "¿Qué materiales están incluidos?",
    answer:
      "Todos los cursos incluyen un banco de prompts especializado. Los programas de 8h y 12h incluyen además agentes personalizados y automatizaciones acordadas según tus necesidades.",
  },
  {
    question: "¿Cómo funcionan los pagos?",
    answer:
      "Puedes coordinar directamente el pago e inscripción por WhatsApp con nuestro equipo comercial o completar el proceso en el portal oficial de inscripción.",
  },
];
