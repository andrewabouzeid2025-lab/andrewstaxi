import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'whatsapp' | 'hero';
  fullWidth?: boolean;
  href?: string;
  external?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  href,
  external,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 border text-base font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "border-transparent text-gray-900 bg-taxi-yellow hover:bg-yellow-300 focus:ring-yellow-500 shadow-sm font-semibold",
    secondary: "border-transparent text-white bg-gray-900 hover:bg-gray-800 focus:ring-gray-900 shadow-sm",
    outline: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-yellow-500",
    whatsapp: "border-transparent text-white bg-[#25D366] hover:bg-[#20bd5a] focus:ring-green-500 shadow-sm font-semibold",
    hero: "border-white text-white bg-transparent hover:bg-white hover:text-gray-900 focus:ring-white shadow-sm"
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const combinedClasses = `${baseStyles} ${variants[variant]} ${widthClass} ${className}`;

  if (href) {
    return (
      <a 
        href={href} 
        className={combinedClasses}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};