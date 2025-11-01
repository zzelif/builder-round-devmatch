// src/app/messages/MessageTableCell.tsx
"use client";

import { MessageDto } from "@/types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArchiveX, Loader2 } from "lucide-react";
import { truncateString } from "@/lib/utils";
import { memo, useState } from "react";

type Props = {
  item: MessageDto;
  columnKey: string;
  deleteMessage: (message: MessageDto) => Promise<void>;
  isDeleting: boolean;
};

export default memo(function MessageTableCell({
  item,
  columnKey,
  deleteMessage,
  isDeleting,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    await deleteMessage(item);
    setIsOpen(false);
  };

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
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                disabled={isDeleting}
                className="hover:text-destructive"
                onClick={(e) => e.stopPropagation()}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArchiveX className="h-4 w-4" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Message</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this message? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="rounded-lg bg-muted p-3 mb-4">
                <p className="text-sm line-clamp-2 text-foreground font-medium">
                  {item.text}
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Delete
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        );
      default:
        return null;
    }
  };

  return cellValue();
});
