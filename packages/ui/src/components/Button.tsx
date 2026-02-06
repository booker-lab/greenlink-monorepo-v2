import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
}

export function Button({
    variant = "primary",
    size = "md",
    children,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = "font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantStyles = {
        primary: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-gray-300",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500",
        outline: "border-2 border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500",
    };

    const sizeStyles = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3 text-base",
        lg: "px-6 py-4 text-lg",
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
