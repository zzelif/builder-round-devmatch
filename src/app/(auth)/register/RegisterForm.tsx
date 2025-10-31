// src/app/(auth)/register/RegisterForm.tsx - FIXED RESOLVER TYPE
"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { registerUser } from "@/actions/authActions";
import {
  combinedRegisterSchema,
  RegisterSchema,
} from "@/lib/schemas/RegisterSchema";
import UserDetailsStep from "./UserDetailsStep";
import ProfileDetailsStep from "./ProfileDetailsStep";

export default function RegisterForm() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const registerFormMethods = useForm<RegisterSchema>({
    resolver: zodResolver(combinedRegisterSchema),
    mode: "onTouched",
  });

  const {
    handleSubmit,
    getValues,
    setError,
    trigger,
    formState: { errors },
  } = registerFormMethods;

  const onNext = async () => {
    // ✅ Validate current step
    const currentStepFields =
      step === 0
        ? (["email", "password", "confirmPassword"] as const)
        : ([
            "name",
            "age",
            "gender",
            "dateOfBirth",
            "city",
            "country",
            "bio",
          ] as const);

    const isStepValid = await trigger(currentStepFields);

    if (!isStepValid) return;

    if (step === 1) {
      // Last step
      const formData = getValues();
      const result = await registerUser(formData);

      if (result.status === "success") {
        router.push("/register/success");
      } else {
        if (typeof result.error === "string") {
          setError("root.serverError", { message: result.error });
        }
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          {step === 0 ? "Create your account" : "Complete your profile"}
        </CardTitle>
        <CardDescription>
          {step === 0
            ? "Enter your email and password to get started"
            : "Tell us about yourself"}
        </CardDescription>

        <div className="flex justify-center gap-2 mt-4">
          {[0, 1].map((index) => (
            <div
              key={index}
              className={cn(
                "h-2 w-20 rounded-full transition-all",
                index <= step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <FormProvider {...registerFormMethods}>
          <form onSubmit={handleSubmit(onNext)} noValidate>
            {step === 0 ? (
              <UserDetailsStep />
            ) : (
              <ProfileDetailsStep onBack={() => setStep(0)} />
            )}
            {errors.root?.serverError && (
              <p className="text-sm text-destructive mt-4 text-center">
                {errors.root.serverError.message}
              </p>
            )}
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
