import { getMemberPhotosByUserId } from "@/actions/memberActions";
import { CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";

export default async function PhotosPage({
  params,
}: {
  params: { userId: string };
}) {
  const photos = await getMemberPhotosByUserId(params.userId);

  return (
    <>
      <CardHeader>Photos</CardHeader>
      <Separator />
      <CardContent>
        <div className="grid grid-cols-5 gap-3">
          {photos &&
            photos.map((photo) => (
              <div key={photo.url}>
                <Image
                  src={photo.url}
                  alt="Image of member"
                  className="object-cover aspect-square"
                ></Image>
              </div>
            ))}
        </div>
      </CardContent>
    </>
  );
}
