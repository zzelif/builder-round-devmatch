// src\app\networks\SwipeInterface.tsx
"use client";

import React, { useState } from "react";
import { Member } from "@prisma/client";
import MemberCard from "./MemberCard";
import { recordSwipe } from "@/actions/memberActions";

type Props = {
  initialMembers: Member[];
  currentUserId: string;
};

export default function SwipeInterface({
  initialMembers,
  currentUserId,
}: Props) {
  const [members] = useState<Member[]>(initialMembers);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = async (
    direction: "left" | "right",
    targetUserId: string
  ) => {
    try {
      const isLike = direction === "right";
      await recordSwipe(currentUserId, targetUserId, isLike);

      if (isLike) {
        console.log(`Liked ${targetUserId}`);
        // TODO: Check for match and show notification
      }
    } catch (error) {
      console.error("Failed to record swipe:", error);
    }
  };

  const handleSwipeComplete = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  if (currentIndex >= members.length) {
    return (
      <div className="flex items-center justify-center h-96 flex-col gap-4">
        <div className="text-2xl font-bold">No more profiles!</div>
        <div className="text-gray-600">Check back later for new people</div>
      </div>
    );
  }

  const currentMember = members[currentIndex];

  return (
    <>
      <div className="relative w-full h-[600px]">
        {members.slice(currentIndex, currentIndex + 3).map((member, index) => (
          <div
            key={member.id}
            className="absolute inset-0"
            style={{
              zIndex: 3 - index,
              transform: `scale(${1 - index * 0.05}) translateY(${
                index * 8
              }px)`,
              opacity: index === 0 ? 1 : 0.7,
            }}
          >
            {index === 0 ? (
              <MemberCard
                member={member}
                onSwipe={handleSwipe}
                onSwipeComplete={handleSwipeComplete}
              />
            ) : (
              <div className="w-full h-full bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="p-6">
                  <div className="text-xl font-bold text-gray-800">
                    {member.name}, {member.age}
                  </div>
                  <div className="text-gray-600 mt-2 truncate">
                    {member.bio}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-8 mt-8">
        <button
          onClick={() => {
            handleSwipe("left", currentMember?.userId);
            handleSwipeComplete();
          }}
          className="w-16 h-16 bg-primary rounded-full text-white text-2xl hover:bg-red-600 transition-colors shadow-lg flex items-center justify-center"
          disabled={!currentMember}
        >
          ✕
        </button>
        <button
          onClick={() => {
            handleSwipe("right", currentMember?.userId);
            handleSwipeComplete();
          }}
          className="w-16 h-16 bg-green-500 rounded-full text-white text-2xl hover:bg-green-600 transition-colors shadow-lg flex items-center justify-center"
          disabled={!currentMember}
        >
          ♥
        </button>
      </div>

      <div className="text-center mt-4 text-gray-600">
        {currentIndex + 1} of {members.length} profiles
      </div>
    </>
  );
}
