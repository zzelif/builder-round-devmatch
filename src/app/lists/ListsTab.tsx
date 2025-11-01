// src/app/lists/ListsTab.tsx
"use client";

import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Member } from "@/generated/prisma";
import {
  Heart,
  HeartHandshake,
  Users,
  MessageCircle,
  Eye,
  CheckCircle2,
  HeartOff,
  UserX,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  unlikeMember,
  unmatchMember,
  recordSwipe,
} from "@/actions/likeActions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  likedMembers: Member[];
  whoLikedMe: Member[];
  mutualMatches: Member[];
  currentUserId: string;
};

export default function ListsTab({
  likedMembers,
  whoLikedMe,
  mutualMatches,
  currentUserId,
}: Props) {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Your Connections
        </h1>
        <p className="text-muted-foreground">
          Manage your likes, matches, and connections with fellow developers
        </p>
      </div>

      <Tabs defaultValue="mutual" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger
            value="mutual"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Matches</span>
            {mutualMatches.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                {mutualMatches.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="likes"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <HeartHandshake className="w-4 h-4" />
            <span className="hidden sm:inline">Like Me</span>
            {whoLikedMe.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                {whoLikedMe.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="liked"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">My Likes</span>
            {likedMembers.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                {likedMembers.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mutual" className="animate-fade-in">
          <MutualMatchesGrid
            members={mutualMatches}
            currentUserId={currentUserId}
          />
        </TabsContent>

        <TabsContent value="likes" className="animate-fade-in">
          <WhoLikedMeGrid
            members={whoLikedMe}
            mutualMatches={mutualMatches}
            currentUserId={currentUserId}
          />
        </TabsContent>

        <TabsContent value="liked" className="animate-fade-in">
          <LikedMembersGrid
            members={likedMembers}
            currentUserId={currentUserId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Grid Components
function MutualMatchesGrid({
  members,
  currentUserId,
}: {
  members: Member[];
  currentUserId: string;
}) {
  if (members.length === 0) {
    return (
      <EmptyState
        icon={<Heart className="w-16 h-16 text-primary" />}
        title="No matches yet"
        description="Keep swiping to find your perfect developer match!"
        actionText="Start Swiping"
        actionHref="/networks"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member, index) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <MemberMatchCard
            member={member}
            type="match"
            currentUserId={currentUserId}
          />
        </motion.div>
      ))}
    </div>
  );
}

function WhoLikedMeGrid({
  members,
  mutualMatches,
  currentUserId,
}: {
  members: Member[];
  mutualMatches: Member[];
  currentUserId: string;
}) {
  if (members.length === 0) {
    return (
      <EmptyState
        icon={<HeartHandshake className="w-16 h-16 text-warning" />}
        title="No one has liked you yet"
        description="Don't worry! Your profile is being discovered by amazing developers."
        actionText="Improve Profile"
        actionHref="/networks/edit"
      />
    );
  }

  const mutualMatchIds = mutualMatches.map((m) => m.userId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member, index) => {
        const isMutualMatch = mutualMatchIds.includes(member.userId);

        return (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MemberMatchCard
              member={member}
              type="liked-me"
              isMutualMatch={isMutualMatch}
              currentUserId={currentUserId}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

function LikedMembersGrid({
  members,
  currentUserId,
}: {
  members: Member[];
  currentUserId: string;
}) {
  if (members.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-16 h-16 text-primary" />}
        title="You haven't liked anyone yet"
        description="Start swiping to discover amazing developers in your area!"
        actionText="Start Discovering"
        actionHref="/networks"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member, index) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <MemberMatchCard
            member={member}
            type="liked"
            currentUserId={currentUserId}
          />
        </motion.div>
      ))}
    </div>
  );
}

// Member Card Component
function MemberMatchCard({
  member,
  type,
  isMutualMatch = false,
  currentUserId,
}: {
  member: Member;
  type: "match" | "liked-me" | "liked";
  isMutualMatch?: boolean;
  currentUserId: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    setIsLoading(true);
    try {
      const result = await recordSwipe(currentUserId, member.userId, true);
      if (result.success) {
        toast.success(
          `IT'S A MATCH! You and ${member.name} liked each other!`,
          {
            position: "top-center",
            autoClose: 4000,
            closeOnClick: true,
            className: "match-toast",
          }
        );
        router.refresh();
      } else {
        toast.error(result.error || "Failed to like");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log("error:::", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlike = async () => {
    setIsLoading(true);
    try {
      const result = await unlikeMember(currentUserId, member.userId);
      if (result.success) {
        toast.success(`Unliked ${member.name}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to unlike");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log("error:::", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnmatch = async () => {
    setIsLoading(true);
    try {
      const result = await unmatchMember(currentUserId, member.userId);
      if (result.success) {
        toast.success(`Unmatched with ${member.name}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to unmatch");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log("error:::", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCardStyle = () => {
    switch (type) {
      case "match":
        return "border-success/30 hover:border-success hover:shadow-lg transition-all";
      case "liked-me":
        return isMutualMatch
          ? "border-success/30 hover:border-success hover:shadow-lg transition-all"
          : "border-warning/30 hover:border-warning hover:shadow-lg transition-all";
      case "liked":
        return "border-primary/30 hover:border-primary hover:shadow-lg transition-all";
    }
  };

  const getBadge = () => {
    switch (type) {
      case "match":
        return (
          <Badge className="bg-success text-success-foreground">💕 Match</Badge>
        );
      case "liked-me":
        return isMutualMatch ? (
          <Badge className="bg-success text-success-foreground">Mutual</Badge>
        ) : (
          <Badge className="bg-warning text-warning-foreground">
            Likes You
          </Badge>
        );
      case "liked":
        return (
          <Badge className="bg-primary text-primary-foreground">Liked</Badge>
        );
    }
  };

  const getActions = () => {
    switch (type) {
      case "match":
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button asChild size="sm" className="flex-1 gradient-success">
                <Link href={`/networks/${member.userId}/chat`}>
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Message
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/networks/${member.userId}`}>
                  <Eye className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  disabled={isLoading}
                >
                  <UserX className="w-4 h-4 mr-1" />
                  Unmatch
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unmatch {member.name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove your match with {member.name}. You
                    won&apos;t be able to message them anymore. This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleUnmatch}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    Unmatch
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );

      case "liked-me":
        return (
          <div className="flex flex-col gap-2">
            {isMutualMatch ? (
              <>
                <div className="flex items-center justify-center gap-2 text-success text-sm font-medium py-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>You liked each other!</span>
                </div>
                <Button asChild size="sm" className="w-full gradient-success">
                  <Link href={`/networks/${member.userId}/chat`}>
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Message
                  </Link>
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 gradient-success"
                  onClick={() => handleLike()}
                >
                  <Heart className="w-4 h-4 mr-1" />
                  Like Back
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/networks/${member.userId}`}>
                    <Eye className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        );

      case "liked":
        return (
          <div className="space-y-2">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href={`/networks/${member.userId}`}>
                <Eye className="w-4 h-4 mr-1" />
                View Profile
              </Link>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  disabled={isLoading}
                >
                  <HeartOff className="w-4 h-4 mr-1" />
                  Unlike
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unlike {member.name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove your like from {member.name}&apos;s
                    profile. They won&apos;t be notified, but you can always
                    like them again later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleUnlike}>
                    Unlike
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
    }
  };

  return (
    <Card
      className={`group cursor-pointer transition-all duration-200 hover:scale-[1.02] ${getCardStyle()}`}
    >
      <CardContent className="p-0">
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          {member.image ? (
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <div className="text-6xl opacity-40">👨‍💻</div>
            </div>
          )}
          <div className="absolute top-3 left-3">{getBadge()}</div>
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-lg text-foreground">
                {member.name}
              </h3>
              <p className="text-muted-foreground text-sm">
                {member.age} years old
              </p>
            </div>
          </div>

          <p className="text-foreground text-sm line-clamp-2 mb-4">
            {member.bio}
          </p>

          {/* <div className="flex flex-wrap gap-1 mb-4">
            <Badge variant="secondary" className="text-xs">
              React
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Node.js
            </Badge>
            <Badge variant="secondary" className="text-xs">
              TypeScript
            </Badge>
          </div> */}

          {getActions()}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionHref,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText: string;
  actionHref: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-6">{icon}</div>
      <h2 className="text-2xl font-bold text-foreground mb-3">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      <Button asChild className="gradient-primary">
        <Link href={actionHref}>{actionText}</Link>
      </Button>
    </motion.div>
  );
}
