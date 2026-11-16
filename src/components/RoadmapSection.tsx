import { Compass, Rocket, Network, CheckCircle2, Layers, Cpu, Shield } from 'lucide-react';
import { ROADMAP_PHASES, type PhaseId } from '../data/businessPlan';

interface RoadmapSectionProps {
  selectedPhase: PhaseId;
  onSelectPhase: (phase: PhaseId) => void;
}

function PhaseEmblem({ phaseId, accentHex }: { phaseId: PhaseId; accentHex: string }) {
  const iconCls = 'w-6 h-6 text-white';
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: accentHex }}
    >
      {phaseId === 'fase-1' && <Compass className={iconCls} aria-hidden="true" />}
      {phaseId === 'fase-2' && <Rocket className={iconCls} aria-hidden="true" />}
      {phaseId === 'fase-3' && <Network className={iconCls} aria-hidden="true" />}
    </div>
  );
}

export function RoadmapSection({ selectedPhase, onSelectPhase }: RoadmapSectionProps) {
  return (
    <section id="hoja-de-ruta" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Centered Header matching bbbaihub.org Pathway section */}
        <div className="text-center max-w-2xl mx-auto">
          <h2
            className="font-display font-extrabold text-[#080526] tracking-tight"
            style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.65rem)', textWrap: 'balance' }}
          >
            Rutas de Learning IA y <span className="text-[#0077D7]">Despliegue 2026–2028</span>
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Elige tu punto de partida según tu nivel de adopción de IA y madurez digital: desde talleres en
            nuestros Labs hasta Marketplaces verticales en ciclos de 6 semanas.
          </p>
        </div>

        {/* 3 Structured Phase Cards */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-7 items-stretch">
          {ROADMAP_PHASES.map((phase) => {
            const isActive = selectedPhase === phase.id;
            return (
              <article
                key={phase.id}
                className={`flex flex-col justify-between rounded-2xl bg-white border transition-colors duration-150 overflow-hidden ${
                  isActive
                    ? 'border-[#0077D7] shadow-[0_12px_32px_rgba(0,119,215,0.12)]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-6 sm:p-7 flex-1 flex flex-col">
                  {/* Card Header */}
                  <div className="flex items-start gap-4 min-h-[5.25rem]">
                    <PhaseEmblem phaseId={phase.id} accentHex={phase.accentHex} />
                    <div className="min-w-0">
                      <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#0077D7]">
                        {phase.code}
                      </p>
                      <h3 className="mt-0.5 font-display text-xl font-extrabold text-[#080526] leading-snug">
                        {phase.title}
                      </h3>
                      <p className="text-sm font-semibold text-slate-700">{phase.tagline}</p>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="mt-4 text-sm text-slate-600 leading-relaxed min-h-[4.5rem]">
                    {phase.summary}
                  </p>

                  {/* Specifications */}
                  <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5 text-sm">
                    <div className="flex items-start gap-2.5">
                      <Layers className="w-4 h-4 text-[#0077D7] shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="text-slate-700">
                        <span className="font-semibold text-[#080526]">Ideal para: </span>
                        {phase.bestFor}
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Cpu className="w-4 h-4 text-[#0077D7] shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="text-slate-700">
                        <span className="font-semibold text-[#080526]">Stack: </span>
                        {phase.stack}
                      </p>
                    </div>
                  </div>

                  {/* 2x2 Deliverables Grid */}
                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                      Capacidades incluidas
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {phase.deliverables.map((item) => (
                        <div
                          key={item}
                          className="rounded-lg bg-[#F4F7FC] border border-slate-200/80 px-3 py-2.5 min-h-[3.25rem] flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#0077D7] shrink-0" aria-hidden="true" />
                          <span className="text-xs font-semibold text-[#080526] leading-tight">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Deep Indigo Summary + Action */}
                <div className="bg-[#0F084F] px-6 py-5 text-white">
                  <div className="flex items-start gap-3 min-h-[2.75rem]">
                    <Shield className="w-4 h-4 text-[#00FEAB] shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {phase.footerOutcome}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectPhase(phase.id)}
                    className={`mt-4 w-full py-2.5 px-4 text-sm font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                      isActive
                        ? 'text-[#080526] bg-[#00FEAB] hover:bg-[#14EBD8]'
                        : 'text-white bg-[#0077D7] hover:bg-[#0066BA]'
                    }`}
                  >
                    {phase.ctaLabel}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
