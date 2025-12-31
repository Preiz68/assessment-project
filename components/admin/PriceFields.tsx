"use client";

import React from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { Select } from "@/components/ui/Select";
import { type ProductFormValues } from "@/lib/validations/product";
import { cn } from "@/lib/utils/cn";

interface PriceFieldsProps {
  form: UseFormReturn<ProductFormValues>;
  activeField?: string | null;
  onFocusChange?: (field: string | null) => void;
}

export const PriceFields: React.FC<PriceFieldsProps> = ({
  form,
  activeField,
  onFocusChange,
}) => {
  const { register, setValue, control } = form;

  const mrp = useWatch({ control, name: "mrp" });
  const offerPercentage = useWatch({ control, name: "offerPercentage" });
  const sellingPrice = useWatch({ control, name: "sellingPrice" });

  // Auto-calculation logic
  React.useEffect(() => {
    // MRP + Offer -> Selling Price
    if (
      mrp &&
      offerPercentage !== undefined &&
      activeField !== "sellingPrice"
    ) {
      const calculated = mrp - (mrp * offerPercentage) / 100;
      const rounded = Math.round(calculated);
      if (rounded !== sellingPrice) {
        setValue("sellingPrice", rounded, { shouldValidate: true });
      }
    }
  }, [mrp, offerPercentage, setValue, sellingPrice, activeField]);

  // Selling Price -> Offer percentage calculation
  const handleSellingPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setValue("sellingPrice", val, { shouldValidate: true });

    if (mrp && val) {
      const calculatedOffer = ((mrp - val) / mrp) * 100;
      setValue("offerPercentage", Math.round(calculatedOffer), {
        shouldValidate: true,
      });
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3 lg:gap-6">
      <div className="space-y-1.5">
        <label className="text-[10px] lg:text-sm font-bold text-gray-900 flex items-center">
          MRP<span className="text-[#A1001A] ml-0.5">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs lg:text-sm font-medium">
            ₹
          </span>
          <input
            type="number"
            {...register("mrp", { valueAsNumber: true })}
            onFocus={() => onFocusChange?.("mrp")}
            onBlur={() => onFocusChange?.(null)}
            placeholder="0"
            className={cn(
              "w-full h-10 lg:h-11 bg-[#F8F9FA] border border-[#EAEAEA] rounded-lg pl-6 lg:pl-8 pr-2 text-xs lg:text-sm font-medium text-[#1a1a1a] focus:outline-none",
              form.formState.errors.mrp && "border-red-500"
            )}
          />
        </div>
        {form.formState.errors.mrp && (
          <p className="text-xs text-red-500 mt-1">
            {form.formState.errors.mrp.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] lg:text-sm font-bold text-gray-900">
          Offer
        </label>
        <Select
          options={[
            { label: "10% Off", value: 10 },
            { label: "12% Off", value: 12 },
            { label: "50% Off", value: 50 },
          ]}
          {...register("offerPercentage", { valueAsNumber: true })}
          defaultValue={0}
          className="bg-[#F8F9FA] border border-[#EAEAEA] h-10 lg:h-11 rounded-lg"
          error={form.formState.errors.offerPercentage?.message}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] lg:text-sm font-bold text-gray-900 flex items-center">
          Selling Price<span className="text-[#A1001A] ml-0.5">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs lg:text-sm font-medium">
            ₹
          </span>
          <input
            type="number"
            {...register("sellingPrice", { valueAsNumber: true })}
            placeholder="0"
            onFocus={() => onFocusChange?.("sellingPrice")}
            onBlur={() => onFocusChange?.(null)}
            onChange={handleSellingPriceChange}
            className={cn(
              "w-full h-10 lg:h-11 bg-[#F8F9FA] border border-[#EAEAEA] rounded-lg pl-6 lg:pl-8 pr-2 text-xs lg:text-sm font-medium text-[#1a1a1a] focus:outline-none",
              form.formState.errors.sellingPrice && "border-red-500"
            )}
          />
        </div>
        {form.formState.errors.sellingPrice && (
          <p className="text-xs text-red-500 mt-1">
            {form.formState.errors.sellingPrice.message}
          </p>
        )}
      </div>
    </div>
  );
};
