"use client";

import { AccountProvider } from "@/components/AccountContext";
import { SessionProvider } from "next-auth/react";
import { AppProgressBar as NextNProgress } from "next-nprogress-bar";
import { MDXProvider } from "@mdx-js/react";
import { MDXComponents } from "mdx/types";
import { MergeComponents } from "@mdx-js/react/lib";
import Link from "next/link";

type Props = {
  children?: React.ReactNode;
};

const components: MDXComponents | MergeComponents = {
  a: (props) => (
    <a
      href={props?.href?.startsWith("#") ? undefined! : props.href!}
      onClick={(e) => {
        if (!props?.href?.startsWith("#")) return;
        e.preventDefault();
        document.getElementById(props.href!.slice(1))?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }}
    >
      {props.children}
    </a>
  ),
};

export const NextAuthProvider = ({ children }: Props) => {
  return (
    <MDXProvider components={components}>
      <AccountProvider>
        <NextNProgress options={{}} color="lightblue" height="5px" />
        <SessionProvider>{children}</SessionProvider>
      </AccountProvider>
    </MDXProvider>
  );
};
