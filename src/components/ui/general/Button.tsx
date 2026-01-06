import React from 'react';

export interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'white';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export default function Button({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = '',
    type = 'button',
}: ButtonProps) {
    const baseStyles =
        `font-medium rounded transition-colors cursor-pointer 
        inline-flex items-center justify-center`;

    const variantStyles = {
        primary: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
        secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
        white: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50',
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const disabledStyles = 'opacity-50 cursor-not-allowed';

    const buttonStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${disabled ? disabledStyles : ''}
    ${className}
  `.trim();

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={buttonStyles}
        >
            {children}
        </button>
    );
};

