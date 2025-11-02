// src/app/(auth)/complete-profile/CompleteProfileForm.tsx
"use client";

import { useState } from "react";
import {
  ProfileDetailsSchema,
  profileDetailsSchema,
} from "@/lib/schemas/RegisterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { completeSocialLoginProfile } from "@/actions/authActions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BirthdayPicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, User } from "lucide-react";
import Image from "next/image";
import {
  CldUploadButton,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "react-toastify";

export default function CompleteProfileForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();

  const methods = useForm<ProfileDetailsSchema>({
    resolver: zodResolver(profileDetailsSchema),
    mode: "onTouched",
  });

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = methods;

  const handleCloudinaryUpload = (result: CloudinaryUploadWidgetResults) => {
    if (result.info && typeof result.info === "object") {
      const imageUrl = result.info.secure_url;
      const publicId = result.info.public_id;

      setPreviewImage(imageUrl);
      setValue("profileImageUrl", imageUrl);
      setValue("profileImagePublicId", publicId);
    }
  };

  const onSubmit = async (data: ProfileDetailsSchema) => {
    console.log("📝 Form submitted with data:", data);
    setIsSubmitting(true);

    try {
      const result = await completeSocialLoginProfile(data);

      if (result.status === "success") {
        toast.success("Profile completed! Redirecting...");

        await router.refresh();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/networks");
      } else {
        console.error("Error from server:", result.error);
        toast.error(result.error as string);
      }
    } catch (error) {
      console.error("Exception caught:", error);
      toast.error("An error occurred. Check console logs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Complete your profile</CardTitle>
        <CardDescription>Tell us about yourself</CardDescription>
      </CardHeader>

      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center space-y-4 mb-6">
                <div className="relative group">
                  {previewImage ? (
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                      <Image
                        src={previewImage}
                        alt="Profile preview"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center border-4 border-primary/20 shadow-lg">
                      <User className="w-12 h-12 text-indigo-400" />
                    </div>
                  )}
                </div>

                <CldUploadButton
                  options={{
                    maxFiles: 1,
                  }}
                  onSuccess={handleCloudinaryUpload}
                  signatureEndpoint="/api/sign-image"
                  uploadPreset="builder-devmatch-profiles"
                  className="flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Upload className="w-4 h-4" />
                  {previewImage ? "Change Photo" : "Upload Photo"}
                </CldUploadButton>

                <FieldDescription className="text-center">
                  Upload your best photo • JPG, PNG, WebP • Max 10MB
                </FieldDescription>
              </div>

              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan Dela Cruz"
                  className={cn(errors.name && "border-destructive")}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.name.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="age">Age</FieldLabel>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  className={cn(errors.age && "border-destructive")}
                  {...register("age", { valueAsNumber: true })}
                />
                {errors.age && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.age.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel>Gender</FieldLabel>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <SelectTrigger
                        className={cn(errors.gender && "border-destructive")}
                      >
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="prefer-not-to-say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel>Date of Birth</FieldLabel>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <BirthdayPicker
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.dateOfBirth}
                    />
                  )}
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="city">City</FieldLabel>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Manila"
                    className={cn(errors.city && "border-destructive")}
                    {...register("city")}
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="country">Country</FieldLabel>
                  <Input
                    id="country"
                    type="text"
                    placeholder="Philippines"
                    className={cn(errors.country && "border-destructive")}
                    {...register("country")}
                  />
                  {errors.country && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="bio">Short Bio</FieldLabel>
                <Textarea
                  id="bio"
                  placeholder="Who are you, what do u like to do, and what are you looking for?"
                  className={cn(errors.bio && "border-destructive")}
                  rows={4}
                  {...register("bio")}
                />
                {errors.bio && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.bio.message}
                  </p>
                )}
                <FieldDescription>
                  Describe yourself, your hobbies, personality, life...
                </FieldDescription>
              </Field>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={router.back}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Completing registration...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
