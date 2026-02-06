import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging tailwind classes
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Premium Card component with glassmorphism
 */
export const Card = ({ className, children, ...props }) => {
    return (
        <div
            className={cn(
                "glass-card p-6 transition-all duration-300 hover:shadow-[0_20px_40px_0_rgba(31,38,135,0.1)] group",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

/**
 * Advanced Button with rich gradients and hover states
 */
export const Button = ({ className, variant = 'primary', size = 'md', children, ...props }) => {
    const variants = {
        primary: "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-[0.98]",
        secondary: "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700",
        outline: "bg-transparent border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-600 dark:text-slate-400 hover:text-blue-500",
        ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs font-semibold",
        md: "px-5 py-2.5 text-sm font-bold",
        lg: "px-8 py-4 text-base font-extrabold tracking-tight"
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

/**
 * Elegant Badge for status and labels
 */
export const Badge = ({ className, variant = 'default', children, ...props }) => {
    const variants = {
        default: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
        success: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
        warning: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
        danger: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
        info: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
    };

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};
