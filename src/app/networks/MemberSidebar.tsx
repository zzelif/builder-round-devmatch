// src/app/networks/MemberSidebar.tsx
"use client";

import React from "react";
import { Member } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type Props = {
  member: Member;
  navLinks: { name: string; href: string }[];
};

export default function MemberSidebar({ member, navLinks }: Props) {
  const pathname = usePathname();

  return (
    <Card className="w-full mt-10 items-center h-[80vh]">
      <div className="flex justify-center mt-6">
        {member.image ? (
          <Image
            height={200}
            width={200}
            src={member.image}
            alt="User profile main image"
            className="rounded-full aspect-square object-cover"
          />
        ) : (
          <div className="w-[200px] h-[200px] rounded-full bg-gray-300 flex items-center justify-center text-6xl">
            👤
          </div>
        )}
      </div>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="text-2xl">
            {member.name}, {member.age}
          </div>
        </div>
        <Separator className="my-3" />
        <nav className="flex flex-col p-4 ml-4 text-2xt gap-4">
          {navLinks.map((link) => (
            <Link
              href={link.href}
              key={link.name}
              className={`block rounded 
                                ${
                                  pathname === link.href
                                    ? "text-default"
                                    : "hover:text-default/50"
                                }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </CardContent>
      <CardFooter>
        <Button asChild color="default" variant="default" size="lg">
          <Link href="/networks">Go back</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
