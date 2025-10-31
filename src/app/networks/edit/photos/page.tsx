import { getAuthUserId } from "@/actions/authActions";
import {
  getMemberById,
  getMemberPhotosByUserId,
} from "@/actions/memberActions";
import CardInnerWrapper from "@/components/CardInnerWrapper";
import MemberPhotos from "@/components/MemberPhotos";

export default async function PhotosPage() {
  const userId = await getAuthUserId();
  const member = await getMemberById(userId);

  const photos = await getMemberPhotosByUserId(userId);

  return (
    <CardInnerWrapper
      header="Edit Profile"
      body={
        <>
          <MemberPhotos
            photos={photos}
            editing={true}
            mainImageUrl={member?.image}
          />
        </>
      }
    ></CardInnerWrapper>
  );
}
