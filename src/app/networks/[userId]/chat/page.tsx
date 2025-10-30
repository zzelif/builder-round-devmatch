import { CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default async function ChatPage() {
  return (
    <>
      <CardHeader className="text-2xl font-semibold text-default">
        Chat
      </CardHeader>
      <Separator />
      <CardContent>Chat goes here</CardContent>
    </>
  );
}
