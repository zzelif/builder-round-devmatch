// src/components/MemberImage.tsx - COMPLETE COMPONENT
"use client";

import { Photo } from "@prisma/client";
import { CldImage } from "next-cloudinary";
import Image from "next/image";

type Props = {
  photo: Photo | null;
  width?: number;
  height?: number;
  className?: string;
};

export default function MemberImage({
  photo,
  width = 300,
  height = 300,
  className = "",
}: Props) {
  if (!photo) {
    return (
      <div
        className={`${className} bg-linear-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center`}
      >
        <div className="text-4xl opacity-40">👤</div>
      </div>
    );
  }

  return (
    <div className={className}>
      {photo.publicId ? (
        <CldImage
          alt="Member profile photo"
          src={photo.publicId}
          width={width}
          height={height}
          className="object-cover w-full h-full"
          crop="fill"
          gravity="face"
        />
      ) : (
        <Image
          src={photo.url || "/images/user.png"}
          alt="Member profile photo"
          width={width}
          height={height}
          className="object-cover w-full h-full"
        />
      )}
    </div>
  );
}
