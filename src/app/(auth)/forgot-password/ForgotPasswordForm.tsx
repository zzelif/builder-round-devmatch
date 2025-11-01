"use client";

import { generateResetPasswordEmail } from "@/actions/authActions";
import CardWrapper from "@/components/CardWrapper";
import ResultMessage from "@/components/ResultMessage";
import { ActionResult } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";
import { Spinner } from "@/components/ui/spinner";

export default function ForgotPasswordForm() {
  const [result, setResult] = useState<ActionResult<string> | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    setResult(await generateResetPasswordEmail(data.email));
    reset();
  };

  return (
    <CardWrapper
      headerIcon={GiPadlock}
      headerText="Forgot password"
      subHeaderText="Enter account email to reset your password"
      body={
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <Input
            type="email"
            placeholder="Email address"
            defaultValue=""
            {...register("email", {
              required: true,
            })}
          />
          <Button type="submit" disabled={!isValid} className="w-full">
            {isSubmitting ? (
              <>
                <Spinner />
                Sending...
              </>
            ) : (
              "Send reset email"
            )}
          </Button>
        </form>
      }
      footer={<ResultMessage result={result} />}
    />
  );
}
