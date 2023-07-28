"use client";

import Layout from "@/components/Layout";
import { Button } from "@material-tailwind/react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { FC } from "react";
import Typewriter from "typewriter-effect";
import { BsPencilSquare } from "react-icons/bs";

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
      <div className="inline-block relative my-3 w-full h-[50vw] lg:h-[600px]">
        <Image
          src="/images/home-banner.jpg"
          fill
          className="object-cover rounded-2xl"
          alt=""
        />
      </div>
      {status === "unauthenticated" && (
        <Button
          ripple
          onClick={() => signIn("auth0")}
          className="bg-blue-700 lg:p-4 p-[1.6vw]"
        >
          <h5 className="vscale">
            <BsPencilSquare className="inline-block mr-2 lg:w-9 w-[3.6vw]" />
            Join us now!
          </h5>
        </Button>
      )}
    </Layout>
  );
};

export default HomePage;
