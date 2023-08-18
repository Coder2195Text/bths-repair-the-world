"use client";

import { AccountProvider } from "@/components/AccountContext";
import { SessionProvider } from "next-auth/react";
import { AppProgressBar as NextNProgress } from "next-nprogress-bar";
import { MDXProvider } from "@mdx-js/react";
import { MDXComponents } from "mdx/types";
import { MergeComponents } from "@mdx-js/react/lib";
import Link from "next/link";
import {
  PusherProvider as $PusherProvider,
  type PusherProviderProps,
} from "@harelpls/use-pusher";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { useScrollDirection } from "react-use-scroll-direction";
import Navbar from "@/components/Navbar";

const PusherProvider = $PusherProvider as FC<
  PropsWithChildren<PusherProviderProps>
>;

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
  const [isNavActive, setIsNavActive] = useState<[boolean, number]>([
    true,
    Date.now(),
  ]);

  const [element, setElement] = useState<HTMLElement | null>(null);

  const { scrollDirection } = useScrollDirection(element!);

  useEffect(() => {
    setElement(document.getElementsByTagName("body")[0]);
  }, []);

  if (Date.now() - isNavActive[1] > 50 && scrollDirection !== null) {
    setIsNavActive([scrollDirection === "UP", Date.now()]);
  }
  return (
    <PusherProvider
      clientKey={process.env.NEXT_PUBLIC_PUSHER_KEY!}
      cluster={process.env.NEXT_PUBLIC_PUSHER_CLUSTER!}
    >
      <MDXProvider components={components}>
        <AccountProvider>
          <NextNProgress options={{}} color="lightblue" height="5px" />
          <SessionProvider>
            <Navbar isNavActive={isNavActive[0]} />
            {children}
          </SessionProvider>
        </AccountProvider>
      </MDXProvider>
    </PusherProvider>
  );
};
