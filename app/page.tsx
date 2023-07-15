"use client";

import Layout from "@/components/Layout";
import { Button } from "@material-tailwind/react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { FC } from "react";

const HomePage: FC = () => {
  const { status } = useSession();
  return (
    <Layout>
      <h1 className="vscale">
        Inspiring BTHS youth to make change in a unjust society.
      </h1>
      <div className="relative my-3 w-full h-[50vw] lg:h-[600px]">
        <Image src="/images/home-1.png" fill className="object-cover" alt="" />
      </div>
      <h1 className="vscale">Mobilizing them for productivity.</h1>
      <div className="relative my-3 w-full h-[50vw] lg:h-[600px]">
        <Image src="/images/home-2.jpg" fill className="object-cover" alt="" />
      </div>
      <h1 className="vscale">
        BTHS Repair the World will set the stage for change.
      </h1>

      {status === "unauthenticated" && (
        <Button
          ripple
          onClick={() => signIn("auth0")}
          color="amber"
          className="mt-3"
        >
          <h3 className="vscale">Join us now!</h3>
        </Button>
      )}
    </Layout>
  );
};

export default HomePage;
