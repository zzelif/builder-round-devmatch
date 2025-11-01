// src/app/(auth)/complete-profile/page.tsx
import CompleteProfileForm from "./CompleteProfileForm";

export default function CompleteProfilePage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col">
        <CompleteProfileForm />
      </div>
    </div>
  );
}
