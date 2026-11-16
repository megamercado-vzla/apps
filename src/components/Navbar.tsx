import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { MegaMercadoLogo } from './MegaMercadoLogo';

interface NavbarProps {
  onOpenDiagnostic: () => void;
}

const NAV_LINKS = [
  { href: '#ecosistema', label: 'Ecosistema' },
  { href: '#laboratorios', label: 'Learning IA' },
  { href: '#hoja-de-ruta', label: 'Hoja de Ruta' },
  { href: '#proveedores', label: 'Proveedores TI' },
  { href: '#identidad', label: 'Corporativo' },
];

export function Navbar({ onOpenDiagnostic }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileNav = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Full MegaMercado Logo (Navbar only) */}
        <a
          href="#inicio"
          aria-label="MegaMercado Inicio"
          className="inline-flex items-center shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077D7] rounded-lg"
        >
          <MegaMercadoLogo size="md" />
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-[#080526] hover:text-[#0077D7] transition-colors duration-150 whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#0077D7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077D7] rounded"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single primary action + mobile menu button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenDiagnostic}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-[#0077D7] hover:bg-[#0066BA] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F084F]"
          >
            Contáctanos
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#080526] hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077D7]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-2 shadow-lg"
        >
          <nav aria-label="Navegación móvil" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleMobileNav}
                className="px-3 py-3 text-base font-semibold text-[#080526] hover:text-[#0077D7] hover:bg-slate-50 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenDiagnostic();
              }}
              className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#0077D7] hover:bg-[#0066BA] rounded-lg transition-colors cursor-pointer"
            >
              Contáctanos
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
