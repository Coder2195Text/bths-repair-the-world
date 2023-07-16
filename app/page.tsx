"use client";

import Layout from "@/components/Layout";
import { Button } from "@material-tailwind/react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { FC } from "react";
import Typewriter from "typewriter-effect";

const HomePage: FC = () => {
  const { status } = useSession();
  return (
    <Layout>
      <h1 className="mb-6 underline vscale decoration-blue-700 decoration-[2vw] 2xl:decoration-[26px]">
        BTHS Repair the World
      </h1>
      <h3 className="vscale">
        <Typewriter
          options={{
            strings: [
              "While key club scams you, we provide the keys to change.",
              "Inspiring BTHS youth to make change in a unjust society.",
              "Empowering everyone to make a difference.",
              "Mobilizing productivity for a better tomorrow.",
              "Setting the stage for change.",
              "Repairing the world, one step at a time.",
            ],
            autoStart: true,
            loop: true,
          }}
        />
      </h3>
      <div className="relative my-3 w-full h-[50vw] lg:h-[600px]">
        <Image
          src="/images/home-banner.jpg"
          fill
          className="object-cover"
          alt=""
        />
      </div>
      {status === "unauthenticated" && (
        <Button ripple onClick={() => signIn("auth0")} color="amber">
          <h4 className="vscale">Join us now!</h4>
        </Button>
      )}
    </Layout>
  );
};

export default HomePage;
