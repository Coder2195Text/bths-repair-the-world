"use client";

import { Button } from "@material-tailwind/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { FaRedo } from "react-icons/fa";

export const RetryButton: FC = () => {
  const router = useRouter();
  const { status } = useSession();
  if (status === "authenticated") router.push("/");

  return <Button
    ripple
    onClick={() => signIn("auth0")}
    className="bg-blue-500 p-1 text-2xl font-figtree"
  >
    <FaRedo className="inline-block mr-2" />
    Log in with another account
  </Button>
}


