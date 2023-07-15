"use client";

import { AccountProvider } from "@/components/AccountContext";
import { SessionProvider } from "next-auth/react";

type Props = {
  children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => {
  return (
    <AccountProvider>
      <SessionProvider>{children}</SessionProvider>
    </AccountProvider>
  );
};
