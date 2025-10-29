import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar />
      {children}
    </>
  );
}
