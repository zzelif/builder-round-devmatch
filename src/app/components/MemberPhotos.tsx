// src/components/MemberPhotos.tsx - FIXED TYPESCRIPT ISSUES
"use client";

import { Button } from "@/components/ui/button";
import { deleteImage, setMainImage } from "@/actions/userActions";
import { Photo } from "@prisma/client";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
// import { FaImage } from "react-icons/fa";

type Props = {
  photos: Photo[] | null;
  editing?: boolean;
  mainImageUrl?: string | null;
};

export default function MemberPhotos({ photos, editing, mainImageUrl }: Props) {
  const [loading, setLoading] = useState({
    type: "",
    isLoading: false,
    id: "",
  });
  const [, startTransition] = useTransition();
  const router = useRouter();

  const onSetMain = (photo: Photo) => {
    if (photo.url === mainImageUrl) return null;

    setLoading({ isLoading: true, id: photo.id, type: "main" });

    startTransition(() => {
      setMainImage(photo)
        .then(() => {
          toast.success("Main image updated successfully");
          router.refresh();
        })
        .catch((error: Error) => {
          console.error("Set main image error:", error);
          toast.error(error.message);
        })
        .finally(() => {
          setLoading({ isLoading: false, id: "", type: "" });
        });
    });
  };

  const onDelete = (photo: Photo) => {
    if (photo.url === mainImageUrl) return;

    setLoading({ isLoading: true, id: photo.id, type: "delete" });

    startTransition(() => {
      deleteImage(photo)
        .then(() => {
          toast.success("Image deleted successfully");
          router.refresh();
        })
        .catch((error: Error) => {
          console.error("Delete image error:", error);
          toast.error(error.message);
        })
        .finally(() => {
          setLoading({ isLoading: false, id: "", type: "" });
        });
    });
  };

  return (
    <div className="grid grid-cols-5 gap-3 p-5">
      {photos &&
        photos.map((photo) => (
          <div key={photo.id} className="relative">
            <div className="aspect-square relative overflow-hidden rounded-lg">
              {photo.publicId ? (
                <CldImage
                  alt="member image"
                  src={photo.publicId}
                  fill
                  className="object-cover"
                />
              ) : (
                <Image
                  src={photo.url}
                  fill
                  alt="member image"
                  className="object-cover"
                />
              )}
            </div>
            {editing && (
              <div className="flex flex-row gap-2 mt-2">
                <Button
                  onClick={() => onSetMain(photo)}
                  size="sm"
                  variant={photo.url === mainImageUrl ? "default" : "secondary"}
                  disabled={
                    loading.isLoading &&
                    loading.id === photo.id &&
                    loading.type === "main"
                  }
                >
                  {loading.isLoading &&
                  loading.id === photo.id &&
                  loading.type === "main"
                    ? "Loading..."
                    : photo.url === mainImageUrl
                    ? "Main"
                    : "Main"}
                </Button>
                <Button
                  onClick={() => onDelete(photo)}
                  variant="outline"
                  size="sm"
                  disabled={
                    photo.url === mainImageUrl ||
                    (loading.isLoading &&
                      loading.id === photo.id &&
                      loading.type === "delete")
                  }
                >
                  {loading.isLoading &&
                  loading.id === photo.id &&
                  loading.type === "delete"
                    ? "..."
                    : "Delete"}
                </Button>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
