/// src\components\ImageUploadButton.tsx

"use client";

import {
  CldUploadButton,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { HiPhoto } from "react-icons/hi2";

type Props = {
  onUploadImage: (result: CloudinaryUploadWidgetResults) => void;
  uploadPreset: string;
};

export default function ImageUploadButton({
  onUploadImage,
  uploadPreset,
}: Props) {
  return (
    <CldUploadButton
      options={{ maxFiles: 1 }}
      onSuccess={onUploadImage}
      signatureEndpoint="/api/sign-image"
      uploadPreset={uploadPreset}
      className={`flex items-center gap-2 border-2 border-default text-default 
        rounded-lg py-2 px-4 hover:bg-default/10`}
    >
      <HiPhoto size={28} />
      Upload new image
    </CldUploadButton>
  );
}
