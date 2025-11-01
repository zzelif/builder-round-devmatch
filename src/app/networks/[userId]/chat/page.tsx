// src/app/networks/[userId]/chat/page.tsx

import CardInnerWrapper from "@/components/CardInnerWrapper";
import ChatForm from "./ChatForm";
import { getMessageThread } from "@/actions/messageActions";
import { getAuthUserId } from "@/actions/authActions";
import MessageList from "./MessageList";
import { createChatId } from "@/lib/utils";
import { checkMutualMatch } from "@/actions/likeActions";
import { getMemberById } from "@/actions/memberActions";
import { Lock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const resolvedParams = await params;
  const userId = await getAuthUserId();

  if (!userId) {
    redirect("/login");
  }

  const member = await getMemberById(resolvedParams.userId);
  if (!member) {
    notFound();
  }

  const hasMatch = await checkMutualMatch(userId, resolvedParams.userId);

  if (!hasMatch) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        {/* Lock Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center">
            <Lock className="w-10 h-10 text-warning" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold text-foreground mb-2">
          Match Required to Chat
        </h2>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-1 max-w-sm">
          You need to match with{" "}
          <span className="font-semibold text-primary">{member.name}</span>{" "}
          before you can exchange messages.
        </p>

        <p className="text-xs text-muted-foreground mb-6 max-w-sm">
          Like their profile and wait for them to like you back!
        </p>

        {/* Match Diagram */}
        <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6 max-w-sm w-full">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <span className="text-xs font-medium text-foreground">You</span>
            </div>

            <Heart className="w-5 h-5 text-muted-foreground/40" />

            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl">💻</span>
              </div>
              <span className="text-xs font-medium text-foreground">
                {member.name}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Both need to like each other
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full max-w-sm">
          <Button asChild className="flex-1 gradient-primary">
            <Link
              href="/networks"
              className="flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Continue Swiping
            </Link>
          </Button>

          <Button asChild variant="outline" className="flex-1">
            <Link href={`/networks/${member.userId}`}>View Profile</Link>
          </Button>
        </div>
      </div>
    );
  }

  const messages = await getMessageThread(resolvedParams.userId);
  const chatId = createChatId(userId, resolvedParams.userId);

  return (
    <CardInnerWrapper
      header={`Chat with ${member.name}`}
      body={
        <MessageList
          initialMessages={messages}
          currentUserId={userId}
          chatId={chatId}
        />
      }
      footer={<ChatForm />}
    />
  );
}
