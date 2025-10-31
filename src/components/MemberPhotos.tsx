// src/components/MemberPhotos.tsx - COMPLETE PHOTO MANAGEMENT
"use client";

import { Photo } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { CldImage } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Star, Trash2, Loader2 } from "lucide-react";
import { setMainImage, deleteImage } from "@/actions/userActions";
import Image from "next/image";

type Props = {
  photos: Photo[] | null;
  editing?: boolean;
  mainImageUrl?: string | null;
};

export default function MemberPhotos({ photos, editing, mainImageUrl }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState({
    type: "",
    isLoading: false,
    id: "",
  });

  const onSetMain = async (photo: Photo) => {
    if (photo.url === mainImageUrl) return;

    setLoading({
      isLoading: true,
      id: photo.id,
      type: "main",
    });

    try {
      await setMainImage(photo);
      toast.success("Profile photo updated!");
      router.refresh();
    } catch (error: any) {
      toast.error("Failed to set main photo");
    } finally {
      setLoading({
        isLoading: false,
        id: "",
        type: "",
      });
    }
  };

  const onDelete = async (photo: Photo) => {
    if (photo.url === mainImageUrl) return null;
    setLoading({
      isLoading: true,
      id: photo.id,
      type: "delete",
    });
    try {
      await deleteImage(photo);
      toast.success("Successfully deleted the photo");
      router.refresh();
    } catch (error: any) {
      toast.error("Failed too delete photo");
    } finally {
      setLoading({
        isLoading: false,
        id: "",
        type: "",
      });
    }
  };

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="text-2xl opacity-40">📸</div>
        </div>
        <p className="text-gray-500">No photos uploaded yet</p>
        {editing && (
          <p className="text-sm text-gray-400 mt-2">
            Upload photos to make your profile more attractive
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="relative group aspect-square">
          {photo.publicId ? (
            <CldImage
              alt="Member photo"
              src={photo.publicId}
              fill
              className="object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <Image
              src={photo.url}
              alt="Member photo"
              className="w-full h-full object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
              unoptimized
            />
          )}

          {/* Main Photo Indicator */}
          {photo.url === mainImageUrl && (
            <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full shadow-lg">
              ✨ Profile
            </div>
          )}

          {/* Action Buttons (Show on editing mode) */}
          {editing && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              {photo.url !== mainImageUrl && (
                <Button
                  size="sm"
                  onClick={() => onSetMain(photo)}
                  disabled={loading.isLoading && loading.id === photo.id}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/20"
                >
                  {loading.isLoading &&
                  loading.id === photo.id &&
                  loading.type === "main" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Star className="w-4 h-4 mr-1" />
                      Set Main
                    </>
                  )}
                </Button>
              )}

              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(photo)}
                disabled={loading.isLoading && loading.id === photo.id}
                className="bg-red-500/80 backdrop-blur-sm hover:bg-red-600/80 text-white"
              >
                {loading.isLoading &&
                loading.id === photo.id &&
                loading.type === "delete" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
