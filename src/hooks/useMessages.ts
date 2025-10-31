// src/hooks/useMessages.tsx - FIXED INFINITE LOOP
"use client";

import { MessageDto } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import { deleteMessage } from "@/actions/messageActions";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Column = {
  key: string;
  label: string;
  width?: string;
};

export function useMessages(
  initialMessages: MessageDto[],
  nextCursor?: string
) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const container = searchParams.get("container") || "inbox";

  // ✅ Use state instead of store to prevent infinite loops
  const [messages, setMessages] = useState(initialMessages);
  const [hasMore, setHasMore] = useState(!!nextCursor);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isDeleting, setIsDeleting] = useState({ loading: false, id: "" });

  // ✅ Prevent re-initialization on every render
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      setMessages(initialMessages);
      setHasMore(!!nextCursor);
      initializedRef.current = true;
    }
  }, [initialMessages, nextCursor]);

  const isOutbox = container === "outbox";

  // ✅ Memoize columns to prevent recreating on every render
  const columns: Column[] = useMemo(() => {
    if (isOutbox) {
      return [
        { key: "recipientName", label: "Recipient" },
        { key: "text", label: "Message" },
        { key: "created", label: "Date sent", width: "20%" },
        { key: "actions", label: "", width: "10%" },
      ];
    } else {
      return [
        { key: "senderName", label: "Sender" },
        { key: "text", label: "Message" },
        { key: "created", label: "Date received", width: "20%" },
        { key: "actions", label: "", width: "10%" },
      ];
    }
  }, [isOutbox]);

  // ✅ Memoized delete function to prevent recreation
  const handleDeleteMessage = useCallback(
    async (message: MessageDto) => {
      setIsDeleting({ loading: true, id: message.id });

      try {
        await deleteMessage(message.id, isOutbox);
        setMessages((prev) => prev.filter((m) => m.id !== message.id));
      } catch (error) {
        console.error("Error deleting message:", error);
      } finally {
        setIsDeleting({ loading: false, id: "" });
      }
    },
    [isOutbox]
  );

  // ✅ Memoized select row function
  const selectRow = useCallback(
    (id: string) => {
      const message = messages.find((m) => m.id === id);
      if (message) {
        const searchParams = new URLSearchParams();
        const otherUserId = isOutbox ? message.recipientId : message.senderId;
        router.push(`/networks/${otherUserId}/chat`);
      }
    },
    [messages, isOutbox, router]
  );

  // ✅ Load more function with proper state management
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      // Implement your load more logic here
      // const response = await getMessagesByContainer(container, nextCursor);
      // setMessages(prev => [...prev, ...response.messages]);
      // setHasMore(!!response.nextCursor);
    } catch (error) {
      console.error("Error loading more messages:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, container]);

  return {
    columns,
    isOutbox,
    isDeleting,
    deleteMessage: handleDeleteMessage,
    selectRow,
    messages,
    loadMore,
    loadingMore,
    hasMore,
  };
}
