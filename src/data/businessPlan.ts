export type PhaseId = 'fase-1' | 'fase-2' | 'fase-3';
export type PlatformType = 'ninguna' | 'prestashop' | 'woocommerce' | 'magento' | 'otra';
export type PriorityGoal = 'validar-nicho' | 'lanzar-marketplace' | 'estabilizar-precios' | 'integrar-tiendas';
export type SoftwareCategory = 'ia-analitica' | 'conectores-api' | 'pagos-erp' | 'cloud-seguridad';
export type ProviderPlanId = 'sandbox-lab' | 'marketplace-saas' | 'enterprise-ecosistema';

export interface HeroPillar {
  id: string;
  title: string;
  description: string;
  iconKey: 'lab' | 'marketplace' | 'currency' | 'cloud';
}

export interface LabSolution {
  index: string;
  title: string;
  description: string;
  iconKey: 'funnel' | 'shield' | 'traffic' | 'analytics' | 'cloud';
}

export interface BuyerPersona {
  id: string;
  title: string;
  shortLabel: string;
  image: string;
  imageAlt: string;
  demographic: string;
  challenge: string;
  solution: string;
  recommendedPhase: PhaseId;
}

export interface RoadmapPhase {
  id: PhaseId;
  code: string;
  title: string;
  tagline: string;
  summary: string;
  bestFor: string;
  stack: string;
  deliverables: [string, string, string, string];
  footerOutcome: string;
  accentHex: string;
  badgeTextColor: string;
  ctaLabel: string;
}

export interface CoreValue {
  id: string;
  title: string;
  description: string;
  iconKey: 'professionalism' | 'innovation' | 'productivity' | 'dedication';
}

export interface SoftwareProviderTier {
  id: ProviderPlanId;
  name: string;
  subtitle: string;
  description: string;
  benefits: string[];
  badgeLabel: string;
}

export interface ProviderSubscriptionInput {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  category: SoftwareCategory;
  planId: ProviderPlanId;
  websiteOrDocs: string;
}

export interface ProviderValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof ProviderSubscriptionInput, string>>;
}

export interface DiagnosticFormInput {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  sector: string;
  phase: PhaseId;
  currentPlatform: PlatformType;
  goal: PriorityGoal;
  notes: string;
}

export interface DiagnosticValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof DiagnosticFormInput, string>>;
}

export interface DiagnosticRecommendation {
  recommendedPhase: PhaseId;
  phaseTitle: string;
  estimatedWeeks: number;
  architectureNote: string;
}

export const HERO_PILLARS: HeroPillar[] = [
  {
    id: 'learning-ia',
    title: 'Learning con IA',
    description: 'Formación práctica en Inteligencia Artificial aplicada a ventas, catálogos y conversión.',
    iconKey: 'lab',
  },
  {
    id: 'marketplaces',
    title: 'E-Commerce Labs',
    description: 'Entornos de experimentación rápida para validar embudos y modelos en 6 semanas.',
    iconKey: 'marketplace',
  },
  {
    id: 'currency',
    title: 'Automatización IA',
    description: 'Inventarios inteligentes y precios en monedas estables ante la volatilidad.',
    iconKey: 'currency',
  },
  {
    id: 'cloud',
    title: 'Google Cloud 24/7',
    description: 'Arquitectura PrestaShop Multitienda, MySQL y APIs abiertas sobre servidores MVS.',
    iconKey: 'cloud',
  },
];

export const LAB_SOLUTIONS: LabSolution[] = [
  {
    index: '1',
    title: 'Comprende la IA Comercial',
    description:
      'Capacitamos a líderes y equipos para aplicar Inteligencia Artificial en analítica de embudos, optimización de precios y automatización operativa.',
    iconKey: 'funnel',
  },
  {
    index: '2',
    title: 'Experimenta en Casos Reales',
    description:
      'Validamos prompts comerciales, copys de catálogo, UX y campañas de conversión dentro de nuestros Laboratorios de E-Commerce antes de escalar.',
    iconKey: 'analytics',
  },
  {
    index: '3',
    title: 'Automatiza Inventarios y Moneda',
    description:
      'Modelos inteligentes de actualización de precios referenciados en monedas estables que protegen a los comercios locales.',
    iconKey: 'shield',
  },
  {
    index: '4',
    title: 'Escala con Tráfico Compartido',
    description:
      'Agrupación estratégica en Marketplaces verticales que reducen costos de adquisición para nichos emergentes en Venezuela.',
    iconKey: 'traffic',
  },
  {
    index: '5',
    title: 'Evalúa Resultados con Analítica IA',
    description:
      'Tableros unificados, SEO técnico y modelos predictivos sobre PrestaShop, WooCommerce y Magento con soporte 24/7.',
    iconKey: 'cloud',
  },
];

