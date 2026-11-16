import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { BUYER_PERSONAS, type PhaseId } from '../data/businessPlan';

interface AudienceSectionProps {
  onSelectPersonaPhase: (phase: PhaseId) => void;
}

export function AudienceSection({ onSelectPersonaPhase }: AudienceSectionProps) {
  const [selectedId, setSelectedId] = useState<string>(BUYER_PERSONAS[0].id);
  const activePersona = BUYER_PERSONAS.find((p) => p.id === selectedId) ?? BUYER_PERSONAS[0];

  return (
    <section id="audiencias" className="bg-[#F4F7FC] py-16 sm:py-24 border-y border-slate-200/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2
              className="font-display font-extrabold text-[#080526] tracking-tight"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', textWrap: 'balance' }}
            >
              A Quién <span className="text-[#0077D7]">Servimos</span>
            </h2>
            <p className="mt-2.5 text-base text-slate-600 max-w-2xl leading-relaxed">
              Empresarios, gerentes comerciales, comercios y compradores digitales en Venezuela (25–55 años)
              orientados al crecimiento basado en datos.
            </p>
          </div>
          <p className="text-sm text-slate-500">
            Selecciona un perfil para explorar su solución dedicada
          </p>
        </div>

        {/* 4 Editorial Photo Cards with Measured Bottom Scrims */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BUYER_PERSONAS.map((persona) => {
            const isSelected = persona.id === activePersona.id;
            return (
              <button
                key={persona.id}
                type="button"
                onClick={() => setSelectedId(persona.id)}
                aria-pressed={isSelected}
                className={`group relative aspect-[4/3] rounded-xl overflow-hidden text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077D7] ${
                  isSelected
                    ? 'ring-2 ring-[#0077D7] ring-offset-2 ring-offset-[#F4F7FC] shadow-lg'
                    : 'border border-slate-200 hover:border-[#0077D7]/60'
                }`}
              >
                <img
                  src={persona.image}
                  alt={persona.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(8,5,38,0.08) 0%, rgba(8,5,38,0.45) 55%, rgba(8,5,38,0.92) 100%)',
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-xs font-medium text-[#00FEAB]">{persona.shortLabel}</p>
                  <h3 className="mt-0.5 font-display text-base font-bold text-white leading-snug">
                    {persona.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Persona Detail Strip */}
        <div
          aria-live="polite"
          className="mt-6 bg-white rounded-xl border border-slate-200 p-6 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
        >
          <div className="lg:col-span-4">
            <p className="text-xs font-mono uppercase tracking-wider text-[#0077D7]">
              Perfil Seleccionado · {activePersona.shortLabel}
            </p>
            <h3 className="mt-1 font-display text-xl font-bold text-[#080526]">
              {activePersona.title}
            </h3>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              {activePersona.demographic}
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:border-x lg:border-slate-200 lg:px-6">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Reto que Resolvemos
              </p>
              <p className="mt-1 text-sm text-[#080526] leading-relaxed">
                {activePersona.challenge}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Solución MegaMercado
              </p>
              <p className="mt-1 text-sm text-[#080526] leading-relaxed">
                {activePersona.solution}
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 flex lg:justify-end">
            <button
              type="button"
              onClick={() => onSelectPersonaPhase(activePersona.recommendedPhase)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0F084F] hover:bg-[#0077D7] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077D7]"
            >
              <span>Iniciar con este perfil</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
