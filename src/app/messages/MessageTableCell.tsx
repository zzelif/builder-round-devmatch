// src/app/messages/MessageTableCell.tsx - MEMOIZED CELL
"use client";

import { MessageDto } from "@/types";
import { Button } from "@/components/ui/button";
import { ArchiveX, Loader2 } from "lucide-react";
import { truncateString } from "@/lib/utils";
import React, { memo } from "react";

type Props = {
  item: MessageDto;
  columnKey: string;
  deleteMessage: (message: MessageDto) => Promise<void>;
  isDeleting: boolean;
};

// ✅ Memoize to prevent unnecessary re-renders
export default memo(function MessageTableCell({
  item,
  columnKey,
  deleteMessage,
  isDeleting,
}: Props) {
  const cellValue = () => {
    switch (columnKey) {
      case "recipientName":
        return (
          <div className="flex items-center gap-2">
            <div className="font-medium">{item.recipientName}</div>
          </div>
        );
      case "senderName":
        return (
          <div className="flex items-center gap-2">
            <div className="font-medium">{item.senderName}</div>
          </div>
        );
      case "text":
        return <div>{truncateString(item.text, 80)}</div>;
      case "created":
        return (
          <div className="text-sm text-muted-foreground">{item.created}</div>
        );
      case "actions":
        return (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              deleteMessage(item);
            }}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArchiveX className="h-4 w-4" />
            )}
          </Button>
        );
      default:
        return null;
    }
  };

  return cellValue();
});
