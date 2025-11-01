// src\app\networks\edit\photos\MemberPhotoUpload.tsx

"use client";

import { addImage } from "@/actions/userActions";
import ImageUploadButton from "@/components/ImageUploadButton";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function MemberPhotoUpload() {
  const router = useRouter();

  const onAddImage = async (result: CloudinaryUploadWidgetResults) => {
    if (result.info && typeof result.info === "object") {
      await addImage(result.info.secure_url, result.info.public_id);
      router.refresh();
    } else {
      toast.error("Problem adding image");
    }
  };
  return (
    <div className="p-5">
      <ImageUploadButton
        onUploadImage={onAddImage}
        uploadPreset="builder-devmatch-photos"
      />
    </div>
  );
}
