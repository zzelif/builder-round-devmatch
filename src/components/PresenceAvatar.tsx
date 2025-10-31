import usePresenceStore from "@/hooks/usePresenceStore";
import { AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

type Props = {
  userId?: string;
  src?: string | null;
};

export default function PresenceAvatar({ userId, src }: Props) {
  const { membersId } = usePresenceStore((state) => ({
    membersId: state.membersId,
  }));

  const isOnline = userId && membersId.indexOf(userId) !== -1;

  return (
    <Badge content="" color="success" className="rounded-full">
      <AvatarImage src={src || "/images/user.png"} alt="User avatar" />
    </Badge>
  );
}
