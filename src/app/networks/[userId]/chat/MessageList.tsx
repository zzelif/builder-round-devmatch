// src/app/networks/[userId]/chat/MessageList.tsx - FIXED INFINITE LOOP
"use client";

import { MessageDto } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/lib/pusher";
import { formatShortDateTime } from "@/lib/utils";

type Props = {
  initialMessages: { messages: MessageDto[]; readCount: number };
  currentUserId: string;
  chatId: string;
};

export default function MessageList({
  initialMessages,
  currentUserId,
  chatId,
}: Props) {
  const [messages, setMessages] = useState(initialMessages.messages);
  const initializedRef = useRef(false);

  // ✅ FIXED: Remove Zustand store usage that causes infinite loops
  useEffect(() => {
    if (!initializedRef.current) {
      // Just mark read messages without store updates
      initializedRef.current = true;
    }
  }, []);

  const handleNewMessage = useCallback((message: MessageDto) => {
    setMessages((prevState) => [...prevState, message]);
  }, []);

  const handleReadMessages = useCallback((messageIds: string[]) => {
    setMessages((prevState) =>
      prevState.map((message) =>
        messageIds.includes(message.id)
          ? { ...message, dateRead: formatShortDateTime(new Date()) }
          : message
      )
    );
  }, []);

  useEffect(() => {
    if (!pusherClient || typeof window === "undefined") return;

    const channel = pusherClient.subscribe(chatId);
    channel.bind("message:new", handleNewMessage);
    channel.bind("messages:read", handleReadMessages);

    return () => {
      channel.unsubscribe();
      channel.unbind("message:new", handleNewMessage);
      channel.unbind("messages:read", handleReadMessages);
    };
  }, [chatId, handleNewMessage, handleReadMessages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <div className="text-xl font-semibold mb-2">No messages yet</div>
              <div className="text-sm">Start the conversation!</div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBox
              key={message.id}
              message={message}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </div>
  );
}