export const BUYER_PERSONAS: BuyerPersona[] = [
  {
    id: 'nichos',
    title: 'Marcas en Nichos Emergentes',
    shortLabel: 'Fundadores y Líderes',
    image: '/src/assets/images/audience_emerging_brands_1794851330764.jpg',
    imageAlt: 'Fundadora de marca emergente revisando métricas digitales con herramientas de IA',
    demographic: 'Fundadores de marcas de alto potencial (25–55 años) en Venezuela.',
    challenge: 'Curva de aprendizaje en IA comercial e incertidumbre al validar canales digitales.',
    solution: 'Entrenamiento práctico en E-Commerce Labs y despliegue rápido en Marketplace vertical.',
    recommendedPhase: 'fase-1',
  },
  {
    id: 'pymes',
    title: 'PyMEs y Dirección Comercial',
    shortLabel: 'Gerencia General',
    image: '/src/assets/images/audience_pyme_directors_1794851332709.jpg',
    imageAlt: 'Directores comerciales analizando analítica predictiva e indicadores omnicanal',
    demographic: 'Gerentes Generales y Directores Comerciales en retail, distribución y servicios.',
    challenge: 'Brecha técnica para adoptar automatización con IA y altos costos de infraestructura TI.',
    solution: 'Rutas de formación ejecutiva + plataforma SaaS llave en mano sobre Google Cloud.',
    recommendedPhase: 'fase-2',
  },
  {
    id: 'comercios',
    title: 'Minoristas y Mayoristas',
    shortLabel: 'Comercios e Inventarios',
    image: '/src/assets/images/audience_retail_wholesale_1794851329366.jpg',
    imageAlt: 'Centro de distribución moderno con terminal de inventario inteligente',
    demographic: 'Comercios minoristas y distribuidores mayoristas con alta rotación de SKU.',
    challenge: 'Fricción constante al reajustar catálogos y precios frente a variaciones cambiarias.',
    solution: 'Automatización de precios en monedas estables e integración inteligente por API.',
    recommendedPhase: 'fase-3',
  },
  {
    id: 'compradores',
    title: 'Equipos y Compradores 24/7',
    shortLabel: 'Adopción Digital',
    image: '/src/assets/images/audience_digital_buyers_1794851332539.jpg',
    imageAlt: 'Usuario explorando un marketplace especializado asistido por búsqueda inteligente',
    demographic: 'Equipos operativos en formación continua y compradores digitales especializados.',
    challenge: 'Falta de dominio práctico en herramientas digitales y oferta segmentada poco transparente.',
    solution: 'Experiencias de compra 24/7 transparentes impulsadas por equipos capacitados en IA.',
    recommendedPhase: 'fase-2',
  },
];

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: 'fase-1',
    code: 'NIVEL 1 · FASE 1',
    title: 'Fundamentos IA y Lab Base',
    tagline: 'Aprende, experimenta y valida.',
    summary:
      'Capacitación inicial en herramientas de IA comercial y despliegue de entornos de prueba PrestaShop Multitienda en Google Cloud.',
    bestFor: 'Equipos y marcas en etapa de validación',
    stack: 'Labs IA + PrestaShop Multitienda + GCS',
    deliverables: [
      'Taller IA Aplicada',
      'Entorno Lab UX',
      'Catálogo Estable',
      'Embudos Validados',
    ],
    footerOutcome: 'Construye criterio en IA y valida tu modelo comercial con riesgo mínimo antes de invertir.',
    accentHex: '#0077D7',
    badgeTextColor: '#FFFFFF',
    ctaLabel: 'Solicitar Nivel 1',
  },
  {
    id: 'fase-2',
    code: 'NIVEL 2 · FASE 2',
    title: 'Aplicación en Marketplace',
    tagline: 'Ciclo de 6 semanas.',
    summary:
      'Aplicación de flujos automatizados con IA en la aplicación central del Marketplace vertical, integrando API PrestaShop y pasarelas de pago.',
    bestFor: 'Comercios listos para escalar bajo SaaS',
    stack: 'Flujos IA + API PrestaShop + Pasarelas',
    deliverables: [
      'App Central SaaS',
      'Automatización IA',
      'Pasarelas de Pago',
      'Tráfico Compartido',
    ],
    footerOutcome: 'Aplica IA a la operación real y lanza un Marketplace especializado en 6 semanas.',
    accentHex: '#00A81C',
    badgeTextColor: '#FFFFFF',
    ctaLabel: 'Solicitar Nivel 2',
  },
  {
    id: 'fase-3',
    code: 'NIVEL 3 · FASE 3',
    title: 'Innovación e Interoperabilidad',
    tagline: 'Analítica predictiva y APIs.',
    summary:
      'Integración de comercios externos (Magento, WooCommerce, PrestaShop) junto a agentes de analítica predictiva y gobierno de datos.',
    bestFor: 'Empresas con tiendas activas y alto volumen',
    stack: 'BI Predictivo + Conectores Multi-CMS',
    deliverables: [
      'Puente WooCommerce',
      'Conector Magento',
      'Analítica Predictiva',
      'Control Gerencial',
    ],
    footerOutcome: 'Lidera tu nicho con interoperabilidad total y toma de decisiones predictiva.',
    accentHex: '#00049E',
    badgeTextColor: '#FFFFFF',
    ctaLabel: 'Solicitar Nivel 3',
  },
];

