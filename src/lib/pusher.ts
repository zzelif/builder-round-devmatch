// src/lib/pusher.ts - COMPLETELY FIXED
import PusherServer from "pusher";
import PusherClient from "pusher-js";

const CLUSTER = "ap1";

// ✅ Create server instance ONLY on server
let pusherServerInstance: PusherServer | null = null;
if (typeof window === "undefined") {
  pusherServerInstance = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: CLUSTER,
    useTLS: true,
  });
}

// ✅ Create client instance ONLY on client
let pusherClientInstance: PusherClient | null = null;
if (typeof window !== "undefined") {
  pusherClientInstance = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    {
      cluster: CLUSTER,
      channelAuthorization: {
        endpoint: "/api/pusher-auth",
        transport: "ajax",
      },
    }
  );
}

// ✅ Safe exports - NO GLOBAL USAGE
export const pusherServer = pusherServerInstance;
export const pusherClient = pusherClientInstance;
