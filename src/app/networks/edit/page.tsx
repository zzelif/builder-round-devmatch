import { getAuthUserId } from "@/actions/authActions";
import { getMemberById } from "@/actions/memberActions";
import CardInnerWrapper from "@/components/CardInnerWrapper";
import { notFound } from "next/navigation";
import EditForm from "./EditForm";

export default async function EditPage() {
  const userId = await getAuthUserId();
  const member = await getMemberById(userId);

  if (!member) return notFound;

  return (
    <CardInnerWrapper
      header="Edit Profile"
      body={<EditForm member={member} />}
    />
  );
}
