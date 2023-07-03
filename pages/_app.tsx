import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "@/styles/global.css";
import Navbar from "@/components/Navbar";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Navbar />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
