// src/components/Providers.tsx
"use client";

import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "next-themes";
import NotificationProvider from "./NotificationProvider";
import "react-toastify/dist/ReactToastify.css";
import { Session } from "next-auth";

interface ProvidersProps {
  children: ReactNode;
  session: Session | null;
}

export default function Providers({ children, session }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NotificationProvider session={session}>
        <ToastContainer
          position="bottom-right"
          hideProgressBar
          closeOnClick
          pauseOnHover
          theme="dark"
        />
      </NotificationProvider>
      {children}
    </ThemeProvider>
  );
}
