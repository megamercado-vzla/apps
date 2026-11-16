import { useState } from 'react';
import { Award, Lightbulb, Zap, Target } from 'lucide-react';
import { CORE_VALUES, CORPORATE_PILLARS, type CoreValue } from '../data/businessPlan';
import { MegaMercadoIsotipo } from './MegaMercadoLogo';

type IdentityTab = 'mision' | 'vision' | 'antecedentes';

function ValueIcon({ iconKey }: { iconKey: CoreValue['iconKey'] }) {
  const cls = 'w-6 h-6 text-[#0077D7]';
  switch (iconKey) {
    case 'professionalism':
      return <Award className={cls} aria-hidden="true" />;
    case 'innovation':
      return <Lightbulb className={cls} aria-hidden="true" />;
    case 'productivity':
      return <Zap className={cls} aria-hidden="true" />;
    case 'dedication':
      return <Target className={cls} aria-hidden="true" />;
  }
}

export function IdentityValuesSection() {
  const [activeTab, setActiveTab] = useState<IdentityTab>('mision');

  const tabItems: { id: IdentityTab; label: string }[] = [
    { id: 'mision', label: 'Misión' },
    { id: 'vision', label: 'Visión' },
    { id: 'antecedentes', label: 'Origen' },
  ];

  return (
    <section id="identidad" className="bg-[#F4F7FC] py-16 sm:py-24 border-t border-slate-200/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Corporate Identity, Logo Showcase, Interactive Tabs & 12-Month Goal */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2
                className="font-display font-extrabold text-[#080526] tracking-tight leading-tight"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', textWrap: 'balance' }}
              >
                Identidad <span className="text-[#0077D7]">MegaMercado</span>
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Tecnológica, experimental, ágil y orientada a resultados comerciales en Venezuela.
              </p>
            </div>

            {/* Official Large Isotipo Presentation Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center text-center">
              <MegaMercadoIsotipo size="xl" />
              <div className="mt-5 pt-4 border-t border-slate-100 w-full flex items-center justify-center gap-3 text-xs text-slate-500">
                <span>Plan Corporativo 2026–2028</span>
                <span aria-hidden="true">·</span>
                <span>Learning con IA</span>
                <span aria-hidden="true">·</span>
                <span>Ecosistema SaaS TI</span>
              </div>
            </div>

            {/* Mission / Vision / Background Segmented Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
              <div
                role="tablist"
                aria-label="Pilares institucionales de MegaMercado"
                className="inline-flex items-center gap-1 p-1 bg-[#F4F7FC] rounded-lg border border-slate-200/70"
              >
                {tabItems.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      type="button"
                      aria-selected={isActive}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077D7] ${
                        isActive
                          ? 'bg-white text-[#080526] shadow-sm'
                          : 'text-slate-600 hover:text-[#080526]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 text-sm sm:text-base text-slate-700 leading-relaxed">
                {CORPORATE_PILLARS[activeTab]}
              </p>
            </div>

            {/* 12-Month Objective Strip */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="font-mono text-xl sm:text-2xl font-bold text-[#0077D7] tabular-nums">
                  6 sem.
                </p>
                <p className="mt-1 text-xs text-slate-600 leading-snug">
                  Ciclo por Marketplace vertical
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="font-mono text-xl sm:text-2xl font-bold text-[#080526] tabular-nums">
                  12 m.
                </p>
                <p className="mt-1 text-xs text-slate-600 leading-snug">
                  Meta de consolidación y leads
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="font-mono text-xl sm:text-2xl font-bold text-[#00A81C] tabular-nums">
                  24/7
                </p>
                <p className="mt-1 text-xs text-slate-600 leading-snug">
                  Operación continua Cloud
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Cobalt Banner + 4 Foundational Values (matching bbbaihub.org rhythm) */}
          <div className="lg:col-span-7">
            <div className="bg-[#0077D7] text-white rounded-xl px-6 py-4 font-display font-semibold text-base sm:text-lg leading-snug">
              Diseñado para transformar la complejidad operativa en crecimiento digital medible y sostenible.
            </div>

            <div className="mt-5 divide-y divide-slate-200 bg-white rounded-2xl border border-slate-200">
              {CORE_VALUES.map((val) => (
                <div key={val.id} className="p-6 flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[#EFF5FF] border border-[#0077D7]/20 flex items-center justify-center shrink-0">
                    <ValueIcon iconKey={val.iconKey} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#080526]">
                      {val.title}
                    </h3>
                    <p className="mt-1 text-sm sm:text-base text-slate-600 leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
