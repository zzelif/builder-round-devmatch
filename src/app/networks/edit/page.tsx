// src/app/networks/edit/page.tsx
import { getAuthUserId } from "@/actions/authActions";
import { getMemberById } from "@/actions/memberActions";
import CardInnerWrapper from "@/components/CardInnerWrapper";
// import { notFound } from "next/navigation";
import EditForm from "./EditForm";
import { redirect } from "next/navigation";

export default async function EditPage() {
  const userId = await getAuthUserId();
  const member = await getMemberById(userId);
  if (!member) {
    redirect("/register");
  }

  return (
    <CardInnerWrapper
      header="Edit Profile"
      body={
        <div className="p-5">
          <EditForm member={member} />
        </div>
      }
    />
  );
}
