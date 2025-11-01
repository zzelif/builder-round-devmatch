// src/app/networks/[userId]/photos/page.tsx
"use client";

import { getMemberPhotosByUserId } from "@/actions/memberActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { Photo } from "@prisma/client";

export default function PhotosPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{
    userId: string;
  } | null>(null);

  useEffect(() => {
    params.then((p) => {
      setResolvedParams(p);
    });
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchPhotos = async () => {
      try {
        const data = await getMemberPhotosByUserId(resolvedParams.userId);
        setPhotos(data || []);
      } catch (error) {
        console.error("Error fetching photos:", error);
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [resolvedParams]);

  if (loading) {
    return (
      <Card className="border-b border-border">
        <CardContent className="py-20">
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground">Loading photos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-b border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Camera className="w-5 h-5 text-primary" />
          Photos {photos && photos.length > 0 && `(${photos.length})`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!photos || photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-linear-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Camera className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Photos Yet
            </h3>
            <p className="text-muted-foreground max-w-sm">
              This developer hasn&apos;t uploaded any photos yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square overflow-hidden rounded-xl border border-border/50 shadow-md hover:shadow-xl hover:border-primary/50 transition-all duration-300"
              >
                {photo.publicId ? (
                  <CldImage
                    src={photo.publicId}
                    alt="Member photo"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500 ease-out"
                    crop="fill"
                  />
                ) : (
                  <Image
                    src={photo.url}
                    alt="Member photo"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500 ease-out"
                    unoptimized
                    priority
                  />
                )}

                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
