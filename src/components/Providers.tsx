import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
// import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar />
      {children}
    </>
    // <SessionProvider>

    // </SessionProvider>
  );
}
