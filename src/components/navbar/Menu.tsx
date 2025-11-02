// src/components/navbar/Menu.tsx
"use client";

import { User } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserCircle, Heart, LogOut, ChevronDown, Zap } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
// import { Badge } from "@/components/ui/badge";
import ThemeSwitch from "@/components/ThemeToggle";

interface MenuProps {
  user: User;
}

export default function Menu({ user }: MenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 px-3 hover:bg-primary/10 transition-all"
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarImage
                src={user.image || undefined}
                alt={user.name || ""}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline-block text-sm font-medium text-foreground">
              {user.name}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href="/networks/edit"
            className="flex items-center cursor-pointer"
          >
            <UserCircle className="mr-2 h-4 w-4 text-primary" />
            <span>Edit Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/networks/edit/photos"
            className="flex items-center cursor-pointer"
          >
            <Heart className="mr-2 h-4 w-4 text-danger" />
            <span>My Photos</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/lists" className="flex items-center cursor-pointer">
            <Zap className="mr-2 h-4 w-4 text-warning" />
            <span>Connections</span>
            {/* <Badge variant="secondary" className="ml-auto text-xs">
              New
            </Badge> */}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center justify-between cursor-default focus:bg-transparent">
          <span className="text-sm">Theme</span>
          <ThemeSwitch />
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
