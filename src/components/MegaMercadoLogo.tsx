interface MegaMercadoLogoProps {
  size?: 'sm' | 'md';
}

export function MegaMercadoLogo({ size = 'md' }: MegaMercadoLogoProps) {
  const sizeClasses = size === 'sm' ? 'h-10 w-36' : 'h-11 w-40';

  return (
    <span className={`relative inline-block overflow-hidden shrink-0 ${sizeClasses}`}>
      <img
        src="/assets/aistudio/logo2026_0b36219e.svg"
        alt="MegaMercado"
        referrerPolicy="no-referrer"
        className="h-full w-full object-contain scale-[1.36] select-none pointer-events-none"
      />
    </span>
  );
}

interface MegaMercadoIsotipoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function MegaMercadoIsotipo({ size = 'lg', className = '' }: MegaMercadoIsotipoProps) {
  const sizeClasses = {
    sm: 'w-20',
    md: 'w-28',
    lg: 'w-44 sm:w-52',
    xl: 'w-56 sm:w-64',
  }[size];

  return (
    <span
      className={`relative inline-block aspect-[3/2] overflow-hidden shrink-0 ${sizeClasses} ${className}`}
    >
      <img
        src="/assets/aistudio/isotipo_81d56d75.svg"
        alt="Isotipo de MegaMercado"
        referrerPolicy="no-referrer"
        className="absolute max-w-none w-[262%] h-auto -left-[24.5%] -top-[64%] select-none pointer-events-none"
      />
    </span>
  );
}