export const CORE_VALUES: CoreValue[] = [
  {
    id: 'profesionalismo',
    title: 'Profesionalismo',
    description: 'Método regido por normas claras de respeto, objetividad y eficacia operativa en cada proyecto.',
    iconKey: 'professionalism',
  },
  {
    id: 'innovacion',
    title: 'Innovación y Aprendizaje IA',
    description: 'Acompañamiento integral mediante laboratorios digitales y formación continua en Inteligencia Artificial.',
    iconKey: 'innovation',
  },
  {
    id: 'productividad',
    title: 'Productividad',
    description: 'Tiempos de rotación precisos y automatización TI para maximizar el rendimiento de socios y clientes.',
    iconKey: 'productivity',
  },
  {
    id: 'dedicacion',
    title: 'Dedicación',
    description: 'Atención rigurosa a los detalles, pruebas constantes y validación sostenida de cada implementación.',
    iconKey: 'dedication',
  },
];

export const SOFTWARE_PROVIDER_TIERS: SoftwareProviderTier[] = [
  {
    id: 'sandbox-lab',
    name: 'Partner Sandbox & Labs',
    subtitle: 'Validación técnica de módulos y APIs',
    description:
      'Ideal para desarrolladores y casas de software que desean probar integraciones, plugins o asistentes de IA en entornos reales de nuestros E-Commerce Labs.',
    benefits: ['Acceso a Sandbox PrestaShop Multitienda', 'Pruebas de carga en Google Cloud MVS', 'Feedback de conversión con comercios reales'],
    badgeLabel: 'Incorporación Ágil',
  },
  {
    id: 'marketplace-saas',
    name: 'Proveedor Certificado SaaS',
    subtitle: 'Distribución nativa en Marketplaces Verticales',
    description:
      'Para proveedores de pasarelas de pago, ERP, automatización de precios en moneda estable y soluciones de IA listas para operar con comercios aliados.',
    benefits: ['Despliegue en ciclos verticales de 6 semanas', 'Documentación REST API unificada', 'Visibilidad directa ante PyMEs y marcas'],
    badgeLabel: 'Mayor Adopción',
  },
  {
    id: 'enterprise-ecosistema',
    name: 'Aliado Estratégico TI',
    subtitle: 'Interoperabilidad Multi-CMS e IA Predictiva',
    description:
      'Diseñado para plataformas tecnológicas empresariales que aportan conectores WooCommerce/Magento, analítica predictiva o infraestructura hardware/software.',
    benefits: ['Co-creación de soluciones para nichos', 'Integración de telemetría y BI compartido', 'Soporte conjunto 24/7 con Ingeniería MegaMercado'],
    badgeLabel: 'Escala Corporativa',
  },
];

