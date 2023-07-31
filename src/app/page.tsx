"use client";

import Layout from "@/components/Layout";
import { Button } from "@material-tailwind/react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { FC } from "react";
import Typewriter from "typewriter-effect";
import { BsPencilSquare } from "react-icons/bs";
import { useKeenSlider } from "keen-slider/react";
import { AutoPlayPlugin } from "@/utils/keen-utils";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const HomePage: FC = () => {
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
    },
    [
      AutoPlayPlugin(2000),
      // add plugins here
    ]
  );
  const { status } = useSession();
  const rangeList = [...Array(2).keys()];
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
      <div className="relative">
        <div
          className="inline-block relative my-3 w-full rounded-2xl h-[50vw] keen-slider lg:h-[600px]"
          ref={sliderRef}
        >
          {rangeList.map((i) => (
            <div className="keen-slider__slide">
              <Image
                src={`/images/home${i + 1}.jpg`}
                fill
                className="object-cover"
                alt=""
              />
            </div>
          ))}
        </div>
        <button
          className="absolute left-0 top-1/2 bg-transparent -translate-y-1/2"
          onClick={(e) => {
            e.stopPropagation();
            instanceRef.current?.prev();
          }}
        >
          <FaChevronLeft className="w-10 h-10" />
        </button>
        <button
          className="absolute right-0 top-1/2 bg-transparent -translate-y-1/2"
          onClick={(e) => {
            e.stopPropagation();
            instanceRef.current?.next();
          }}
        >
          <FaChevronRight className="w-10 h-10" />
        </button>
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
