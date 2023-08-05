"use client";
import Layout from "@/components/Layout";
import { signIn, useSession } from "next-auth/react";
import { FC } from "react";

const Page: FC = () => {
  const { data, status } = useSession();

  if (status === "unauthenticated") {
    signIn("auth0");
  }

  return (
    <Layout>
      {status === "authenticated" && (
        <>
          <h1>Events</h1>
          <button onClick={() => alert("hi")}>hi</button>
        </>
      )}
    </Layout>
  );
};

export default Page;
