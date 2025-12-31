"use client";

import React, { forwardRef, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { FaCaretDown } from "react-icons/fa";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string | number }[] | string[];
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      required,
      placeholder,
      className,
      onChange,
      value: propsValue,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(
      propsValue || defaultValue || ""
    );
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (propsValue !== undefined) {
        setSelectedValue(propsValue);
      }
    }, [propsValue]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (val: string | number) => {
      setSelectedValue(val);
      setIsOpen(false);

      // Simulate native change event for react-hook-form
      if (onChange) {
        const event = {
          target: { value: val, name: props.name },
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(event);
      }
    };

    const displayLabel = options.find(
      (opt) =>
        (typeof opt === "string" ? opt : opt.value.toString()) ===
        selectedValue.toString()
    );

    const labelText = displayLabel
      ? typeof displayLabel === "string"
        ? displayLabel
        : displayLabel.label
      : placeholder || "Select";

    return (
      <div className="w-full space-y-1.5" ref={containerRef}>
        {label && (
          <label className="text-xs lg:text-sm font-bold text-gray-900 flex items-center">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex h-11 w-full items-center justify-between rounded-lg border border-[#EAEAEA] bg-[#F8F9FA] px-4 py-2 text-sm transition-all focus:outline-none font-medium text-gray-500",
              error && "border-red-500",
              className
            )}
          >
            <span className={cn(selectedValue === "" && "text-gray-400")}>
              {labelText}
            </span>
            <FaCaretDown
              className={cn(
                "h-4 w-4 text-gray-400 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </button>

          {/* Hidden select for react-hook-form registration */}
          <select
            ref={ref}
            value={selectedValue}
            onChange={onChange}
            className="hidden"
            {...props}
          >
            <option value="">{placeholder || "Select"}</option>
            {options.map((option) => {
              const optLabel =
                typeof option === "string" ? option : option.label;
              const optValue =
                typeof option === "string" ? option : option.value;
              return (
                <option key={optValue} value={optValue}>
                  {optLabel}
                </option>
              );
            })}
          </select>

          {isOpen && (
            <div className="absolute z-50 mt-1 w-full rounded-lg border border-[#EAEAEA] bg-white py-1 shadow-lg max-h-60 overflow-y-auto">
              {options.map((option) => {
                const optLabel =
                  typeof option === "string" ? option : option.label;
                const optValue =
                  typeof option === "string" ? option : option.value;
                const isSelected =
                  optValue.toString() === selectedValue.toString();

                return (
                  <div
                    key={optValue}
                    onClick={() => handleSelect(optValue)}
                    className={cn(
                      "cursor-pointer px-4 py-2.5 text-sm transition-colors",
                      isSelected
                        ? "bg-[#F3F4F6] font-semibold text-gray-900"
                        : "text-gray-600 hover:bg-[#F8F9FA]"
                    )}
                  >
                    {optLabel}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 font-medium px-1 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
