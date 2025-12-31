"use client";

import React, { useState } from "react";
import { useForm, useWatch, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Menu,
  PlusCircle,
  XCircle,
  GripVertical,
  ChevronRight,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Sidebar } from "@/components/admin/Sidebar";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { PriceFields } from "@/components/admin/PriceFields";
import {
  productSchema,
  type ProductFormValues,
} from "@/lib/validations/product";
import {
  CATEGORIES,
  WARRANTY_OPTIONS,
  WEIGHT_UNITS,
  MATERIAL_OPTIONS,
} from "@/lib/constants/mock-data";
import { cn } from "@/lib/utils/cn";
import { CiEdit } from "react-icons/ci";

const VariantRow = ({
  index,
  isEditing,
  control,
  register,
  setValue,
  variantOption,
  activeField,
  setActiveField,
  setIsEditingTable,
}: any) => {
  const mrp = useWatch({ control, name: `variantsData.${index}.mrp` });
  const offer = useWatch({
    control,
    name: `variantsData.${index}.offerPercentage`,
  });
  const sellingPrice = useWatch({
    control,
    name: `variantsData.${index}.sellingPrice`,
  });
  const name = useWatch({ control, name: `variantsData.${index}.name` });
  const inventory = useWatch({
    control,
    name: `variantsData.${index}.inventory`,
  });

  React.useEffect(() => {
    if (
      mrp !== undefined &&
      offer !== undefined &&
      activeField !== `variantsData.${index}.sellingPrice`
    ) {
      const calculated = Math.round(mrp - (mrp * offer) / 100);
      if (calculated !== sellingPrice) {
        setValue(`variantsData.${index}.sellingPrice`, calculated, {
          shouldValidate: true,
        });
      }
    }
  }, [mrp, offer, setValue, index, sellingPrice, activeField]);

  const handleSellingPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setValue(`variantsData.${index}.sellingPrice`, val, {
      shouldValidate: true,
    });
    if (mrp && val) {
      const calculatedOffer = ((mrp - val) / mrp) * 100;
      setValue(
        `variantsData.${index}.offerPercentage`,
        Math.round(calculatedOffer),
        { shouldValidate: true }
      );
    }
  };

  if (isEditing) {
    return (
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-1 text-xs font-bold text-[#1a1a1a]">
          {name}
        </div>

        <div className="col-span-2">
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
              ₹
            </span>
            <input
              type="number"
              {...register(`variantsData.${index}.mrp`, {
                valueAsNumber: true,
              })}
              onFocus={() => setActiveField(`variantsData.${index}.mrp`)}
              onBlur={() => setActiveField(null)}
              className="w-full h-9 bg-white border border-[#EAEAEA] rounded-lg px-5 text-[10px] font-medium focus:outline-none"
            />
          </div>
        </div>

        <div className="col-span-2">
          <Select
            defaultValue="0% Off"
            options={[
              { label: "10% Off", value: 10 },
              { label: "20% Off", value: 20 },
              { label: "50% Off", value: 50 },
            ]}
            {...register(`variantsData.${index}.offerPercentage`, {
              valueAsNumber: true,
            })}
            className="h-9 bg-white border border-[#EAEAEA] text-[10px] font-medium rounded-lg"
          />
        </div>

        <div className="col-span-2">
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
              ₹
            </span>
            <input
              type="number"
              {...register(`variantsData.${index}.sellingPrice`, {
                valueAsNumber: true,
              })}
              onFocus={() =>
                setActiveField(`variantsData.${index}.sellingPrice`)
              }
              onBlur={() => setActiveField(null)}
              onChange={handleSellingPriceChange}
              className="w-full h-9 bg-white border border-[#EAEAEA] rounded-lg px-5 text-[10px] font-medium focus:outline-none"
            />
          </div>
        </div>

        <div className="col-span-2">
          <input
            type="number"
            {...register(`variantsData.${index}.inventory`, {
              valueAsNumber: true,
            })}
            className="w-full h-9 bg-white border border-[#EAEAEA] rounded-lg px-2 text-[10px] font-medium focus:outline-none text-center"
          />
        </div>

        <div className="col-span-3 flex items-center gap-1.5">
          <div className="relative flex-1">
            <input
              type="number"
              step="0.001"
              {...register(`variantsData.${index}.weight`, {
                valueAsNumber: true,
              })}
              className="w-full h-9 bg-white border border-[#EAEAEA] rounded-lg pl-2 pr-6 text-[10px] font-medium focus:outline-none"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-300">
              Kg
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 items-center py-4 border-t border-gray-50 pr-4 group">
      <div className="col-span-4 flex items-center gap-3">
        {variantOption?.toLowerCase()?.includes("color") && (
          <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
            <PlusCircle className="w-4 h-4 text-white" />
          </div>
        )}
        <span className="text-xs font-bold text-[#1a1a1a]">{name}</span>
      </div>
      <div className="col-span-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#1a1a1a]">
            ₹ {Number(sellingPrice || 0).toFixed(2)}
          </span>
          <span className="text-[10px] text-gray-400 line-through">
            ₹ {Number(mrp || 0).toFixed(2)}
          </span>
        </div>
      </div>
      <div className="col-span-3 text-xs font-bold text-[#1a1a1a]">
        {inventory || 0}
      </div>
      <div className="col-span-1 flex justify-end pr-2">
        <CiEdit
          className="w-3.5 h-3.5 text-gray-300 cursor-pointer group-hover:text-gray-500"
          onClick={() => setIsEditingTable(true)}
        />
      </div>
    </div>
  );
};

export default function AddProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isCurrentVariant, setIsCurrentVariant] = useState(false);
  const [isVariantSaved, setIsVariantSaved] = useState(false);
  const [isEditingTable, setIsEditingTable] = useState(false);
  const [showFigma, setShowFigma] = useState(false);
  const [showMaterialTextarea, setShowMaterialTextarea] = useState(false);
  const [activeVariantOptions, setActiveVariantOptions] = useState<
    {
      id: string;
      name: string;
      values: string[];
    }[]
  >([{ id: Date.now().toString(), name: "", values: [] }]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      category: "",
      subCategory: "",
      description: "",
      brand: "",
      warranty: "",
      mrp: 0,
      offerPercentage: 0,
      sellingPrice: 0,
      tags: [],
      materialAndCare: "",
      weight: 0.0,
      weightUnit: "Kg",
      stockQuantity: 100,
      images: [],
      variant: [],
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = form;

  const { fields, replace } = useFieldArray({
    control,
    name: "variantsData",
  });

  // Sync tags with form state
  React.useEffect(() => {
    setValue("tags", tags, { shouldValidate: true });
  }, [tags, setValue]);

  const selectedCategory = useWatch({ control, name: "category" });
  const subCategories =
    CATEGORIES.find((c) => c.id === selectedCategory)?.subCategories || [];

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const existing = JSON.parse(localStorage.getItem("products") || "[]");
      localStorage.setItem(
        "products",
        JSON.stringify([...existing, { ...data, id: Date.now() }])
      );
      console.log(data);
      toast.success("Product saved successfully!");
    } catch (error) {
      toast.error("Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: any) => {
    console.log("Form Errors:", errors);
    toast.error("Please fill all required fields correctly.");

    // Find the first error and scroll to it
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      const firstError = errorKeys[0];
      const element = document.querySelector(`[name="${firstError}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div className="flex bg-white w-full min-h-screen font-sans">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="flex-1 lg:ml-64 p-4 lg:p-8 bg-white">
        <header className="mb-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Menu className="w-5 h-5 text-[#273C8A] lg:hidden cursor-pointer" />
              <h1 className="text-lg lg:text-xl font-bold text-gray-900 whitespace-nowrap">
                Add New Product
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFigma(!showFigma)}
                className="px-3 lg:px-6 py-1.5 text-[10px] lg:text-sm font-bold text-[#273C8A] bg-white border border-[#273C8A] rounded-full hover:bg-red-50 transition-colors"
                title={showFigma ? "Hide Design" : "View Design"}
              >
                {showFigma ? "Hide" : "Design"}
              </button>
              <button
                type="button"
                onClick={() => reset()}
                className="px-4 lg:px-6 py-1.5 text-[10px] lg:text-sm font-bold text-gray-400 bg-[#F8F9FA] border border-[#EAEAEA] rounded-full hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-product-form"
                disabled={isSubmitting}
                className="px-6 lg:px-8 py-1.5 text-[10px] lg:text-sm font-bold text-white bg-linear-to-r from-[#BA0820] via-[#5F1A4B] to-[#002D78] rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 shadow-sm"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          {showFigma && (
            <div className="mt-4 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              <iframe
                title="Figma Design"
                className="w-full h-[600px]"
                src="https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/zseMQCcDXvA55nVZOiQMWI/PSZ-Admin-Flow?node-id=0-1&t=Jc3UcCIK0GRuNJUq-1"
                allowFullScreen
              />
            </div>
          )}
        </header>

        {/* Form Content */}
        <form
          id="add-product-form"
          onSubmit={handleSubmit(onSubmit, onError)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6"
        >
          {/* Main Content Areas */}
          <div className="lg:col-span-8 space-y-6">
            {/* Box 1: Core Fields */}
            <div className="bg-white p-5 lg:p-6 space-y-4 lg:space-y-6 border border-[#EAEAEA] rounded-lg">
              <Input
                label="Title"
                placeholder="Add product title"
                {...register("title")}
                error={errors.title?.message}
                required
                className="text-xs lg:text-sm"
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Category"
                  options={CATEGORIES.map((c) => ({
                    label: c.name,
                    value: c.id,
                  }))}
                  {...register("category")}
                  error={errors.category?.message}
                  required
                  className="h-10 lg:h-11 text-xs lg:text-sm"
                />
                <Select
                  label="Sub-Category"
                  options={subCategories}
                  {...register("subCategory")}
                  error={errors.subCategory?.message}
                  disabled={!selectedCategory}
                  required
                  className="h-10 lg:h-11 text-xs lg:text-sm"
                />
              </div>

              <Textarea
                label="Description"
                placeholder="Enter your product description"
                {...register("description")}
                error={errors.description?.message}
                required
                className="h-24 lg:h-32 text-xs lg:text-sm resize-none"
              />

              <ImageUpload
                onImagesChange={(urls) =>
                  setValue("images", urls, { shouldValidate: true })
                }
                error={errors.images?.message}
              />
            </div>

            {/* Box 2: Product Organization (Integrated for Mobile flow) */}
            <div className="md:hidden block p-5 lg:p-6 space-y-4 border border-[#EAEAEA] rounded-lg mb-6">
              <h2 className="text-xs lg:text-sm font-bold text-gray-900">
                Product Organization
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:space-y-6">
                <Input
                  label="Brand Manufacturer"
                  placeholder="Brand name"
                  {...register("brand")}
                  error={errors.brand?.message}
                  required
                  className="text-xs lg:text-sm"
                />
                <Select
                  label="Add Warranty"
                  options={WARRANTY_OPTIONS}
                  {...register("warranty")}
                  error={errors.warranty?.message}
                  required
                  placeholder="Time period"
                  className="h-10 lg:h-11 text-xs lg:text-sm"
                />
              </div>
              <Input
                label="Seller Name"
                {...register("sellerName")}
                defaultValue="Sagar Sports Club"
                readOnly
                className="text-[#1a1a1a] font-medium bg-[#F8F9FA] border-none h-10 lg:h-11 text-xs lg:text-sm"
              />
              <div className="space-y-1.5">
                <label className="text-[10px] lg:text-sm font-bold text-gray-900">
                  Tags
                </label>
                <div className="w-full relative h-10 lg:h-11 bg-[#F8F9FA] rounded-md px-4 flex items-center">
                  <input
                    value={currentTag}
                    onFocus={() => setActiveField("tags")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => {
                      setCurrentTag(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && currentTag.trim() !== "") {
                        e.preventDefault();
                        if (!tags.includes(currentTag.trim())) {
                          setTags((prev) => [...prev, currentTag.trim()]);
                        }
                        setCurrentTag("");
                      }
                    }}
                    className="bg-transparent border-none text-[10px] lg:text-sm placeholder:text-gray-400 focus:outline-none w-full"
                    placeholder="Tags"
                  />
                  {currentTag && (
                    <div
                      className="bg-gray-300 absolute -bottom-full left-0 right-0 h-full rounded-sm px-2 flex items-center cursor-pointer z-10"
                      onClick={() => {
                        if (!tags.includes(currentTag.trim())) {
                          setTags((prev) => [...prev, currentTag.trim()]);
                        }
                        setCurrentTag("");
                      }}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      {`Add ${currentTag}`}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-red-200 flex justify-between items-center w-fit gap-2 h-5 text-sm px-1 rounded"
                    >
                      {tag}
                      <XCircle
                        className="size-2 cursor-pointer"
                        onClick={() =>
                          setTags(tags.filter((_, i) => i !== index))
                        }
                      />
                    </span>
                  ))}
                </div>
                {errors.tags && (
                  <p className="text-xs text-red-500 mt-1 font-medium italic">
                    {errors.tags.message}
                  </p>
                )}
              </div>
            </div>

            {/* Box 3: Pricing */}
            <div className="p-5 lg:p-6 border border-[#EAEAEA] rounded-lg">
              <PriceFields
                form={form}
                activeField={activeField}
                onFocusChange={setActiveField}
              />
            </div>

            {/* Box 4: Material & Logistics (Integrated for Mobile flow) */}
            <div className="md:hidden block space-y-6">
              <div className="p-5 space-y-2">
                <label className="text-[10px] font-bold text-gray-900">
                  Material and Care
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                {showMaterialTextarea ? (
                  <div className="space-y-2">
                    <Textarea
                      label="Custom Material & Care"
                      {...register("materialAndCare")}
                      placeholder="Enter product materials and care instructions (e.g., 100% cotton, machine wash cold)"
                      className="h-24 text-[10px]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowMaterialTextarea(false);
                        setValue("materialAndCare", "");
                      }}
                      className="text-[10px] text-[#A1001A] font-bold"
                    >
                      Reset to options
                    </button>
                  </div>
                ) : (
                  <Select
                    options={MATERIAL_OPTIONS}
                    value={form.watch("materialAndCare")}
                    onChange={(e) => {
                      if (e.target.value === "Other") {
                        setShowMaterialTextarea(true);
                        setValue("materialAndCare", "");
                      } else {
                        setValue("materialAndCare", e.target.value);
                      }
                    }}
                    className="h-12 bg-[#F8F9FA] border-none text-xs font-medium"
                  />
                )}
              </div>

              <div className="p-5">
                <div className="flex gap-4 w-full items-start">
                  <div className="space-y-1.5 flex-2">
                    <label className="text-xs font-bold text-gray-900">
                      Product weight
                      <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.1"
                        {...register("weight", { valueAsNumber: true })}
                        placeholder="0.7"
                        className="flex-1 h-10 bg-[#F8F9FA] rounded-lg px-3 text-xs font-medium border border-[#EAEAEA] focus:outline-none"
                      />
                      <select
                        {...register("weightUnit")}
                        className="w-16 bg-[#F8F9FA] border border-[#EAEAEA] rounded-lg px-1 text-xs font-bold focus:outline-none text-[#1a1a1a]"
                      >
                        <option value="Kg">Kg</option>
                        <option value="G">G</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <label className="text-xs font-bold text-gray-900">
                      Stock Quantity
                      <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      type="number"
                      {...register("stockQuantity", { valueAsNumber: true })}
                      placeholder="100"
                      className="w-full h-10 bg-[#F8F9FA] border border-[#EAEAEA] rounded-lg px-3 text-xs font-medium focus:outline-none text-left placeholder:text-gray-300"
                    />
                    {errors.stockQuantity && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.stockQuantity.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Box 5: Variants */}
            <div className="p-5 lg:p-6 space-y-4 border border-[#EAEAEA] rounded-lg">
              <label className="text-sm font-bold text-[#1a1a1a]">
                Variants
              </label>

              {!isCurrentVariant && fields.length === 0 && (
                <div
                  onClick={() => setIsCurrentVariant(true)}
                  className="w-full py-2 px-4 border border-[#EAEAEA] rounded-lg bg-[#F8F9FA] flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <PlusCircle className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-400 font-medium">
                    Add options, colors, size etc.
                  </span>
                </div>
              )}

              {isCurrentVariant ? (
                <div className="space-y-6">
                  {activeVariantOptions.map((opt, optIndex) => (
                    <div key={opt.id} className="space-y-4">
                      {/* Option Name Section */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#1a1a1a] uppercase tracking-tight ml-7">
                          Option name{" "}
                          {activeVariantOptions.length > 1 &&
                            `#${optIndex + 1}`}
                        </label>
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-[#DEDCE0]" />
                          <div className="flex-1">
                            <Select
                              options={["Size Uk", "Size Us", "Color"]}
                              value={opt.name}
                              onChange={(e) => {
                                const newOpts = [...activeVariantOptions];
                                newOpts[optIndex].name = e.target.value;
                                newOpts[optIndex].values = []; // Reset values on name change
                                setActiveVariantOptions(newOpts);
                              }}
                              placeholder="Select Option"
                              className="h-11 bg-[#F8F9FA] border-none text-sm font-medium"
                            />
                          </div>
                          {activeVariantOptions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveVariantOptions(
                                  activeVariantOptions.filter(
                                    (_, i) => i !== optIndex
                                  )
                                );
                              }}
                              className="p-1 hover:bg-gray-100 rounded text-gray-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Option Values Section (Conditional) */}
                      {opt.name && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-[#1a1a1a] uppercase tracking-tight ml-7">
                            Option values
                          </label>
                          <div className="flex items-center gap-3">
                            <GripVertical className="w-4 h-4 text-[#DEDCE0]" />
                            <div className="flex flex-wrap gap-2">
                              {(opt.name === "Color"
                                ? ["Red", "White", "Blue", "Black"]
                                : ["3", "4", "5", "6", "7", "8", "9", "10"]
                              ).map((val) => {
                                const isSelected = opt.values.includes(val);
                                return (
                                  <button
                                    key={val}
                                    type="button"
                                    onClick={() => {
                                      const newOpts = [...activeVariantOptions];
                                      const currentValues =
                                        newOpts[optIndex].values;
                                      if (currentValues.includes(val)) {
                                        newOpts[optIndex].values =
                                          currentValues.filter(
                                            (v) => v !== val
                                          );
                                      } else {
                                        newOpts[optIndex].values = [
                                          ...currentValues,
                                          val,
                                        ];
                                      }
                                      setActiveVariantOptions(newOpts);
                                    }}
                                    className={cn(
                                      "flex items-center justify-center min-w-[40px] px-3 h-8 text-[11px] font-bold rounded border transition-all",
                                      isSelected
                                        ? "bg-[#EFF6FF] text-[#2563EB] border-[#2563EB]"
                                        : "bg-[#F8F9FA] text-[#1a1a1a] border-[#E5E7EB] hover:border-gray-300"
                                    )}
                                  >
                                    {val}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setActiveVariantOptions([
                        ...activeVariantOptions,
                        { id: Date.now().toString(), name: "", values: [] },
                      ]);
                    }}
                    className="ml-7 text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add another option
                  </button>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 pt-2 pb-2">
                    <button
                      type="button"
                      onClick={() => setIsCurrentVariant(false)}
                      className="px-6 py-1.5 text-xs font-bold text-gray-400 bg-white border border-[#EAEAEA] rounded-full hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const currentVariants =
                          form.getValues("variantsData") || [];
                        const baseMrp = form.getValues("mrp") || 0;
                        const baseOffer =
                          form.getValues("offerPercentage") || 0;
                        const baseSellingPrice =
                          form.getValues("sellingPrice") || 0;
                        const baseWeight = form.getValues("weight") || 0;

                        // Helper for Cartesian product
                        function getCombinations(
                          options: { name: string; values: string[] }[]
                        ) {
                          const validOptions = options.filter(
                            (o) => o.name && o.values.length > 0
                          );
                          if (validOptions.length === 0) return [];

                          let result: string[][] = [[]];
                          for (const opt of validOptions) {
                            const nextResult: string[][] = [];
                            for (const res of result) {
                              for (const val of opt.values) {
                                nextResult.push([...res, val]);
                              }
                            }
                            result = nextResult;
                          }
                          return result.map((combo) => combo.join(" / "));
                        }

                        const comboNames =
                          getCombinations(activeVariantOptions);

                        const mergedVariants = comboNames.map((name) => {
                          const existing = currentVariants.find(
                            (v) => v.name === name
                          );
                          if (existing) return existing;

                          return {
                            name,
                            mrp: baseMrp,
                            offerPercentage: baseOffer,
                            sellingPrice: baseSellingPrice,
                            inventory: 100,
                            weight: baseWeight,
                          };
                        });

                        replace(mergedVariants);
                        setIsVariantSaved(true);
                        setIsCurrentVariant(false);
                      }}
                      className="px-6 py-1.5 text-xs font-bold text-white bg-linear-to-r from-[#BA0820] via-[#5F1A4B] to-[#002D78] rounded-full hover:opacity-90 shadow-sm"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : isVariantSaved ? (
                <div className="space-y-6">
                  {/* Saved Summary Section */}
                  <div className="space-y-4">
                    {activeVariantOptions
                      .filter((o) => o.name)
                      .map((opt) => (
                        <div key={opt.id} className="space-y-4">
                          <div className="flex items-center justify-between ml-7">
                            <span className="text-sm font-medium text-[#1a1a1a]">
                              {opt.name}
                            </span>
                            <CiEdit
                              className="w-4 h-4 text-gray-400 cursor-pointer"
                              onClick={() => setIsCurrentVariant(true)}
                            />
                          </div>

                          <div className="flex items-center gap-3">
                            <GripVertical className="w-4 h-4 text-[#DEDCE0]" />
                            <div className="flex flex-wrap gap-2">
                              {opt.values.map((val) => (
                                <div
                                  key={val}
                                  className="flex items-center justify-center min-w-[40px] px-3 h-8 text-[11px] font-bold rounded border bg-[#EFF6FF] text-[#2563EB] border-[#2563EB]"
                                >
                                  {val}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}

                    <div
                      className="w-full py-2 px-4 border border-[#EAEAEA] rounded-lg bg-[#F8F9FA] flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setActiveVariantOptions([
                          ...activeVariantOptions,
                          { id: Date.now().toString(), name: "", values: [] },
                        ]);
                        setIsCurrentVariant(true);
                      }}
                    >
                      <PlusCircle className="size-4 text-gray-400" />
                      <p className="text-sm font-medium text-gray-400">
                        Add options, colors, size etc.
                      </p>
                    </div>
                  </div>

                  {/* Variants Table Header */}
                  <div className="pt-4 border-t border-gray-100">
                    {isEditingTable ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-12 gap-2 px-2 pb-2">
                          <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase">
                            Variant
                          </div>
                          <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase">
                            MRP
                          </div>
                          <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase">
                            Offer
                          </div>
                          <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase">
                            Selling Price
                          </div>
                          <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase">
                            Inventory
                          </div>
                          <div className="col-span-3 text-[10px] font-bold text-gray-400 uppercase">
                            Weight
                          </div>
                        </div>

                        <div className="space-y-2">
                          {fields.map((field, index) => (
                            <VariantRow
                              key={field.id}
                              index={index}
                              isEditing={true}
                              control={control}
                              register={register}
                              setValue={setValue}
                              variantOption={activeVariantOptions
                                .map((o) => o.name)
                                .join(", ")}
                              activeField={activeField}
                              setActiveField={setActiveField}
                              setIsEditingTable={setIsEditingTable}
                            />
                          ))}
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                          <button
                            type="button"
                            onClick={() => setIsEditingTable(false)}
                            className="px-6 py-1.5 text-[10px] font-bold text-gray-400 bg-white border border-gray-100 rounded-full hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingTable(false)}
                            className="px-6 py-1.5 text-[10px] font-bold text-white bg-linear-to-r from-[#BA0820] via-[#5F1A4B] to-[#002D78] rounded-full hover:opacity-90 shadow-sm"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div className="grid grid-cols-12 w-full pr-12">
                            <span className="col-span-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              Variant
                            </span>
                            <span className="col-span-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              MRP
                            </span>
                            <span className="col-span-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              Inventory
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsEditingTable(true)}
                            className="px-3 py-1 bg-linear-to-r from-[#BA0820] via-[#5F1A4B] to-[#002D78] text-white text-[10px] font-bold rounded-full whitespace-nowrap flex gap-1 items-center"
                          >
                            <CiEdit className="size-3" />
                            {form.watch("variantOption") === "Color"
                              ? "Edit"
                              : "Bulk Edit"}
                          </button>
                        </div>

                        {/* Table Rows */}
                        <div className="space-y-px">
                          {fields.map((field, index) => (
                            <VariantRow
                              key={field.id}
                              index={index}
                              isEditing={false}
                              control={control}
                              register={register}
                              setValue={setValue}
                              variantOption={activeVariantOptions
                                .map((o) => o.name)
                                .join(", ")}
                              activeField={activeField}
                              setActiveField={setActiveField}
                              setIsEditingTable={setIsEditingTable}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="hidden md:block col-span-4 space-y-3">
            <div className="p-5 lg:p-6 shadow-sm border border-[#EAEAEA] rounded-lg space-y-4">
              <h2 className="text-xs lg:text-sm font-bold text-gray-900">
                Product Organization
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:space-y-6">
                <Input
                  label="Brand Manufacturer"
                  placeholder="Brand name"
                  {...register("brand")}
                  error={errors.brand?.message}
                  required
                  className="text-xs lg:text-sm"
                />
                <Select
                  label="Add Warranty"
                  options={WARRANTY_OPTIONS}
                  {...register("warranty")}
                  error={errors.warranty?.message}
                  required
                  placeholder="Time period"
                  className="h-10 lg:h-11 text-xs lg:text-sm"
                />
              </div>
              <Input
                label="Seller Name"
                {...register("sellerName")}
                defaultValue="Sagar Sports Club"
                readOnly
                className="bg-[#F8F9FA] border-none text-[#1a1a1a] font-medium h-10 lg:h-11 text-xs lg:text-sm"
              />
              <div className="space-y-1.5">
                <label className="text-[10px] lg:text-sm font-bold text-gray-900">
                  Tags
                </label>
                <div className="w-full relative h-10 lg:h-11 bg-[#F8F9FA] rounded-md px-4 flex items-center">
                  <input
                    value={currentTag}
                    onFocus={() => setActiveField("tags")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => {
                      setCurrentTag(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && currentTag.trim() !== "") {
                        e.preventDefault();
                        if (!tags.includes(currentTag.trim())) {
                          setTags((prev) => [...prev, currentTag.trim()]);
                        }
                        setCurrentTag("");
                      }
                    }}
                    className="bg-transparent border-none text-[10px] lg:text-sm placeholder:text-gray-400 focus:outline-none w-full"
                    placeholder="Tags"
                  />
                  {currentTag && (
                    <div
                      className="bg-gray-300 absolute -bottom-full left-0 right-0 h-full rounded-sm px-2 flex items-center cursor-pointer z-10"
                      onClick={() => {
                        if (!tags.includes(currentTag.trim())) {
                          setTags((prev) => [...prev, currentTag.trim()]);
                        }
                        setCurrentTag("");
                      }}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      {`Add ${currentTag}`}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-red-200 flex justify-between items-center w-fit gap-2 h-5 text-sm px-1 rounded"
                    >
                      {tag}
                      <XCircle
                        className="size-2 cursor-pointer"
                        onClick={() =>
                          setTags(tags.filter((_, i) => i !== index))
                        }
                      />
                    </span>
                  ))}
                </div>
                {errors.tags && (
                  <p className="text-xs text-red-500 mt-1 font-medium italic">
                    {errors.tags.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-5 border border-[#EAEAEA] rounded-lg space-y-2">
                <label className="text-[10px] font-bold text-gray-900">
                  Material and Care
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                {showMaterialTextarea ? (
                  <div className="space-y-2">
                    <Textarea
                      label="Custom Material & Care"
                      {...register("materialAndCare")}
                      className="h-24 text-[10px]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowMaterialTextarea(false);
                        setValue("materialAndCare", "");
                      }}
                      className="text-[10px] text-[#273C8A] font-bold"
                    >
                      Reset to options
                    </button>
                  </div>
                ) : (
                  <Select
                    options={MATERIAL_OPTIONS}
                    value={form.watch("materialAndCare")}
                    onChange={(e) => {
                      if (e.target.value === "Other") {
                        setShowMaterialTextarea(true);
                        setValue("materialAndCare", "");
                      } else {
                        setValue("materialAndCare", e.target.value);
                      }
                    }}
                    placeholder="Enter product materials and care instructions (e.g., 100% cotton, machine wash cold)"
                    className="h-12 bg-[#F8F9FA] border border-[#EAEAEA] rounded-lg text-[10px] font-medium"
                    error={errors.materialAndCare?.message}
                  />
                )}
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-8 space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-900">
                      Product weight
                      <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        step="0.001"
                        {...register("weight", { valueAsNumber: true })}
                        placeholder="0.0"
                        className="w-[60%] h-10 bg-white border border-[#EAEAEA] rounded-lg px-3 text-[10px] font-medium focus:outline-none"
                      />
                      <select
                        {...register("weightUnit")}
                        className="flex-1 bg-white border border-[#EAEAEA] rounded-lg px-2 text-[10px] font-bold focus:outline-none text-[#1a1a1a]"
                      >
                        <option value="Kg">Kg</option>
                        <option value="G">G</option>
                      </select>
                    </div>
                    {errors.weight && (
                      <p className="text-xs text-red-500 mt-1 font-medium">
                        {errors.weight.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-4 border border-[#EAEAEA] rounded-lg flex justify-between items-center p-3">
              <label className="text-[10px] font-bold text-gray-900">
                Stock Quantity<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="number"
                {...register("stockQuantity", { valueAsNumber: true })}
                placeholder="100"
                className="p-2 bg-white border border-[#EAEAEA] rounded-lg text-[10px] font-medium focus:outline-none"
              />
              {errors.stockQuantity && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.stockQuantity.message}
                </p>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
