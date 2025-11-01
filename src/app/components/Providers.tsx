// src\components\Providers.tsx

import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
// import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      enableSystem={true}
      storageKey="theme"
      defaultTheme="system"
    >
      <ToastContainer position="bottom-right" hideProgressBar />
      {children}
    </ThemeProvider>
    // <SessionProvider>

    // </SessionProvider>
  );
}
