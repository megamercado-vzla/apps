import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, FileText, RotateCcw } from 'lucide-react';
import {
  computePhaseRecommendation,
  ROADMAP_PHASES,
  validateDiagnosticForm,
  type DiagnosticFormInput,
  type PhaseId,
  type PlatformType,
  type PriorityGoal,
} from '../data/businessPlan';
import { submitLeadToRetia } from '../lib/retiaLeads';

interface ContactConversionSectionProps {
  selectedPhase: PhaseId;
  onPhaseChange: (phase: PhaseId) => void;
  onOpenPlanModal: () => void;
}

interface SubmittedDossier {
  referenceId: string;
  input: DiagnosticFormInput;
  recommendation: ReturnType<typeof computePhaseRecommendation>;
}

const PHASE_TO_DEFAULT_GOAL: Record<PhaseId, PriorityGoal> = {
  'fase-1': 'validar-nicho',
  'fase-2': 'lanzar-marketplace',
  'fase-3': 'integrar-tiendas',
};

const INITIAL_FORM = (phase: PhaseId): DiagnosticFormInput => ({
  fullName: '',
  company: '',
  email: '',
  phone: '',
  sector: '',
  phase,
  currentPlatform: 'ninguna',
  goal: PHASE_TO_DEFAULT_GOAL[phase],
  notes: '',
});

