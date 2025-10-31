// src/app/networks/[userId]/photos/page.tsx - SIMPLE SERVER COMPONENT
import { getMemberPhotosByUserId } from "@/actions/memberActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { Camera } from "lucide-react";

export default async function PhotosPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const resolvedParams = await params;
  const photos = await getMemberPhotosByUserId(resolvedParams.userId);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Photos {photos && photos.length > 0 && `(${photos.length})`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!photos || photos.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-linear-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mb-6">
              <Camera className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Photos Yet
            </h3>
            <p className="text-gray-500">
              This developer hasn&apos;t uploaded any photos yet.
            </p>
          </div>
        ) : (
          // Photo Grid
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                {photo.publicId ? (
                  <CldImage
                    src={photo.publicId}
                    alt="Member photo"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    crop="fill"
                  />
                ) : (
                  <Image
                    src={photo.url}
                    alt="Member photo"
                    width={300} // ✅ Required
                    height={300} // ✅ Required
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
