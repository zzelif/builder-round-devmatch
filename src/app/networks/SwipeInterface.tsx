// src/app/networks/SwipeInterface.tsx - OPTIMIZED VERSION
"use client";

import React, { useState } from "react";
import { Member } from "@/generated/prisma";
import MemberCard from "./MemberCard";
import { recordSwipe } from "@/actions/likeActions";
import { Button } from "@/components/ui/button";
import { Heart, X, RotateCcw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

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
    targetUserId: string,
    memberName?: string
  ) => {
    const isLike = direction === "right";

    if (isLike) {
      toast.info(`Liked ${memberName}!`, {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: true,
      });
    }

    handleSwipeComplete();

    recordSwipe(currentUserId, targetUserId, isLike)
      .then((result) => {
        if (result.success && result.isMatch && memberName && isLike) {
          toast.success(
            `IT'S A MATCH! You and ${memberName} liked each other!`,
            {
              position: "top-center",
              autoClose: 4000,
              closeOnClick: true,
              className: "match-toast",
            }
          );
        }
      })
      .catch((error) => {
        console.error("Failed to record swipe:", error);
        toast.error("Oops! Something went wrong", {
          position: "bottom-center",
          autoClose: 2000,
        });
      });
  };

  const handleSwipeComplete = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleButtonSwipe = (direction: "left" | "right") => {
    const currentMember = members[currentIndex];
    if (currentMember && currentIndex < members.length) {
      handleSwipe(direction, currentMember.userId, currentMember.name);
    }
  };

  if (currentIndex >= members.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-24 h-24 bg-linear-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-muted-foreground mb-3">
            You&apos;re all caught up!
          </h2>
          <p className="text-muted-foreground dark:text-gray-400 mb-6">
            No more developers in your area. Check back later for new profiles!
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </motion.div>
      </div>
    );
  }

  const currentMember = members[currentIndex];

  return (
    <div className="relative">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Discover Developers
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {members.length - currentIndex} profiles remaining
        </p>
      </div>

      <div className="relative w-full h-[600px] mb-8">
        <AnimatePresence mode="popLayout">
          {members
            .slice(currentIndex, currentIndex + 3)
            .map((member, index) => (
              <motion.div
                key={`${member.id}-${currentIndex}`}
                className="absolute inset-0"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{
                  scale: 1 - index * 0.02,
                  y: index * 4,
                  opacity: index === 0 ? 1 : 0.7,
                  zIndex: 3 - index,
                }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {index === 0 ? (
                  <MemberCard
                    member={member}
                    onSwipe={(direction, userId) =>
                      handleSwipe(direction, userId, member.name)
                    }
                    onSwipeComplete={handleSwipeComplete}
                  />
                ) : (
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 h-full flex flex-col justify-between">
                      <div>
                        <div className="w-full h-40 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl mb-4 flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {member.name}, {member.age}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-center items-center gap-6">
        <Button
          onClick={() => handleButtonSwipe("left")}
          disabled={!currentMember}
          size="lg"
          variant="outline"
          className="w-16 h-16 rounded-full border-2 border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:border-red-700 dark:hover:bg-red-900/20 group transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <X className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
        </Button>

        <Button
          onClick={() => handleButtonSwipe("right")}
          disabled={!currentMember}
          size="lg"
          className="w-20 h-20 rounded-full bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-200 group transform hover:scale-105"
        >
          <Heart className="w-8 h-8 text-white group-hover:scale-110 transition-transform fill-white" />
        </Button>
      </div>

      <div className="text-center mt-8">
        <div className="inline-flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 rounded-full px-6 py-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-green-500 fill-green-500" />
            <span>Like</span>
          </div>
          <div className="w-1 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-red-500" />
            <span>Pass</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Swipe or tap buttons to choose
        </p>
      </div>
    </div>
  );
}
