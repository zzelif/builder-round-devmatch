// src/components/navbar/TopNav.tsx
import { auth } from "@/auth";
import TopNavClient from "./TopNavClient";

export default async function TopNavSession() {
  const session = await auth();

  return <TopNavClient session={session} />;
}
