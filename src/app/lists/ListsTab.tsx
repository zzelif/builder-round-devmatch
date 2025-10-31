// src/app/lists/ListsTab.tsx
"use client";

import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Member } from "@prisma/client";
import { Heart, HouseHeart, Users, MessageCircle, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  likedMembers: Member[];
  whoLikedMe: Member[];
  mutualMatches: Member[];
};

export default function ListsTab({
  likedMembers,
  whoLikedMe,
  mutualMatches,
}: Props) {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your Connections
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your likes, matches, and connections with fellow developers
        </p>
      </div>

      <Tabs defaultValue="mutual" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger
            value="mutual"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Matches</span>
            {mutualMatches.length > 0 && (
              <Badge className="bg-success text-white ml-1 px-1.5 py-0.5 text-xs">
                {mutualMatches.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="likes"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            <HouseHeart className="w-4 h-4" />
            <span className="hidden sm:inline">Like Me</span>
            {whoLikedMe.length > 0 && (
              <Badge className="bg-warning text-white ml-1 px-1.5 py-0.5 text-xs">
                {whoLikedMe.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="liked"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">My Likes</span>
            {likedMembers.length > 0 && (
              <Badge className="bg-primary text-white ml-1 px-1.5 py-0.5 text-xs">
                {likedMembers.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mutual" className="animate-fade-in">
          <MutualMatchesGrid members={mutualMatches} />
        </TabsContent>

        <TabsContent value="likes" className="animate-fade-in">
          <WhoLikedMeGrid members={whoLikedMe} />
        </TabsContent>

        <TabsContent value="liked" className="animate-fade-in">
          <LikedMembersGrid members={likedMembers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Mutual Matches Component
function MutualMatchesGrid({ members }: { members: Member[] }) {
  if (members.length === 0) {
    return (
      <EmptyState
        icon={<Heart className="w-16 h-16 text-indigo-400" />}
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
          <MemberMatchCard member={member} type="match" />
        </motion.div>
      ))}
    </div>
  );
}

// Who Liked Me Component
function WhoLikedMeGrid({ members }: { members: Member[] }) {
  if (members.length === 0) {
    return (
      <EmptyState
        icon={<HouseHeart className="w-16 h-16 text-warning" />}
        title="No one has liked you yet"
        description="Don't worry! Your profile is being discovered by amazing developers."
        actionText="Improve Profile"
        actionHref="/profile/edit"
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
          <MemberMatchCard member={member} type="liked-me" />
        </motion.div>
      ))}
    </div>
  );
}

// My Likes Component
function LikedMembersGrid({ members }: { members: Member[] }) {
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
          <MemberMatchCard member={member} type="liked" />
        </motion.div>
      ))}
    </div>
  );
}

// Reusable Member Card Component
function MemberMatchCard({
  member,
  type,
}: {
  member: Member;
  type: "match" | "liked-me" | "liked";
}) {
  const getCardStyle = () => {
    switch (type) {
      case "match":
        return "border-success/20 hover:border-success/40 hover:shadow-lg hover:shadow-success/10";
      case "liked-me":
        return "border-warning/20 hover:border-warning/40 hover:shadow-lg hover:shadow-warning/10";
      case "liked":
        return "border-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10";
    }
  };

  const getBadge = () => {
    switch (type) {
      case "match":
        return <Badge className="bg-success text-white">💕 Match</Badge>;
      case "liked-me":
        return <Badge className="bg-warning text-white">💖 Likes You</Badge>;
      case "liked":
        return <Badge className="bg-primary text-white">💝 Liked</Badge>;
    }
  };

  const getActions = () => {
    switch (type) {
      case "match":
        return (
          <div className="flex gap-2">
            <Button asChild size="sm" className="flex-1">
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
        );
      case "liked-me":
        return (
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Link href={`/networks/${member.userId}`}>
                <Heart className="w-4 h-4 mr-1" />
                Like Back
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/networks/${member.userId}`}>
                <Eye className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        );
      case "liked":
        return (
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href={`/networks/${member.userId}`}>
              <Eye className="w-4 h-4 mr-1" />
              View Profile
            </Link>
          </Button>
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
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center">
              <div className="text-6xl opacity-40">👨‍💻</div>
            </div>
          )}
          <div className="absolute top-3 left-3">{getBadge()}</div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {member.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {member.age} years old
              </p>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 mb-4">
            {member.bio}
          </p>

          <div className="flex flex-wrap gap-1 mb-4">
            <Badge variant="secondary" className="text-xs">
              React
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Node.js
            </Badge>
            <Badge variant="secondary" className="text-xs">
              TypeScript
            </Badge>
          </div>

          {getActions()}
        </div>
      </CardContent>
    </Card>
  );
}

// Empty State Component
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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        {description}
      </p>
      <Button
        asChild
        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
      >
        <Link href={actionHref}>{actionText}</Link>
      </Button>
    </motion.div>
  );
}
