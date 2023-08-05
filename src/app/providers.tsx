"use client";

import { AccountProvider } from "@/components/AccountContext";
import { SessionProvider } from "next-auth/react";
import { AppProgressBar as NextNProgress } from "next-nprogress-bar";

type Props = {
  children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => {
  return (
    <AccountProvider>
      <NextNProgress options={{}} color="lightblue" height="5px" />
      <SessionProvider>{children}</SessionProvider>
    </AccountProvider>
  );
};
