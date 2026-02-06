import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    suffix?: string;
}

export function Input({
    label,
    error,
    suffix,
    className = "",
    ...props
}: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${error ? "border-red-500" : "border-gray-300"
                        } ${suffix ? "pr-12" : ""} ${className}`}
                    {...props}
                />
                {suffix && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                        {suffix}
                    </span>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
