// src/app/messages/MessageTable.tsx - FIXED INFINITE LOOP
"use client";

import { MessageDto } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { memo } from "react";
import MessageTableCell from "./MessageTableCell";
import { useMessages } from "@/hooks/useMessages";
import { Loader2 } from "lucide-react";

type Props = {
  initialMessages: MessageDto[];
  nextCursor?: string;
};

type Column = {
  key: string;
  label: string;
  width?: string;
};

export default memo(function MessageTable({
  initialMessages,
  nextCursor,
}: Props) {
  const {
    columns,
    isOutbox,
    isDeleting,
    deleteMessage,
    selectRow,
    messages,
    loadMore,
    loadingMore,
    hasMore,
  } = useMessages(initialMessages, nextCursor);

  return (
    <div className="flex flex-col h-[80vh]">
      <Card className="flex flex-col h-full">
        <CardContent className="flex-1 overflow-auto pt-0 px-5">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                {columns.map((column: Column) => (
                  <TableHead
                    key={column.key}
                    className="text-left"
                    style={{
                      width: column.width || "auto",
                    }}
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No messages for this container
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((item: MessageDto) => (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={(e) => {
                      // Prevent default
                      const target = e.target as HTMLElement;
                      if (
                        !target.closest("button") &&
                        !target.closest('[role="dialog"]')
                      ) {
                        selectRow(item.id);
                      }
                    }}
                  >
                    {columns.map((column: Column) => (
                      <TableCell
                        key={`${item.id}-${column.key}`}
                        className={
                          !item.dateRead && !isOutbox ? "font-semibold" : ""
                        }
                      >
                        <MessageTableCell
                          item={item}
                          columnKey={column.key}
                          deleteMessage={deleteMessage}
                          isDeleting={
                            isDeleting.loading && isDeleting.id === item.id
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

        <div className="sticky bottom-0 p-3 border-t bg-background">
          <div className="flex justify-end">
            <Button
              variant="default"
              disabled={!hasMore || loadingMore}
              onClick={loadMore}
            >
              {loadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {hasMore ? "Load more" : "No more messages"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
});
