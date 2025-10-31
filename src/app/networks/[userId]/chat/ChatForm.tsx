"use client";

import { createMessage } from "@/actions/messageActions";
import { MessageSchema, messageSchema } from "@/lib/schemas/MessagesSchema";
import { cn, handleFormServerErrors } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { HiPaperAirplane } from "react-icons/hi2";

export default function ChatForm() {
  const router = useRouter();
  const params = useParams<{ userId: string }>();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isValid, errors },
  } = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = async (data: MessageSchema) => {
    const result = await createMessage(params.userId, data);
    if (result.status === "error") {
      handleFormServerErrors(result, setError);
    } else {
      reset();
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Type a message"
          color="faded"
          {...register("text")}
          className={cn(errors.text && "border-destructive")}
        />
        {errors.text && (
          <p className="text-sm text-destructive mt-1">{errors.text.message}</p>
        )}
        <Button
          type="submit"
          size="icon"
          color="default"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? <Spinner /> : <HiPaperAirplane size={18} />}
        </Button>
      </div>
      <div className="flex flex-col">
        {errors.root?.serverError && (
          <p className="text-danger text-sm">
            {errors.root.serverError.message}
          </p>
        )}
      </div>
    </form>
  );
}
