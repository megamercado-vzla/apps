import { FlaskConical, Store, RefreshCw, Cloud } from 'lucide-react';
import { HERO_PILLARS, type HeroPillar } from '../data/businessPlan';

interface HeroSectionProps {
  onStartRoadmap: () => void;
  onContactClick: () => void;
}

function PillarIcon({ iconKey }: { iconKey: HeroPillar['iconKey'] }) {
  const iconClass = 'w-6 h-6 text-[#0077D7]';
  switch (iconKey) {
    case 'lab':
      return <FlaskConical className={iconClass} aria-hidden="true" />;
    case 'marketplace':
      return <Store className={iconClass} aria-hidden="true" />;
    case 'currency':
      return <RefreshCw className={iconClass} aria-hidden="true" />;
    case 'cloud':
      return <Cloud className={iconClass} aria-hidden="true" />;
  }
}

export function HeroSection({ onStartRoadmap, onContactClick }: HeroSectionProps) {
  return (
    <section id="inicio" className="relative bg-white">
      {/* Dark Hero Field */}
      <div className="relative bg-[#080526] overflow-hidden">
        {/* Background Artwork */}
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/hero_megamercado_hub_1794851329682.jpg"
            alt="Red digital de comercio electrónico y centros de datos MegaMercado"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-85"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(8,5,38,0.96) 0%, rgba(8,5,38,0.88) 44%, rgba(15,8,79,0.45) 100%)',
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-24"
            style={{
              background: 'linear-gradient(180deg, rgba(8,5,38,0) 0%, rgba(8,5,38,0.85) 100%)',
            }}
          />
        </div>

        {/* Hero Copy Container */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-28 sm:pt-20 sm:pb-32 lg:pt-24 lg:pb-36">
          <div className="max-w-2xl">
            <h1
              className="font-display font-extrabold text-white tracking-tight leading-[1.08]"
              style={{
                fontSize: 'clamp(2.25rem, 4.2vw, 3.75rem)',
                textWrap: 'balance',
              }}
            >
              Aprende, Experimenta y Escala E-Commerce con IA
            </h1>

            <p className="mt-5 text-xl sm:text-2xl font-semibold text-[#14EBD8] tracking-tight">
              MegaMercado: Donde el aprendizaje con IA impulsa el comercio digital.
            </p>

            <p className="mt-5 text-base sm:text-lg text-slate-200 leading-relaxed max-w-xl">
              Integramos formación práctica en Inteligencia Artificial, Laboratorios de Comercio Electrónico y
              Marketplaces Verticales SaaS en Venezuela para automatizar ventas 24/7 con criterio y datos.
            </p>

            <p className="mt-3 text-sm sm:text-base font-medium text-slate-300">
              Centro de Learning con IA · Plan Corporativo 2026–2028 sobre Google Cloud Services
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onStartRoadmap}
                className="inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base font-semibold text-white bg-[#0077D7] hover:bg-[#0066BA] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FEAB]"
              >
                Explorar Rutas IA
              </button>
              <button
                type="button"
                onClick={onContactClick}
                className="inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base font-semibold text-white border border-white/40 hover:border-[#00FEAB] hover:text-[#00FEAB] bg-white/5 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FEAB]"
              >
                Solicitar Diagnóstico
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlapping 4-Pillar Capability Strip (signature bbbaihub.org bridge) */}
      <div id="ecosistema" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-14 sm:-mt-16">
        <div className="bg-white rounded-2xl shadow-[0_14px_40px_rgba(8,5,38,0.10)] border border-slate-200/90 px-6 py-6 sm:px-8 sm:py-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {HERO_PILLARS.map((pillar) => (
              <div key={pillar.id} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#EFF5FF] border border-[#0077D7]/20 flex items-center justify-center shrink-0">
                  <PillarIcon iconKey={pillar.iconKey} />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-base font-bold text-[#080526] leading-snug">
                    {pillar.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
