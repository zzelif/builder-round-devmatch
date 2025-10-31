// src/app/networks/[userId]/chat/MessageBox.tsx
"use client";

import { MessageDto } from "@/types";
import clsx from "clsx";
import { timeAgo } from "@/lib/utils";
import PresenceAvatar from "@/components/PresenceAvatar";

type Props = {
  message: MessageDto;
  currentUserId: string;
};

export default function MessageBox({ message, currentUserId }: Props) {
  const isCurrentUserSender = message.senderId === currentUserId;

  const renderAvatar = () => (
    <div className="self-end">
      <PresenceAvatar src={message.senderImage} userId={message.senderId} />
    </div>
  );

  const messageContentClasses = clsx(
    "flex flex-col w-[50%] px-3 py-2 rounded-lg",
    {
      "bg-blue-500 text-white rounded-br-none": isCurrentUserSender,
      "bg-gray-100 text-gray-900 rounded-bl-none": !isCurrentUserSender,
    }
  );

  const renderMessageHeader = () => (
    <div
      className={clsx("flex items-center w-full", {
        "justify-between": isCurrentUserSender,
      })}
    >
      {message.dateRead && message.recipientId !== currentUserId ? (
        <span className="text-xs opacity-75 italic">
          (Read {timeAgo(message.dateRead)})
        </span>
      ) : (
        <div></div>
      )}
      <div className="flex">
        <span
          className={clsx("text-sm font-semibold", {
            "text-white": isCurrentUserSender,
            "text-gray-900": !isCurrentUserSender,
          })}
        >
          {message.senderName}
        </span>
        <span
          className={clsx("text-xs ml-2 opacity-75", {
            "text-white": isCurrentUserSender,
            "text-gray-500": !isCurrentUserSender,
          })}
        >
          {message.created}
        </span>
      </div>
    </div>
  );

  const renderMessageContent = () => {
    return (
      <div className={messageContentClasses}>
        {renderMessageHeader()}
        <p
          className={clsx("text-sm py-1", {
            "text-white": isCurrentUserSender,
            "text-gray-900": !isCurrentUserSender,
          })}
        >
          {message.text}
        </p>
      </div>
    );
  };

  return (
    <div
      className={clsx("flex gap-3 mb-4", {
        "justify-end": isCurrentUserSender,
        "justify-start": !isCurrentUserSender,
      })}
    >
      {!isCurrentUserSender && renderAvatar()}
      {renderMessageContent()}
      {isCurrentUserSender && renderAvatar()}
    </div>
  );
}
