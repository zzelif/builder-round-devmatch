"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerSchema, RegisterSchema } from "@/lib/schemas/RegisterSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

export default function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isValid, errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: RegisterSchema) => {
    console.log(data);
  };

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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan Dela Cruz"
                  className={cn(errors.email && "border-destructive")}
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
                  placeholder="18"
                  className={cn(errors.age && "border-destructive")}
                  {...register("age")}
                />
                {errors.age && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.age.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="bio">Short bio</FieldLabel>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself, your style, what you're looking for..."
                  className={cn(errors.bio && "border-destructive")}
                  rows={4}
                  {...register("bio")}
                />
                {errors.bio && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.bio.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="profilePicture">
                  Profile Picture
                </FieldLabel>
                <Input
                  id="profilePicture"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className={cn(errors.profilePicture && "border-destructive")}
                  {...register("profilePicture", {
                    onChange: handleImageChange,
                  })}
                />
                {previewImage && (
                  <div className="mt-2">
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
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className={cn(errors.email && "border-destructive")}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.email.message}
                  </p>
                )}
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      className={cn(errors.password && "border-destructive")}
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className={cn(
                        errors.confirmPassword && "border-destructive"
                      )}
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 6 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting || !isValid}>
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="/login">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
