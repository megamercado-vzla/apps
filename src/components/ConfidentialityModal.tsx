import { useEffect } from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { MegaMercadoIsotipo } from './MegaMercadoLogo';

interface ConfidentialityModalProps {
  open: boolean;
  onClose: () => void;
}

export function ConfidentialityModal({ open, onClose }: ConfidentialityModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080526]/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white text-[#080526] rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="space-y-2">
            <MegaMercadoIsotipo size="sm" />
            <h2 id="mm-modal-title" className="font-display text-xl sm:text-2xl font-extrabold text-[#080526]">
              Plan de Negocios Corporativo 2026–2028
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar resumen ejecutivo"
            className="w-10 h-10 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-sm text-slate-700 leading-relaxed">
          <div className="rounded-xl bg-[#FFF8E1] border border-[#FFCA00]/60 p-4 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#FF5400] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-display font-bold text-[#080526]">Aviso de Confidencialidad</p>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-700">
                Este documento contiene información comercial, tecnológica y operativa confidencial de MegaMercado.
                Queda prohibida su reproducción, distribución o divulgación total o parcial sin autorización expresa
                de la Dirección.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-display text-base font-bold text-[#080526]">
              Objetivo General de Negocio (12 Meses)
            </h3>
            <p className="mt-1">
              Posicionar a MegaMercado como el ecosistema de comercio electrónico, Laboratorio de E-Commerce y
              proveedor de soluciones TI de referencia en Venezuela, ejecutando exitosamente la validación y
              lanzamiento de sus primeros Marketplaces verticales para nichos emergentes (ciclos de desarrollo de
              6 semanas por plataforma), logrando afiliación sostenida de empresas aliadas e incremento medible
              del volumen transaccional y generación de leads.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl bg-[#F4F7FC] border border-slate-200 p-4">
              <p className="font-semibold text-[#080526]">Infraestructura Core</p>
              <p className="mt-1 text-xs text-slate-600">
                PrestaShop Multitienda, MySQL, APIs de integración y servidores MVS en Google Cloud Services bajo
                modelo SaaS.
              </p>
            </div>
            <div className="rounded-xl bg-[#F4F7FC] border border-slate-200 p-4">
              <p className="font-semibold text-[#080526]">Adaptabilidad Financiera</p>
              <p className="mt-1 text-xs text-slate-600">
                Gestión inteligente de inventarios y actualización automatizada de precios referenciados en monedas
                estables.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0F084F] hover:bg-[#0077D7] rounded-lg transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
