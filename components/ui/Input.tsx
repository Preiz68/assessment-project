"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        <label className="text-sm font-bold text-gray-900 flex items-center">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <input
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-lg border border-[#EAEAEA] bg-[#F8F9FA] px-4 py-2 text-sm transition-all focus:outline-none placeholder:text-gray-400 font-medium",
            error && "border-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 font-medium px-1 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
