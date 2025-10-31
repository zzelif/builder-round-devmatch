"use client";

import { useMessageStore } from "@/hooks/useMessageStore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { GoInbox } from "react-icons/go";
import { MdOutlineOutbox } from "react-icons/md";

export default function MessageSidebar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [selected, setSelected] = useState<string>(
    searchParams.get("container") || "inbox"
  );

  const items = [
    {
      key: "inbox",
      label: "Inbox",
      icon: GoInbox,
      chip: true,
    },
    {
      key: "outbox",
      label: "Outbox",
      icon: MdOutlineOutbox,
      chip: false,
    },
  ];

  const handleSelect = (key: string) => {
    setSelected(key);
    const params = new URLSearchParams();
    params.set("container", key);
    router.replace(`${pathname}?${params}`);
  };

  // FIX: Select only the specific value, not an object
  const unreadCount = useMessageStore((state) => state.unreadCount);

  return (
    <div className="flex flex-col shadow-md rounded-lg cursor-pointer">
      {items.map(({ key, icon: Icon, label, chip }) => (
        <div
          key={key}
          className={cn(
            "flex flex-row items-center rounded-t-lg gap-2 p-3 transition-colors",
            selected === key
              ? "text-primary font-semibold bg-primary/10"
              : "text-foreground hover:bg-accent hover:text-accent-foreground"
          )}
          onClick={() => handleSelect(key)}
        >
          <Icon size={24} />
          <div className="flex justify-between grow items-center">
            <span>{label}</span>
            {chip && unreadCount > 0 && (
              <Badge variant="default" className="ml-auto">
                {unreadCount}
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
