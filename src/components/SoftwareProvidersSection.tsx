import { useState, type FormEvent } from 'react';
import { CheckCircle2, Code2, Cpu, RotateCcw } from 'lucide-react';
import {
  SOFTWARE_PROVIDER_TIERS,
  validateProviderSubscription,
  type ProviderPlanId,
  type ProviderSubscriptionInput,
  type SoftwareCategory,
} from '../data/businessPlan';
import { submitLeadToRetia } from '../lib/retiaLeads';
import { MegaMercadoIsotipo } from './MegaMercadoLogo';

interface SubmittedProvider {
  partnerId: string;
  input: ProviderSubscriptionInput;
  tierName: string;
}

const INITIAL_PROVIDER_FORM = (planId: ProviderPlanId): ProviderSubscriptionInput => ({
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  category: 'ia-analitica',
  planId,
  websiteOrDocs: '',
});

export function SoftwareProvidersSection() {
  const [selectedPlan, setSelectedPlan] = useState<ProviderPlanId>('marketplace-saas');
  const [form, setForm] = useState<ProviderSubscriptionInput>(() =>
    INITIAL_PROVIDER_FORM('marketplace-saas')
  );
  const [errors, setErrors] = useState<Partial<Record<keyof ProviderSubscriptionInput, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState<SubmittedProvider | null>(null);

  const handleSelectPlan = (planId: ProviderPlanId) => {
    setSelectedPlan(planId);
    setForm((prev) => ({ ...prev, planId }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateProviderSubscription(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSubmitError('');
    setIsSubmitting(true);

    const tierName =
      SOFTWARE_PROVIDER_TIERS.find((t) => t.id === form.planId)?.name ?? 'Proveedor SaaS';

    try {
      const response = await submitLeadToRetia({
        name: form.contactName,
        phone: form.phone,
        email: form.email,
        company: form.companyName,
        service: `${tierName} (${form.category})`,
        message: [
          `Modalidad: ${tierName}`,
          `Categoría: ${form.category}`,
          form.websiteOrDocs ? `Web/Docs: ${form.websiteOrDocs}` : '',
        ]
          .filter(Boolean)
          .join(' | '),
        type: 'provider',
        formId: 'megamercado-proveedores-ti',
        extra: {
          planId: form.planId,
          category: form.category,
          websiteOrDocs: form.websiteOrDocs,
        },
      });

      const partnerId = response.leadId || `MM-TI-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmitted({
        partnerId,
        input: { ...form },
        tierName,
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'No se pudo registrar la suscripción. Por favor reintenta.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(null);
    setErrors({});
    setSubmitError('');
    setForm(INITIAL_PROVIDER_FORM(selectedPlan));
  };

  return (
    <section id="proveedores" className="bg-[#0F084F] py-16 sm:py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with large Isotipo emblem */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <h2
              className="font-display font-extrabold tracking-tight leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', textWrap: 'balance' }}
            >
              Suscripción para <span className="text-[#00FEAB]">Proveedores de Software</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed">
              Integra tus soluciones de IA, pasarelas de pago, ERP o conectores PrestaShop, WooCommerce y
              Magento en los Laboratorios y Marketplaces Verticales de MegaMercado.
            </p>
          </div>
          <div className="hidden lg:flex items-center justify-center shrink-0">
            <MegaMercadoIsotipo size="md" />
          </div>
        </div>

        {/* 3 Selectable Software Partner Modalities */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {SOFTWARE_PROVIDER_TIERS.map((tier) => {
            const isSelected = selectedPlan === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => handleSelectPlan(tier.id)}
                aria-pressed={isSelected}
                className={`text-left rounded-2xl p-6 transition-all duration-150 flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FEAB] ${
                  isSelected
                    ? 'bg-[#080526] border-2 border-[#00FEAB] shadow-[0_12px_32px_rgba(0,254,171,0.12)]'
                    : 'bg-[#080526]/70 border border-white/15 hover:border-[#0077D7]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#14EBD8]">
                      {tier.badgeLabel}
                    </span>
                    <Code2 className="w-5 h-5 text-[#00FEAB] shrink-0" aria-hidden="true" />
                  </div>
                  <h3 className="mt-2 font-display text-xl font-bold text-white">{tier.name}</h3>
                  <p className="mt-0.5 text-xs font-semibold text-slate-300">{tier.subtitle}</p>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">{tier.description}</p>
                </div>

                <ul className="mt-5 pt-4 border-t border-white/10 space-y-2">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-xs text-slate-200">
                      <CheckCircle2
                        className="w-4 h-4 text-[#00FEAB] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* Software Provider Subscription Form */}
        <div className="mt-8 rounded-2xl bg-[#080526] border border-[#0077D7]/45 p-6 sm:p-8 lg:p-10">
          {submitted ? (
            <div
              role="status"
              aria-live="polite"
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#00A81C]/20 border border-[#00FEAB]/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-[#00FEAB]" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-[#00FEAB] tabular-nums">
                    Registro Partner {submitted.partnerId}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-white">
                    Suscripción de Proveedor TI Confirmada
                  </h3>
                  <p className="mt-1 text-sm text-slate-300 leading-relaxed max-w-2xl">
                    Registramos a <span className="font-semibold text-white">{submitted.input.companyName}</span>{' '}
                    en la modalidad <span className="font-semibold text-[#00FEAB]">{submitted.tierName}</span>.
                    Enviaremos credenciales de Sandbox API y documentación técnica a{' '}
                    <span className="font-semibold text-white">{submitted.input.email}</span>.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0077D7] hover:bg-[#0066BA] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Registrar otro proveedor</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-5 h-5 text-[#14EBD8]" aria-hidden="true" />
                  <h3 className="font-display text-lg font-bold text-white">
                    Alta de Proveedor de Software en el Ecosistema
                  </h3>
                </div>
                <p className="text-xs font-mono text-[#00FEAB]">
                  Modalidad:{' '}
                  {SOFTWARE_PROVIDER_TIERS.find((t) => t.id === form.planId)?.name}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="prov-company" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Empresa o Equipo de Software *
                  </label>
                  <input
                    id="prov-company"
                    type="text"
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    placeholder="Ej. NubeTech Soluciones C.A."
                    aria-invalid={Boolean(errors.companyName)}
                    className="w-full rounded-lg bg-[#0F084F]/60 border border-white/20 focus:border-[#00FEAB] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none"
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-xs text-[#FFCA00]">{errors.companyName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="prov-contact" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Responsable Técnico / Comercial *
                  </label>
                  <input
                    id="prov-contact"
                    type="text"
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    placeholder="Ej. Elena Vargas"
                    aria-invalid={Boolean(errors.contactName)}
                    className="w-full rounded-lg bg-[#0F084F]/60 border border-white/20 focus:border-[#00FEAB] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none"
                  />
                  {errors.contactName && (
                    <p className="mt-1 text-xs text-[#FFCA00]">{errors.contactName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="prov-email" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Correo Corporativo *
                  </label>
                  <input
                    id="prov-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="partners@tuempresa.ve"
                    aria-invalid={Boolean(errors.email)}
                    className="w-full rounded-lg bg-[#0F084F]/60 border border-white/20 focus:border-[#00FEAB] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-[#FFCA00]">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="prov-phone" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    id="prov-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Ej. +58 414 555 0144"
                    aria-invalid={Boolean(errors.phone)}
                    className="w-full rounded-lg bg-[#0F084F]/60 border border-white/20 focus:border-[#00FEAB] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-[#FFCA00]">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="prov-category" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Categoría de Software
                  </label>
                  <select
                    id="prov-category"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value as SoftwareCategory })
                    }
                    className="w-full rounded-lg bg-[#0F084F]/60 border border-white/20 focus:border-[#00FEAB] px-3 py-2.5 text-sm text-white focus:outline-none"
                  >
                    <option value="ia-analitica">IA & Analítica Predictiva</option>
                    <option value="conectores-api">Conectores PrestaShop / Woo / Magento</option>
                    <option value="pagos-erp">Pasarelas de Pago & ERP</option>
                    <option value="cloud-seguridad">Cloud MVS & Ciberseguridad</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="prov-plan" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Plan de Suscripción
                  </label>
                  <select
                    id="prov-plan"
                    value={form.planId}
                    onChange={(e) => handleSelectPlan(e.target.value as ProviderPlanId)}
                    className="w-full rounded-lg bg-[#0F084F]/60 border border-white/20 focus:border-[#00FEAB] px-3 py-2.5 text-sm text-white focus:outline-none"
                  >
                    <option value="sandbox-lab">Partner Sandbox & Labs</option>
                    <option value="marketplace-saas">Proveedor Certificado SaaS</option>
                    <option value="enterprise-ecosistema">Aliado Estratégico TI</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="prov-docs" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Sitio Web o Docs API (opcional)
                  </label>
                  <input
                    id="prov-docs"
                    type="url"
                    value={form.websiteOrDocs}
                    onChange={(e) => setForm({ ...form, websiteOrDocs: e.target.value })}
                    placeholder="https://docs.tuempresa.ve"
                    className="w-full rounded-lg bg-[#0F084F]/60 border border-white/20 focus:border-[#00FEAB] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {submitError && (
                <p role="alert" className="text-xs text-[#FF5400] font-medium">
                  {submitError}
                </p>
              )}

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-xs text-slate-400">
                  Integración técnica sobre Google Cloud Services y estándares REST API de MegaMercado.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 text-sm font-bold text-[#080526] bg-[#00FEAB] hover:bg-[#14EBD8] disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white self-start sm:self-auto"
                >
                  {isSubmitting ? 'Enviando...' : 'Suscribirse como Proveedor'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
