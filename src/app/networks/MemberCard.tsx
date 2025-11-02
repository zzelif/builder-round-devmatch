// src/app/networks/MemberCard.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Member } from "@/generated/prisma";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { Heart, X } from "lucide-react";

type Props = {
  member: Member;
  onSwipe: (direction: "left" | "right", memberId: string) => void;
};

export default function MemberCard({ member, onSwipe }: Props) {
  const [exitX, setExitX] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const passOpacity = useTransform(x, [-150, -50], [1, 0]);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 150;

    if (info.offset.x > threshold) {
      setExitX(300);
      onSwipe("right", member.userId);
    } else if (info.offset.x < -threshold) {
      setExitX(-300);
      onSwipe("left", member.userId);
    }
  };

  return (
    <motion.div
      key={`card-${member.id}`}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0.8 }}
      animate={{
        scale: 1,
        opacity: 1,
        x: exitX,
      }}
      exit={{
        x: exitX,
        opacity: 0,
        transition: { duration: 0.4, ease: "easeInOut" },
      }}
      style={{ x, rotate, opacity }}
      whileDrag={{ scale: 1.02 }}
    >
      <Card className="w-full h-full bg-background dark:bg-slate-900 shadow-2xl border-0 overflow-hidden">
        <CardContent className="p-0 h-full flex flex-col relative">
          {/* Profile Image Section */}
          <div className="relative h-2/3 overflow-hidden">
            {member.image ? (
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <div className="text-8xl opacity-20">👨‍💻</div>
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

            {/* Swipe Indicators */}
            <motion.div
              className="absolute top-8 right-8 px-4 py-2 rounded-full font-bold text-lg flex items-center gap-2 shadow-lg"
              style={{ opacity: passOpacity }}
            >
              <div className="w-12 h-12 bg-destructive rounded-full flex items-center justify-center">
                <X className="w-6 h-6 text-white" />
              </div>
              <span className="text-destructive font-black text-xl">PASS</span>
            </motion.div>

            <motion.div
              className="absolute top-8 left-8 px-4 py-2 rounded-full font-bold text-lg flex items-center gap-2 shadow-lg"
              style={{ opacity: likeOpacity }}
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-current" />
              </div>
              <span className="text-green-500 font-black text-xl">LIKE</span>
            </motion.div>
          </div>

          {/* Profile Info Section */}
          <div className="p-6 h-1/3 flex flex-col justify-between bg-background dark:bg-slate-900">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold text-foreground">
                  {member.name}
                </h2>
                <span className="text-xl text-muted-foreground font-medium">
                  {member.age}
                </span>
              </div>
            </div>

            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
              {member.bio}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
