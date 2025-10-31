import { getMemberPhotosByUserId } from "@/actions/memberActions";
import CardInnerWrapper from "@/components/CardInnerWrapper";
import Image from "next/image";

export default async function PhotosPage({
  params,
}: {
  params: { userId: string };
}) {
  const photos = await getMemberPhotosByUserId(params.userId);

  return (
    <CardInnerWrapper
      header="Photos"
      body={
        <div className="grid grid-cols-5 gap-3">
          {photos &&
            photos.map((photo) => (
              <div key={photo.url}>
                <Image
                  src={photo.url}
                  alt="Image of member"
                  className="object-cover aspect-square"
                />
              </div>
            ))}
        </div>
      }
    ></CardInnerWrapper>
  );
}
