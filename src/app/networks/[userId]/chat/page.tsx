// src\app\networks\[userId]\chat\page.tsx

import CardInnerWrapper from "@/components/CardInnerWrapper";
import ChatForm from "./ChatForm";
import { getMessageThread } from "@/actions/messageActions";
import { getAuthUserId } from "@/actions/authActions";
import MessageList from "./MessageList";
import { createChatId } from "@/lib/utils";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const resolvedParams = await params;
  const messages = await getMessageThread(resolvedParams.userId);
  const userId = await getAuthUserId();

  const chatId = createChatId(userId, resolvedParams.userId);

  return (
    <CardInnerWrapper
      header="Chat"
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
