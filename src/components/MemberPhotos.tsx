"use client";

import { Photo } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

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
    if (photo.url === mainImageUrl) return null;
    setLoading({
      isLoading: true,
      id: photo.id,
      type: "main",
    });

    try {
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
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

    router.refresh();
    setLoading({
      isLoading: false,
      id: "",
      type: "",
    });
  };

  return <div>Photos</div>;
}
