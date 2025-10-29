"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { RegisterSchema } from "@/lib/schemas/RegisterSchema";
import Image from "next/image";

export default function ProfileDetailsStep({ onBack }: { onBack: () => void }) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<RegisterSchema>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input
          id="name"
          type="text"
          placeholder="Juan Dela Cruz"
          className={cn(errors.name && "border-destructive")}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="age">Age</FieldLabel>
        <Input
          id="age"
          type="number"
          placeholder="18"
          className={cn(errors.age && "border-destructive")}
          {...register("age", { valueAsNumber: true })}
        />
        {errors.age && (
          <p className="text-sm text-destructive mt-1">{errors.age.message}</p>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="bio">Short bio</FieldLabel>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          className={cn(errors.bio && "border-destructive")}
          rows={4}
          {...register("bio")}
        />
        {errors.bio && (
          <p className="text-sm text-destructive mt-1">{errors.bio.message}</p>
        )}
      </Field>

      {/* <Field>
        <FieldLabel htmlFor="profilePicture">Profile Picture</FieldLabel>
        <Input
          id="profilePicture"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className={cn(errors.profilePicture && "border-destructive")}
          {...register("profilePicture", { onChange: handleImageChange })}
        />
        {previewImage && (
          <div className="mt-2 flex justify-center">
            <Image
              src={previewImage}
              alt="Preview"
              width={96}
              height={96}
              className="rounded-full object-cover border-2"
            />
          </div>
        )}
        {errors.profilePicture && (
          <p className="text-sm text-destructive mt-1">
            {errors.profilePicture.message?.toString()}
          </p>
        )}
        <FieldDescription>JPG, PNG, or WebP. Max 5MB.</FieldDescription>
      </Field> */}

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
        >
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Account"}
        </Button>
      </div>
    </FieldGroup>
  );
}
