"use client";
import { AccountProvider } from "@/components/AccountContext";
import { SessionProvider } from "next-auth/react";
import { MDXProvider } from "@mdx-js/react";
import { MDXComponents } from "mdx/types";
import { MergeComponents } from "@mdx-js/react/lib";
import {
  PusherProvider as $PusherProvider,
  type PusherProviderProps,
} from "@harelpls/use-pusher";
import { FC, PropsWithChildren } from "react";
import Navbar from "@/components/Navbar";
import { AppProgressBar as NextNProgress } from "next-nprogress-bar";
import { ToastContainer } from "react-toastify";

const PusherProvider = $PusherProvider as FC<
  PropsWithChildren<PusherProviderProps>
>;

type Props = {
  children?: React.ReactNode;
};

const components: MDXComponents | MergeComponents = {
  a: (props) => (
    <a
      target={props?.href?.startsWith("/") ? "_self" : "_blank"}
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
  hr: () => <hr className="border-white my-2" />,
};

export const AppProviders = ({ children }: Props) => {
  return (
    <PusherProvider
      clientKey={process.env.NEXT_PUBLIC_PUSHER_KEY!}
      cluster={process.env.NEXT_PUBLIC_PUSHER_CLUSTER!}
    >
      <MDXProvider components={components}>
        {/* 
        // @ts-ignore */}
        <AccountProvider children>
          <SessionProvider>
            <Navbar isNavActive />
            {children}
          </SessionProvider>
        </AccountProvider>
      </MDXProvider>
      <ToastContainer
        position="bottom-right"
        className="z-50"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </PusherProvider>
  );
};

export const LoadingBar = () => (
  <NextNProgress options={{}} color="lightblue" height="5px" />
);
