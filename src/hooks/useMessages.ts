// src/hooks/useMessages.ts - FIXED ALL ESLINT ISSUES
"use client";

import { MessageDto } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
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

  const [messages, setMessages] = useState(initialMessages);
  const [hasMore, setHasMore] = useState(!!nextCursor);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isDeleting, setIsDeleting] = useState({ loading: false, id: "" });

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      setMessages(initialMessages);
      setHasMore(!!nextCursor);
      initializedRef.current = true;
    }
  }, [initialMessages, nextCursor]);

  const isOutbox = container === "outbox";

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

  const selectRow = useCallback(
    (id: string) => {
      const message = messages.find((m) => m.id === id);
      if (message) {
        const otherUserId = isOutbox ? message.recipientId : message.senderId;
        router.push(`/networks/${otherUserId}/chat`);
      }
    },
    [messages, isOutbox, router]
  );

  // ✅ Fixed: Remove container from dependencies
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      // Implement load more logic here
    } catch (error) {
      console.error("Error loading more messages:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore]); // ✅ Removed container dependency

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
