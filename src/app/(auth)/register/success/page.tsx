"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function RegisterSuccessPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Registration Successful!</CardTitle>
          <CardDescription>
            Welcome to DevMatch! You can now sign in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/login")} className="w-full">
            Go to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
