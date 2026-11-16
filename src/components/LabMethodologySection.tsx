import { Filter, ShieldCheck, Users, BarChart3, Layers } from 'lucide-react';
import { LAB_SOLUTIONS, type LabSolution } from '../data/businessPlan';
import { MegaMercadoIsotipo } from './MegaMercadoLogo';

function LabIcon({ iconKey }: { iconKey: LabSolution['iconKey'] }) {
  const cls = 'w-6 h-6 text-[#14EBD8] shrink-0';
  switch (iconKey) {
    case 'funnel':
      return <Filter className={cls} aria-hidden="true" />;
    case 'shield':
      return <ShieldCheck className={cls} aria-hidden="true" />;
    case 'traffic':
      return <Users className={cls} aria-hidden="true" />;
    case 'analytics':
      return <BarChart3 className={cls} aria-hidden="true" />;
    case 'cloud':
      return <Layers className={cls} aria-hidden="true" />;
  }
}

export function LabMethodologySection() {
  return (
    <section id="laboratorios" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Showcase Visual Column */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden bg-[#080526] min-h-[380px] lg:min-h-[600px]">
            <img
              src="/src/assets/images/lab_ecommerce_workstation_1794851330220.jpg"
              alt="Laboratorio de Comercio Electrónico y Learning con IA de MegaMercado"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(8,5,38,0.65) 0%, rgba(8,5,38,0.12) 45%, rgba(8,5,38,0.90) 100%)',
              }}
            />

            {/* Top-left Large Official Isotipo */}
            <div className="absolute top-6 left-6">
              <MegaMercadoIsotipo size="md" />
            </div>

            {/* Bottom Caption inside image */}
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="text-xs font-mono uppercase tracking-wider text-[#00FEAB]">
                Learning con IA · Efecto Laboratorio
              </p>
              <p className="mt-1.5 text-lg font-display font-bold text-white leading-snug">
                Aprende Inteligencia Artificial aplicada al comercio, experimenta en vivo y valida antes de invertir.
              </p>
            </div>
          </div>

          {/* Right 5 Stacked Deep-Indigo Problem-Solving Cards */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <h2
                className="font-display font-extrabold text-[#080526] tracking-tight leading-tight"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', textWrap: 'balance' }}
              >
                Por Qué el <span className="text-[#0077D7]">Learning con IA</span> Importa Hoy
              </h2>
              <p className="mt-3 text-base text-slate-600 leading-relaxed max-w-2xl">
                La Inteligencia Artificial transforma cómo operan los comercios, cómo venden las marcas y cómo
                compiten las PyMEs. Preparamos a tu equipo para usarla con precisión estratégica.
              </p>
            </div>

            <div className="mt-7 space-y-3.5">
              {LAB_SOLUTIONS.map((item) => (
                <div
                  key={item.index}
                  className="bg-[#0F084F] hover:bg-[#140B66] transition-colors duration-150 rounded-xl px-5 py-4 flex items-start gap-4 border border-[#0077D7]/25"
                >
                  <div className="w-11 h-11 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <LabIcon iconKey={item.iconKey} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-base sm:text-lg font-bold text-white leading-snug">
                      <span className="tabular-nums mr-1.5 text-[#00FEAB]">{item.index}.</span>{' '}
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-200 leading-relaxed">
                      {item.description}
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
