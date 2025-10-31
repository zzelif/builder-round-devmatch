"use client";

import { useEffect } from "react";
import { Member } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
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

export default function EditForm({ member }: Props) {
  const router = useRouter();
  const {
    register,
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
        age: member.age,
        bio: member.bio,
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
          <FieldLabel htmlFor="age">Age</FieldLabel>
          <Input
            id="age"
            type="number"
            {...register("age", { valueAsNumber: true })}
            defaultValue={member.age}
            className={cn(errors.age && "border-destructive")}
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
          className="flex self-end"
          disabled={!isValid || !isDirty}
        >
          {isSubmitting ? "Updating..." : "Update Account"}
        </Button>
      </FieldGroup>
    </form>
  );
}
