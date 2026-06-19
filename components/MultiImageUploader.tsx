// components/MultiImageUploader.tsx
"use client";

import { useState } from "react";
import { X, Loader2, ImagePlus } from "lucide-react";

export interface DishImage {
  url: string;
  publicId: string;
}

interface Props {
  images: DishImage[];
  onChange: (images: DishImage[]) => void;
  maxImages?: number;
}

export default function MultiImageUploader({
  images,
  onChange,
  maxImages = 6,
}: Props) {
  const [uploadingCount, setUploadingCount] = useState(0);

  async function uploadOne(file: File): Promise<DishImage> {
    const { timestamp, signature, apiKey, cloudName } = await fetch(
      "/api/sign-upload",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "lacasitadelapaella/dishes" }),
      },
    ).then((r) => r.json());

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", "lacasitadelapaella/dishes");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData },
    );

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Cloudinary error:", res.status, errorBody);
      throw new Error("Échec de l'upload vers Cloudinary");
    }

    const data = await res.json();
    return { url: data.secure_url, publicId: data.public_id };
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList).slice(
      0,
      Math.max(0, maxImages - images.length),
    );
    if (files.length === 0) return;

    setUploadingCount(files.length);

    try {
      const uploaded = await Promise.all(files.map(uploadOne));
      onChange([...images, ...uploaded]);
    } catch (err) {
      console.error(err);
      alert("Une ou plusieurs images n'ont pas pu être uploadées.");
    } finally {
      setUploadingCount(0);
    }
  }

  function removeImage(publicId: string) {
    onChange(images.filter((img) => img.publicId !== publicId));
  }

  const canAddMore = images.length < maxImages;

  return (
    <div>
      <label className="block text-xs text-stone-400 mb-2">
        Images du plat ({images.length}/{maxImages})
      </label>

      <div className="grid grid-cols-3 gap-3">
        {images.map((img) => (
          <div
            key={img.publicId}
            className="relative aspect-square rounded-lg overflow-hidden border border-stone-700 group"
          >
            <img src={img.url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(img.publicId)}
              className="absolute top-1 right-1 bg-stone-950/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              aria-label="Supprimer l'image"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {Array.from({ length: uploadingCount }).map((_, i) => (
          <div
            key={`uploading-${i}`}
            className="aspect-square rounded-lg border border-dashed border-stone-700 flex items-center justify-center bg-stone-800"
          >
            <Loader2 size={20} className="animate-spin text-amber-500" />
          </div>
        ))}

        {canAddMore && uploadingCount === 0 && (
          <label className="aspect-square rounded-lg border border-dashed border-stone-700 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-amber-600 transition text-stone-400 hover:text-amber-500">
            <ImagePlus size={20} />
            <span className="text-[10px]">Ajouter</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        )}
      </div>
    </div>
  );
}
