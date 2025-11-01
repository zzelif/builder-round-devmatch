"use client";

import { useEffect } from "react";
import { Member } from "@/generated/prisma";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditSchema, editSchema } from "@/lib/schemas/EditSchema";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { cn, handleFormServerErrors } from "@/lib/utils";
import { updateMemberProfile } from "@/actions/userActions";

type Props = {
  member: Member;
};

const dbToFormGender = (dbGender: string): EditSchema["gender"] => {
  switch (dbGender) {
    case "MALE":
      return "male";
    case "FEMALE":
      return "female";
    case "NON_BINARY":
      return "non-binary";
    case "PREFER_NOT_TO_SAY":
      return "prefer-not-to-say";
    default:
      return "male";
  }
};

const getGenderDisplayText = (genderValue: string): string => {
  switch (genderValue) {
    case "male":
      return "Male";
    case "female":
      return "Female";
    case "non-binary":
      return "Non-binary";
    case "prefer-not-to-say":
      return "Prefer not to say";
    default:
      return "Select gender";
  }
};

export default function EditForm({ member }: Props) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<EditSchema>({
    resolver: zodResolver(editSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (member) {
      reset({
        name: member.name,
        gender: dbToFormGender(member.gender),
        bio: member.bio,
        city: member.city,
        country: member.country,
      });
    }
  }, [member, reset]);

  const onSubmit = async (data: EditSchema) => {
    const nameUpdated = data.name !== member.name;
    const result = await updateMemberProfile(data, nameUpdated);

    if (result.status === "success") {
      toast.success("Profile updated");
      router.refresh();
      reset({ ...data });
    } else {
      handleFormServerErrors(result, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            type="text"
            {...register("name")}
            defaultValue={member.name}
            className={cn(errors.name && "border-destructive")}
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">
              {errors.name.message}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel>Gender</FieldLabel>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  className={cn(errors.gender && "border-destructive")}
                >
                  <SelectValue
                    placeholder={getGenderDisplayText(
                      dbToFormGender(member.gender)
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Genders</SelectLabel>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      Prefer not to say
                    </SelectItem>
                  </SelectGroup>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="city">City</FieldLabel>
            <Input
              id="city"
              type="text"
              defaultValue={member.city}
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
              defaultValue={member.country}
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
          <FieldLabel htmlFor="bio">Short bio</FieldLabel>
          <Textarea
            id="bio"
            {...register("bio")}
            defaultValue={member.bio}
            className={cn(errors.bio && "border-destructive")}
            rows={4}
          />
          {errors.bio && (
            <p className="text-sm text-destructive mt-1">
              {errors.bio.message}
            </p>
          )}
        </Field>

        <Button
          type="submit"
          className="flex self-end bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          disabled={!isDirty || isSubmitting || !isValid}
        >
          {isSubmitting ? "Updating..." : "Update Profile"}
        </Button>
      </FieldGroup>
    </form>
  );
}