export const CORPORATE_PILLARS = {
  mision:
    'Desarrollar un ecosistema de comercio electrónico y aprendizaje práctico con IA de alto impacto en Venezuela, operando Laboratorios de E-Commerce y soluciones integrales de TI para automatizar procesos, reducir costos operativos y escalar negocios en nichos emergentes.',
  vision:
    'Consolidarnos como el ecosistema tecnológico y centro de aprendizaje e innovación digital líder en Venezuela, siendo el aliado indispensable para que empresas, comercios y proveedores de software validen modelos, adopten IA responsablemente y lideren sus mercados.',
  antecedentes:
    'MegaMercado nace frente a la necesidad de digitalización del complejo mercado venezolano. Al identificar las brechas técnicas, formativas y cambiarias locales, diseñamos Laboratorios de Comercio Electrónico con IA sobre Google Cloud Services para validar modelos ágiles 24/7.',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 16;
}

export function validateDiagnosticForm(input: DiagnosticFormInput): DiagnosticValidationResult {
  const errors: Partial<Record<keyof DiagnosticFormInput, string>> = {};

  if (!input.fullName.trim() || input.fullName.trim().length < 2) {
    errors.fullName = 'Ingresa tu nombre y apellido completo.';
  }

  if (!input.company.trim() || input.company.trim().length < 2) {
    errors.company = 'Indica el nombre de tu empresa o marca.';
  }

  if (!input.email.trim()) {
    errors.email = 'El correo corporativo es obligatorio.';
  } else if (!isValidEmail(input.email)) {
    errors.email = 'Ingresa un formato de correo electrónico válido.';
  }

  if (!input.phone.trim()) {
    errors.phone = 'El teléfono o WhatsApp es obligatorio.';
  } else if (!isValidPhone(input.phone)) {
    errors.phone = 'Ingresa un número de teléfono o WhatsApp válido.';
  }

  if (!input.sector.trim() || input.sector.trim().length < 2) {
    errors.sector = 'Especifica el nicho o sector comercial.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateProviderSubscription(
  input: ProviderSubscriptionInput
): ProviderValidationResult {
  const errors: Partial<Record<keyof ProviderSubscriptionInput, string>> = {};

  if (!input.companyName.trim() || input.companyName.trim().length < 2) {
    errors.companyName = 'Indica el nombre de la empresa o equipo de software.';
  }

  if (!input.contactName.trim() || input.contactName.trim().length < 2) {
    errors.contactName = 'Ingresa el nombre del responsable técnico o comercial.';
  }

  if (!input.email.trim()) {
    errors.email = 'El correo corporativo es obligatorio.';
  } else if (!isValidEmail(input.email)) {
    errors.email = 'Ingresa un correo electrónico válido.';
  }

  if (!input.phone.trim()) {
    errors.phone = 'El teléfono o WhatsApp es obligatorio.';
  } else if (!isValidPhone(input.phone)) {
    errors.phone = 'Ingresa un número de teléfono o WhatsApp válido.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function computePhaseRecommendation(
  platform: PlatformType,
  goal: PriorityGoal
): DiagnosticRecommendation {
  if (platform === 'woocommerce' || platform === 'magento' || goal === 'integrar-tiendas') {
    return {
      recommendedPhase: 'fase-3',
      phaseTitle: 'Nivel 3 · Fase 3 — Innovación e Interoperabilidad',
      estimatedWeeks: 8,
      architectureNote:
        'Conexión vía API de tu catálogo existente (WooCommerce/Magento/PrestaShop) al Marketplace central con analítica predictiva con IA.',
    };
  }

  if (goal === 'lanzar-marketplace' || platform === 'prestashop') {
    return {
      recommendedPhase: 'fase-2',
      phaseTitle: 'Nivel 2 · Fase 2 — Aplicación en Marketplace',
      estimatedWeeks: 6,
      architectureNote:
        'Despliegue de aplicación central SaaS en ciclo de 6 semanas con flujos automatizados de IA, API PrestaShop y pasarelas de pago.',
    };
  }

  return {
    recommendedPhase: 'fase-1',
    phaseTitle: 'Nivel 1 · Fase 1 — Fundamentos IA y Lab Base',
    estimatedWeeks: 3,
    architectureNote:
      'Capacitación práctica en IA comercial y entorno Lab sobre Google Cloud y PrestaShop Multitienda con precios en moneda estable.',
  };
}
