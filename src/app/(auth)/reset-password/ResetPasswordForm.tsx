// src/app/(auth)/reset-password/ResetPasswordForm.tsx
"use client";

import { resetPassword } from "@/actions/authActions";
import {
  ResetPasswordSchema,
  resetPasswordSchema,
} from "@/lib/schemas/ForgotPasswordSchema";
import { ActionResult } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ResultMessage from "@/components/ResultMessage";
import { Loader2 } from "lucide-react";
import CardWrapper from "@/components/CardWrapper";
import { cn } from "@/lib/utils";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<ActionResult<string> | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetPasswordSchema>({
    mode: "onTouched",
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    setResult(await resetPassword(data.password, searchParams.get("token")));
    reset();
  };

  return (
    <CardWrapper
      headerIcon={GiPadlock}
      headerText="Reset password"
      subHeaderText="Enter your new password below"
      body={
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              className={cn(errors.password && "border-destructive")}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Confirm Password"
              className={cn(errors.confirmPassword && "border-destructive")}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      }
      footer={<ResultMessage result={result} />}
    />
  );
}
