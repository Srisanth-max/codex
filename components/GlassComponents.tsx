import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`relative ios-glass-panel rounded-[2rem] overflow-hidden transition-all duration-500 ${className}`}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-50"></div>
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon';
  isLoading?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading,
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative font-medium text-[12px] uppercase tracking-wider transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden group select-none";
  
  const variants = {
    primary: "bg-blue-600/20 hover:bg-blue-600/30 text-blue-100 rounded-lg px-5 py-2.5 border border-blue-400/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
    secondary: "bg-white/5 hover:bg-white/10 text-gray-200 rounded-lg px-4 py-2 border border-white/5",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg px-4 py-2 border border-red-500/10",
    ghost: "bg-transparent hover:bg-white/5 text-gray-400 hover:text-white rounded-lg px-3 py-2",
    icon: "bg-white/5 hover:bg-white/10 text-white rounded-lg p-2 border border-white/5 aspect-square"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      ) : children}
    </button>
  );
};