// src/app/networks/[userId]/chat/ChatForm.tsx
"use client";

import { createMessage } from "@/actions/messageActions";
import { MessageSchema, messageSchema } from "@/lib/schemas/MessagesSchema";
import { cn, handleFormServerErrors } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

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
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <Input
            placeholder="Type a message..."
            {...register("text")}
            className={cn(
              "resize-none",
              errors.text && "border-destructive focus-visible:ring-destructive"
            )}
            disabled={isSubmitting}
          />
          {errors.text && (
            <p className="text-sm text-destructive mt-1">
              {errors.text.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={!isValid || isSubmitting}
          className="shrink-0"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
      {errors.root?.serverError && (
        <p className="text-destructive text-sm mt-2">
          {errors.root.serverError.message}
        </p>
      )}
    </form>
  );
}
