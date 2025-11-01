// src/app/networks/[userId]/chat/MessageBox.tsx
"use client";

import { MessageDto } from "@/types";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils";
import PresenceAvatar from "@/components/PresenceAvatar";
import { Check, CheckCheck } from "lucide-react";

type Props = {
  message: MessageDto;
  currentUserId: string;
};

export default function MessageBox({ message, currentUserId }: Props) {
  const isCurrentUserSender = message.senderId === currentUserId;
  const isRead = !!message.dateRead;

  // Generate tooltip text
  const getTooltipText = (): string | undefined => {
    if (!isCurrentUserSender) return undefined;
    if (isRead && message.dateRead) {
      return `Read ${timeAgo(message.dateRead)}`;
    }
    return "Delivered";
  };

  return (
    <div
      className={cn("flex gap-3 mb-4", {
        "justify-end": isCurrentUserSender,
        "justify-start": !isCurrentUserSender,
      })}
    >
      {/* Avatar - Left side (other user) */}
      {!isCurrentUserSender && (
        <div className="shrink-0">
          <PresenceAvatar
            src={message.senderImage}
            userId={message.senderId}
            name={message.senderName}
            size="md"
          />
        </div>
      )}

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col max-w-[70%] px-4 py-2 rounded-2xl transition-all group",
          isCurrentUserSender
            ? "bg-primary text-primary-foreground rounded-br-md hover:shadow-lg"
            : "bg-accent text-foreground rounded-bl-md hover:shadow-md dark:bg-muted-foreground/30"
        )}
        title={getTooltipText()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-semibold opacity-90">
            {message.senderName}
          </span>
          <span className="text-xs opacity-70">{message.created}</span>
        </div>

        {/* Message Text */}
        <p className="text-sm  wrap-break-word">{message.text}</p>

        {/* Read status for sent messages */}
        {isCurrentUserSender && (
          <div className="flex justify-end mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
            {isRead ? (
              <div
                title={
                  message.dateRead
                    ? `Read ${timeAgo(message.dateRead)}`
                    : "Read"
                }
              >
                <CheckCheck className="w-3.5 h-3.5" />
              </div>
            ) : (
              <div title="Delivered">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Avatar - Right side (current user) */}
      {isCurrentUserSender && (
        <div className="shrink-0">
          <PresenceAvatar
            src={message.senderImage}
            userId={message.senderId}
            name={message.senderName}
            size="md"
          />
        </div>
      )}
    </div>
  );
}
