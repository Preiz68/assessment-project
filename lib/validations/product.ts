import { z } from "zod";

export const productSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(150, "Title must be less than 150 characters"),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Sub-category is required"),
  description: z.string().min(1, "Description is required"),
  mrp: z.number().min(1, "MRP is required"),
  offerPercentage: z
    .number()
    .min(0)
    .max(100, "Offer percentage must be between 0 and 100")
    .optional(),
  sellingPrice: z.number().min(1, "Selling price is required").optional(),
  brand: z.string().min(1, "Brand is required").optional(),
  warranty: z.string().min(1, "Warranty is required"),
  sellerName: z.string().min(1, "Seller name is required"),
  tags: z.array(z.string()).optional(),
  materialAndCare: z.string().min(1, "Material and care info is required"),
  weight: z.number().min(0, "Weight must be positive"),
  weightUnit: z.string().min(1, "Weight unit is required"),
  stockQuantity: z
    .number()
    .int()
    .min(0, "Stock must be a non-negative integer"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  variantOption: z.string().optional(),
  selectedVariantValues: z.array(z.string()).optional(),
  variantsData: z
    .array(
      z.object({
        name: z.string(),
        mrp: z.number().min(0),
        offerPercentage: z.number().min(0).max(100),
        sellingPrice: z.number().min(0),
        inventory: z.number().min(0),
        weight: z.number().min(0),
      })
    )
    .optional(),
  variant: z.array(z.array(z.string())).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
