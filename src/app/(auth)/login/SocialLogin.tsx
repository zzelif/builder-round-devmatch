import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function SocialLogin() {
  const providers = [
    {
      name: "github",
      icon: <FaGithub size={20} />,
      text: "GitHub",
    },
  ];

  const onClick = (provider: "github") => {
    signIn(provider, {
      callbackUrl: "/networks",
    });
  };

  return (
    <div className="flex items-center w-full gap-2">
      {providers.map((provider) => (
        <Button
          key={provider.name}
          size="lg"
          className="w-full"
          variant="outline"
          onClick={() => onClick(provider.name as "github")}
        >
          {provider.icon}
        </Button>
      ))}
    </div>
  );
}
