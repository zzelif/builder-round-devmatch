// src/app/networks/MemberCard.tsx - Fixed CSS class name
"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Member } from "@prisma/client";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";

type Props = {
  member: Member;
  onSwipe: (direction: "left" | "right", memberId: string) => void;
  onSwipeComplete: () => void;
};

export default function MemberCard({
  member,
  onSwipe,
  onSwipeComplete,
}: Props) {
  const [exitX, setExitX] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 150;

    if (info.offset.x > threshold) {
      setExitX(300);
      onSwipe("right", member.userId);
      onSwipeComplete();
    } else if (info.offset.x < -threshold) {
      setExitX(-300);
      onSwipe("left", member.userId);
      onSwipeComplete();
    }
  };

  return (
    <motion.div
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
        transition: { duration: 0.3 },
      }}
      style={{
        x,
        rotate,
        opacity,
      }}
      whileDrag={{ scale: 1.05 }}
    >
      <Card className="w-full h-full bg-white shadow-xl">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Profile Image */}
          <div className="relative h-2/3 bg-linear-to-br from-pink-100 to-blue-100 rounded-t-lg overflow-hidden">
            {member.image ? (
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                👤
              </div>
            )}

            {/* Swipe indicators */}
            <motion.div
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg"
              style={{
                opacity: useTransform(x, [-150, -50], [1, 0]),
              }}
            >
              PASS
            </motion.div>
            <motion.div
              className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg"
              style={{
                opacity: useTransform(x, [50, 150], [1, 0]),
              }}
            >
              LIKE
            </motion.div>
          </div>

          {/* Profile Info */}
          <div className="p-6 h-1/3 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {member.name}, {member.age}
            </h2>
            <p className="text-gray-600 line-clamp-3">{member.bio}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
