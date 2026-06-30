interface LogoMarkProps {
  size?: number;
  className?: string;
}

export function LogoMark({ size = 32, className = '' }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="55%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#logo-grad)" />
      {/* Globe ring */}
      <circle cx="16" cy="16" r="8" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" fill="none" />
      {/* Horizontal band */}
      <path d="M8 16 Q16 19.5 24 16" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" fill="none" />
      <path d="M8 16 Q16 12.5 24 16" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" fill="none" />
      {/* Vertical spine */}
      <line x1="16" y1="8" x2="16" y2="24" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
      {/* Center dot */}
      <circle cx="16" cy="16" r="2" fill="white" opacity="0.9" />
    </svg>
  );
}

interface LogoWordmarkProps {
  className?: string;
  size?: number;
}

export function LogoWordmark({ className = '', size = 32 }: LogoWordmarkProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      <span
        style={{
          fontWeight: 800,
          fontSize: size * 0.56,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          background: 'linear-gradient(135deg, #60A5FA 0%, #22D3EE 50%, #A78BFA 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        NetAsia
      </span>
    </div>
  );
}
