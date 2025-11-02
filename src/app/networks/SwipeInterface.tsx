// src/app/networks/SwipeInterface.tsx
"use client";

import { useState } from "react";
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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSwipe = async (
    direction: "left" | "right",
    targetUserId: string,
    memberName?: string,
    onAnimationComplete?: () => void
  ) => {
    if (isProcessing) return;

    setIsProcessing(true);
    const isLike = direction === "right";

    if (isLike) {
      toast.info(`Liked ${memberName}!`, {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: true,
      });
    }

    onAnimationComplete?.();

    try {
      const result = await recordSwipe(currentUserId, targetUserId, isLike);

      if (result.success && result.isMatch && memberName && isLike) {
        toast.success(`IT'S A MATCH! You and ${memberName} liked each other!`, {
          position: "top-center",
          autoClose: 4000,
          closeOnClick: true,
          className: "match-toast",
        });
      }
    } catch (error) {
      console.error("Failed to record swipe:", error);
      toast.error("Oops! Something went wrong", {
        position: "bottom-center",
        autoClose: 2000,
      });

      setCurrentIndex((prev) => Math.max(0, prev - 1));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleButtonSwipe = (direction: "left" | "right") => {
    const currentMember = members[currentIndex];
    if (currentMember && currentIndex < members.length && !isProcessing) {
      handleSwipe(direction, currentMember.userId, currentMember.name, () =>
        setCurrentIndex((prev) => prev + 1)
      );
    }
  };

  if (currentIndex >= members.length) {
    return (
      <div className="flex items-center justify-center min-h-96 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-24 h-24 bg-linear-to-br from-primary/20 to-secondary/20 dark:from-primary/10 dark:to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-primary fill-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            You&apos;re all caught up!
          </h2>
          <p className="text-muted-foreground mb-6">
            No more developers in your area. Check back later for new profiles!
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="gradient-primary hover:shadow-lg transition-shadow"
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
    <div className="relative w-full max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Discover Developers
        </h1>
        {/* <p className="text-muted-foreground text-sm md:text-base">
          {Math.max(0, members.length - currentIndex)} profiles remaining
        </p> */}
      </div>

      {/* Card Stack */}
      <div className="relative w-full h-[500px] md:h-[600px] mb-12">
        <AnimatePresence mode="popLayout">
          {members
            .slice(currentIndex, currentIndex + 3)
            .map((member, index) => (
              <motion.div
                key={member.id}
                className="absolute inset-0"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{
                  scale: 1 - index * 0.02,
                  y: index * 6,
                  opacity: index === 0 ? 1 : 0.6 - index * 0.1,
                  zIndex: 3 - index,
                }}
                exit={{ scale: 0.9, opacity: 0, y: -20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {index === 0 ? (
                  <MemberCard
                    member={member}
                    onSwipe={(direction, userId) =>
                      handleSwipe(direction, userId, member.name, () =>
                        setCurrentIndex((prev) => prev + 1)
                      )
                    }
                  />
                ) : (
                  <div className="w-full h-full bg-background rounded-2xl shadow-lg border border-border/50 overflow-hidden">
                    <div className="p-6 h-full flex flex-col justify-between">
                      <div>
                        <div className="w-full h-40 md:h-48 bg-linear-to-br from-muted to-muted/50 rounded-xl mb-4 flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-foreground">
                          {member.name}, {member.age}
                        </h3>
                        <p className="text-muted-foreground text-sm md:text-base mt-2 line-clamp-2">
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

      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-4 md:gap-6 mb-8">
        {/* Reject Button */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => handleButtonSwipe("left")}
            disabled={!currentMember || isProcessing}
            size="lg"
            variant="outline"
            className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-destructive/50 hover:border-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 group transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-6 h-6 md:w-7 md:h-7 text-destructive group-hover:scale-110 transition-transform" />
          </Button>
        </motion.div>

        {/* Like Button */}
        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={() => handleButtonSwipe("right")}
            disabled={!currentMember || isProcessing}
            size="lg"
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-linear-to-br from-primary to-secondary hover:shadow-lg hover:shadow-primary/40 transition-all duration-200 shadow-lg border-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Heart className="w-7 h-7 md:w-8 md:h-8 text-white fill-white group-hover:scale-110 transition-transform" />
          </Button>
        </motion.div>
      </div>

      {/* Help Text */}
      <div className="flex flex-col items-center gap-4 mt-8">
        <div className="inline-flex items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground bg-muted/50 dark:bg-muted/20 rounded-full px-4 md:px-6 py-2 md:py-3 border border-border/50">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-green-500 fill-green-500 shrink-0" />
            <span className="hidden sm:inline">Like</span>
          </div>
          <div className="w-1 h-3 md:h-4 bg-border rounded-full"></div>
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-destructive shrink-0" />
            <span className="hidden sm:inline">Pass</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Swipe or tap buttons to choose
        </p>
      </div>
    </div>
  );
}