export function ContactConversionSection({
  selectedPhase,
  onPhaseChange,
  onOpenPlanModal,
}: ContactConversionSectionProps) {
  const [form, setForm] = useState<DiagnosticFormInput>(() => INITIAL_FORM(selectedPhase));
  const [errors, setErrors] = useState<Partial<Record<keyof DiagnosticFormInput, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState<SubmittedDossier | null>(null);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      phase: selectedPhase,
      goal: PHASE_TO_DEFAULT_GOAL[selectedPhase],
    }));
  }, [selectedPhase]);

  const liveRecommendation = computePhaseRecommendation(form.currentPlatform, form.goal);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateDiagnosticForm(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const response = await submitLeadToRetia({
        name: form.fullName,
        phone: form.phone,
        email: form.email,
        company: form.company,
        service: `${liveRecommendation.phaseTitle} (${form.goal})`,
        message: [
          `Nicho/Sector: ${form.sector}`,
          `Fase solicitada: ${form.phase}`,
          `Plataforma actual: ${form.currentPlatform}`,
          `Objetivo: ${form.goal}`,
          `Recomendación: ${liveRecommendation.phaseTitle} (${liveRecommendation.estimatedWeeks} sem)`,
          form.notes ? `Notas: ${form.notes}` : '',
        ]
          .filter(Boolean)
          .join(' | '),
        type: 'lead',
        formId: 'megamercado-diagnostico',
        extra: {
          sector: form.sector,
          phase: form.phase,
          currentPlatform: form.currentPlatform,
          goal: form.goal,
        },
      });

      const refNumber =
        response.leadId || `MM-${String(2026)}${String(Math.floor(1000 + Math.random() * 9000))}`;
      setSubmitted({
        referenceId: refNumber,
        input: { ...form },
        recommendation: liveRecommendation,
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Hubo un problema al enviar tu solicitud. Por favor reintenta.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(null);
    setErrors({});
    setSubmitError('');
    setForm(INITIAL_FORM(selectedPhase));
  };

  return (
    <section id="contacto" className="bg-[#080526] py-16 sm:py-24 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#0077D7]/50 bg-[#0B0736] p-6 sm:p-10 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Intro & Live Architecture Recommendation */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2
                  className="font-display font-extrabold tracking-tight text-white leading-tight"
                  style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', textWrap: 'balance' }}
                >
                  Escala tu Nicho con <span className="text-[#00FEAB]">MegaMercado</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                  Agenda una sesión técnica con nuestro equipo de Laboratorios de E-Commerce para evaluar tu
                  catálogo, arquitectura y plan de despliegue en Venezuela.
                </p>
              </div>

              {/* Dynamic Recommendation Preview Box */}
              <div className="rounded-xl bg-[#0F084F] border border-[#0077D7]/35 p-5 space-y-2.5">
                <p className="text-xs font-mono uppercase tracking-wider text-[#14EBD8]">
                  Ruta Sugerida según tu Perfil
                </p>
                <p className="font-display text-lg font-bold text-white">
                  {liveRecommendation.phaseTitle}
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {liveRecommendation.architectureNote}
                </p>
                <p className="pt-1 font-mono text-xs text-[#00FEAB] tabular-nums">
                  Tiempo estimado de implementación: {liveRecommendation.estimatedWeeks} semanas
                </p>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={onOpenPlanModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:text-[#00FEAB] border border-white/25 hover:border-[#00FEAB] rounded-lg transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FEAB]"
                >
                  <FileText className="w-4 h-4" aria-hidden="true" />
                  <span>Ver Resumen del Plan 2026–2028</span>
                </button>
              </div>
            </div>

            {/* Right Validated Diagnostic Form / Confirmation State */}
            <div className="lg:col-span-7">
              {submitted ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="rounded-xl bg-[#080526] border border-[#00FEAB]/50 p-6 sm:p-8 space-y-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-[#00A81C]/20 border border-[#00FEAB]/40 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-[#00FEAB]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-mono text-xs uppercase tracking-wider text-[#00FEAB] tabular-nums">
                        Expediente {submitted.referenceId}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-bold text-white">
                        Solicitud de Diagnóstico Registrada
                      </h3>
                      <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">
                        Gracias, <span className="font-semibold text-white">{submitted.input.fullName}</span>.
                        Nuestro equipo de Arquitectura TI analizará el proyecto de{' '}
                        <span className="font-semibold text-white">{submitted.input.company}</span> para el sector{' '}
                        <span className="font-semibold text-white">{submitted.input.sector}</span>.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10 text-sm">
                    <div className="rounded-lg bg-[#0F084F] p-3.5">
                      <p className="text-xs text-slate-400">Fase Seleccionada</p>
                      <p className="mt-0.5 font-semibold text-white">
                        {ROADMAP_PHASES.find((p) => p.id === submitted.input.phase)?.title}
                      </p>
                    </div>
                    <div className="rounded-lg bg-[#0F084F] p-3.5">
                      <p className="text-xs text-slate-400">Recomendación Automática</p>
                      <p className="mt-0.5 font-semibold text-[#00FEAB]">
                        {submitted.recommendation.phaseTitle}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0077D7] hover:bg-[#0066BA] rounded-lg transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    <span>Enviar otra consulta</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="mm-fullName" className="block text-xs font-semibold text-slate-200 mb-1.5">
                        Nombre completo *
                      </label>
                      <input
                        id="mm-fullName"
                        type="text"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        placeholder="Ej. Andrea Valentina Rojas"
                        aria-invalid={Boolean(errors.fullName)}
                        className="w-full rounded-lg bg-[#080526] border border-white/20 focus:border-[#00FEAB] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-xs text-[#FFCA00]">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="mm-company" className="block text-xs font-semibold text-slate-200 mb-1.5">
                        Empresa o Marca *
                      </label>
                      <input
                        id="mm-company"
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="Ej. Grupo Comercial Caribe"
                        aria-invalid={Boolean(errors.company)}
                        className="w-full rounded-lg bg-[#080526] border border-white/20 focus:border-[#00FEAB] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                      />
                      {errors.company && (
                        <p className="mt-1 text-xs text-[#FFCA00]">{errors.company}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="mm-email" className="block text-xs font-semibold text-slate-200 mb-1.5">
                        Correo corporativo *
                      </label>
                      <input
                        id="mm-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="nombre@empresa.ve"
                        aria-invalid={Boolean(errors.email)}
                        className="w-full rounded-lg bg-[#080526] border border-white/20 focus:border-[#00FEAB] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-[#FFCA00]">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="mm-phone" className="block text-xs font-semibold text-slate-200 mb-1.5">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        id="mm-phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="Ej. +58 412 555 0199"
                        aria-invalid={Boolean(errors.phone)}
                        className="w-full rounded-lg bg-[#080526] border border-white/20 focus:border-[#00FEAB] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-[#FFCA00]">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="mm-sector" className="block text-xs font-semibold text-slate-200 mb-1.5">
                      Nicho o Sector *
                    </label>
                    <input
                      id="mm-sector"
                      type="text"
                      value={form.sector}
                      onChange={(e) => setForm({ ...form, sector: e.target.value })}
                      placeholder="Ej. Salud, Automotriz, Retail"
                      aria-invalid={Boolean(errors.sector)}
                      className="w-full rounded-lg bg-[#080526] border border-white/20 focus:border-[#00FEAB] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                    />
                    {errors.sector && (
                      <p className="mt-1 text-xs text-[#FFCA00]">{errors.sector}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="mm-phase" className="block text-xs font-semibold text-slate-200 mb-1.5">
                        Fase de interés
                      </label>
                      <select
                        id="mm-phase"
                        value={form.phase}
                        onChange={(e) => {
                          const nextPhase = e.target.value as PhaseId;
                          setForm({ ...form, phase: nextPhase });
                          onPhaseChange(nextPhase);
                        }}
                        className="w-full rounded-lg bg-[#080526] border border-white/20 focus:border-[#00FEAB] px-3 py-2.5 text-sm text-white focus:outline-none"
                      >
                        <option value="fase-1">Fase 1 · Lab Base</option>
                        <option value="fase-2">Fase 2 · Marketplace 6s</option>
                        <option value="fase-3">Fase 3 · Interoperabilidad</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="mm-platform" className="block text-xs font-semibold text-slate-200 mb-1.5">
                        Plataforma actual
                      </label>
                      <select
                        id="mm-platform"
                        value={form.currentPlatform}
                        onChange={(e) =>
                          setForm({ ...form, currentPlatform: e.target.value as PlatformType })
                        }
                        className="w-full rounded-lg bg-[#080526] border border-white/20 focus:border-[#00FEAB] px-3 py-2.5 text-sm text-white focus:outline-none"
                      >
                        <option value="ninguna">Sin tienda aún</option>
                        <option value="prestashop">PrestaShop</option>
                        <option value="woocommerce">WooCommerce</option>
                        <option value="magento">Magento</option>
                        <option value="otra">Otra tecnología</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="mm-goal" className="block text-xs font-semibold text-slate-200 mb-1.5">
                        Objetivo prioritario
                      </label>
                      <select
                        id="mm-goal"
                        value={form.goal}
                        onChange={(e) => setForm({ ...form, goal: e.target.value as PriorityGoal })}
                        className="w-full rounded-lg bg-[#080526] border border-white/20 focus:border-[#00FEAB] px-3 py-2.5 text-sm text-white focus:outline-none"
                      >
                        <option value="validar-nicho">Validar en Lab</option>
                        <option value="lanzar-marketplace">Marketplace SaaS</option>
                        <option value="estabilizar-precios">Moneda estable</option>
                        <option value="integrar-tiendas">Integrar por API</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="mm-notes" className="block text-xs font-semibold text-slate-200 mb-1.5">
                      Contexto comercial (opcional)
                    </label>
                    <textarea
                      id="mm-notes"
                      rows={3}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Cuéntanos sobre tu catálogo, volumen de SKU o meta comercial a 12 meses..."
                      className="w-full rounded-lg bg-[#080526] border border-white/20 focus:border-[#00FEAB] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none resize-none"
                    />
                  </div>

                  {submitError && (
                    <p role="alert" className="text-xs text-[#FF5400] font-medium">
                      {submitError}
                    </p>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-xs text-slate-400">
                      Información protegida bajo el Aviso de Confidencialidad de MegaMercado.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 text-sm font-bold text-[#080526] bg-[#00FEAB] hover:bg-[#14EBD8] disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white self-start sm:self-auto"
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
