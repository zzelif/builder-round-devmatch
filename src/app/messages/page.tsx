// src\app\messages\page.tsx

import MessageSidebar from "./MessageSidebar";
import {
  getMessagesByContainer,
  syncUnreadMessages,
} from "@/actions/messageActions";
import MessageTable from "./MessageTable";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SyncUnreadStore from "./SyncUnreadStore";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ container: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const resolvedParams = await searchParams;
  const { messages, nextCursor } = await getMessagesByContainer(
    resolvedParams.container
  );

  const unreadCount = await syncUnreadMessages();

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <SyncUnreadStore initialCount={unreadCount} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-3 xl:col-span-2">
          <div className="lg:sticky lg:top-20">
            <MessageSidebar />
          </div>
        </div>

        {/* Messages Table */}
        <div className="lg:col-span-9 xl:col-span-10">
          <MessageTable initialMessages={messages} nextCursor={nextCursor} />
        </div>
      </div>
    </div>
  );
}
