"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { RegisterSchema } from "@/lib/schemas/RegisterSchema";

export default function UserDetailsStep() {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<RegisterSchema>();

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
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
        <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
        <Input
          id="confirmPassword"
          type="password"
          className={cn(errors.confirmPassword && "border-destructive")}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
        <FieldDescription>Must be at least 6 characters long.</FieldDescription>
      </Field>

      <Field>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Next
        </Button>
        <FieldDescription className="text-center">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Sign in
          </a>
        </FieldDescription>
      </Field>
    </FieldGroup>
  );
}
