"use client";

import React, { useCallback, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";

interface ImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
  error?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesChange,
  maxImages = 10,
  error,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const newUrls = files
        .slice(0, maxImages - images.length)
        .map((file) => URL.createObjectURL(file));
      const updated = [...images, ...newUrls];
      setImages(updated);
      onImagesChange(updated);
    },
    [images, maxImages, onImagesChange]
  );

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-[#1a1a1a]">
          Product Images<span className="text-red-500">*</span>
        </label>
        <span className="text-[10px] text-gray-400 font-bold bg-[#F8F9FA] px-2 py-0.5 rounded">
          {images.length}/{maxImages}
        </span>
      </div>

      <div className="flex flex-wrap gap-4">
        {images.map((url, index) => (
          <div
            key={index}
            className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#EAEAEA] group"
          >
            <Image
              src={url}
              alt={`Upload ${index}`}
              fill
              className="object-cover"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 p-0.5 bg-white border border-[#A1001A] rounded-full text-[#A1001A]"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <label
            className={cn(
              "flex flex-col items-center justify-center border border-[#EAEAEA] rounded-lg bg-[#F8F9FA] cursor-pointer hover:bg-gray-50 transition-colors",
              images.length === 0
                ? "w-full h-32 border-2 border-dashed"
                : "w-24 h-24",
              isDragging && "border-[#273C8A] bg-[#f8faff]"
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const files = Array.from(e.dataTransfer.files);
              const newUrls = files
                .slice(0, maxImages - images.length)
                .map((file) => URL.createObjectURL(file));
              const updated = [...images, ...newUrls];
              setImages(updated);
              onImagesChange(updated);
            }}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {images.length === 0 ? (
              <div className="flex flex-col items-center gap-2 text-center">
                <Upload className="w-6 h-6 text-[#A1001A]" />
                <div>
                  <p className="text-sm font-bold text-[#A1001A]">Add Media</p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Upload images or videos of this product.
                  </p>
                </div>
              </div>
            ) : (
              <ImageIcon className="w-8 h-8 text-gray-300" />
            )}
          </label>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 font-medium px-1">{error}</p>
      )}
    </div>
  );
};
