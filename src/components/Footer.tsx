import { useState, type FormEvent } from 'react';
import { MapPin, Mail, ShieldAlert } from 'lucide-react';
import { isValidEmail } from '../data/businessPlan';
import { submitLeadToRetia } from '../lib/retiaLeads';
import { MegaMercadoIsotipo } from './MegaMercadoLogo';

interface FooterProps {
  onOpenPlanModal: () => void;
}

export function Footer({ onOpenPlanModal }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterError, setNewsletterError] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleNewsletter = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidEmail(newsletterEmail)) {
      setNewsletterError('Ingresa un correo electrónico válido.');
      setNewsletterSuccess(false);
      return;
    }

    setNewsletterError('');
    setNewsletterSuccess(false);
    setNewsletterSubmitting(true);

    try {
      const emailClean = newsletterEmail.trim();
      const alias = emailClean.split('@')[0] || 'Suscriptor';
      await submitLeadToRetia({
        name: `Newsletter: ${alias}`,
        phone: 'Newsletter (Solo Email)',
        email: emailClean,
        service: 'Boletín de Nichos y Labs',
        message: 'Suscripción desde el footer de MegaMercado.',
        type: 'newsletter',
        formId: 'megamercado-newsletter',
      });
      setNewsletterSuccess(true);
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterError(
        err instanceof Error
          ? err.message
          : 'No se pudo registrar la suscripción. Por favor reintenta.'
      );
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#05031A] text-slate-300 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Column 1: Brand & Governance */}
          <div className="md:col-span-4 space-y-4">
            <a href="#inicio" aria-label="Volver arriba MegaMercado" className="inline-block">
              <MegaMercadoIsotipo size="md" />
            </a>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Ecosistema de Learning con IA, Laboratorios de E-Commerce y Soluciones TI para Nichos
              Emergentes en Venezuela.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <button
                type="button"
                onClick={onOpenPlanModal}
                className="text-[#FFCA00] hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCA00] rounded"
              >
                Aviso de Confidencialidad
              </button>
              <a href="#hoja-de-ruta" className="text-slate-400 hover:text-white transition-colors">
                Plan 2026–2028
              </a>
            </div>
          </div>

          {/* Column 2: Contact Details */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="font-display text-base font-bold text-white">
              Contacto Corporativo
            </h3>
            <div className="flex items-start gap-2.5 text-sm text-slate-300">
              <MapPin className="w-4 h-4 text-[#0077D7] shrink-0 mt-1" aria-hidden="true" />
              <span>Caracas, Venezuela · Operación Nacional 24/7 sobre Google Cloud Services</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-300">
              <Mail className="w-4 h-4 text-[#0077D7] shrink-0" aria-hidden="true" />
              <a href="#contacto" className="hover:text-[#00FEAB] transition-colors">
                alianzas@megamercado.ve
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400 pt-1">
              <ShieldAlert className="w-4 h-4 text-[#FFCA00] shrink-0" aria-hidden="true" />
              <span>Documento Corporativo Confidencial · Dirección MegaMercado</span>
            </div>
          </div>

          {/* Column 3: Newsletter Signup (with Warm Gold CTA matching palette & bbbaihub rhythm) */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="font-display text-base font-bold text-white">
              Boletín de Nichos y Labs
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Recibe reportes de validación de mercado y apertura de nuevos Marketplaces verticales.
            </p>
            <form onSubmit={handleNewsletter} noValidate className="flex flex-col sm:flex-row gap-2">
              <label htmlFor="mm-newsletter" className="sr-only">
                Correo electrónico para boletín
              </label>
              <input
                id="mm-newsletter"
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="correo@empresa.ve"
                className="flex-1 min-w-0 rounded-lg bg-[#0B0736] border border-white/15 focus:border-[#FFCA00] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={newsletterSubmitting}
                className="px-4 py-2 text-sm font-bold text-[#080526] bg-[#FFCA00] hover:bg-[#FFD633] disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {newsletterSubmitting ? 'Enviando...' : 'Suscribirme'}
              </button>
            </form>
            {newsletterError && (
              <p className="text-xs text-[#FF5400] font-medium">{newsletterError}</p>
            )}
            {newsletterSuccess && (
              <p role="status" className="text-xs text-[#00FEAB] font-medium">
                Suscripción registrada correctamente.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="bg-[#0F084F] py-4 px-4 text-center text-xs text-slate-300">
        © 2026 MegaMercado · Todos los derechos reservados · Plan de Negocios Corporativo 2026–2028
      </div>
    </footer>
  );
}
