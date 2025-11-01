"use client";

import { useMessageStore } from "@/hooks/useMessageStore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Inbox, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MessageSidebar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [selected, setSelected] = useState<string>(
    searchParams.get("container") || "inbox"
  );

  const items = [
    { key: "inbox", label: "Inbox", icon: Inbox, chip: true },
    { key: "outbox", label: "Outbox", icon: Send, chip: false },
  ];

  const handleSelect = (key: string) => {
    setSelected(key);
    const params = new URLSearchParams();
    params.set("container", key);
    router.replace(`${pathname}?${params}`);
  };

  const unreadCount = useMessageStore((state) => state.unreadCount);

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Messages</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <nav className="flex flex-col gap-1">
          {items.map(({ key, icon: Icon, label, chip }) => (
            <button
              key={key}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-left",
                selected === key
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => handleSelect(key)}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium flex-1">{label}</span>
              {chip && unreadCount > 0 && (
                <Badge variant="default" className="ml-auto text-xs px-2">
                  {unreadCount}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}
