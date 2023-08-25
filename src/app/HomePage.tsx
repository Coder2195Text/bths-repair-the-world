"use client";

import Layout from "@/components/Layout";
import {
  Button,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { FC, ReactNode } from "react";
import Typewriter from "typewriter-effect";
import { BsPencilSquare, BsTools } from "react-icons/bs";
import { FaFistRaised } from "react-icons/fa";
import { MdRestore } from "react-icons/md";
import { GiEarthAmerica, GiPowerLightning } from "react-icons/gi";
import { AiOutlineStock } from "react-icons/ai";

const REPAIR_TABS: {
  label: ReactNode;
  value: string;
  content: ReactNode;
}[] = [
  {
    label: "R",
    value: "r",
    content: (
      <>
        <h3 className="flex items-center justify-center">
          Real Change
          <GiEarthAmerica className="hidden sm:inline ml-2 " />
        </h3>
        Don't lie to yourself. What has 100B dollars done for the peace in the
        Russo-Ukrainian war? What kind of world problems have been solved by
        dumping money stolen from the poor? We encourage our members to aim for
        non monetary methods of helping the community. We believe that the
        world's problems can be solved by the people, not by the money. Monetary
        methods are allowed on the side, but our club will utilize the power of
        the people to make a difference.
      </>
    ),
  },
  {
    label: "E",
    value: "e",
    content: (
      <>
        <h3 className="flex items-center justify-center">
          Empowerment
          <GiPowerLightning className="hidden sm:inline ml-2 " />
        </h3>
        We believe that everyone has the power to make a difference. Through
        various events, we work tirelessly to empower individuals to take action
        and make change. Whether it's providing resources to those in need,
        educating others on important issues, or inspiring youth to become
        leaders, it mobilizes people to make a difference.
      </>
    ),
  },
  {
    label: "P",
    value: "p",
    content: (
      <>
        <h3 className="flex items-center justify-center">
          Progress
          <AiOutlineStock className="hidden sm:inline ml-2 " />
        </h3>
        We know that the world is constantly changing. Sometimes it's for the
        better, and sometimes it's for the worse. Through our various projects,
        we progress tirelessly to make the world a better place, no matter the
        cirumstances. Whether it's fighting for social justice, advocating for
        the environment, or promoting equality, it sets the stage for change.
      </>
    ),
  },
  {
    label: "A",
    value: "a",
    content: (
      <>
        <h3 className="flex items-center justify-center">
          Action
          <BsTools className="hidden sm:inline ml-2 " />
        </h3>
        Do the world's problems come by surprise? No. Do they go away by
        themselves? No. We know that the world needs help, and we're not afraid
        to take action. Through our various projects, we work tirelessly to
        tackle the world's problems head-on. Whether it's helping communities
        shadowed by poverty, racism, or inequality, we should all take action to
        make a difference.
      </>
    ),
  },
  {
    label: "I",
    value: "i",
    content: (
      <>
        <h3 className="flex items-center justify-center">
          Impact
          <FaFistRaised className="hidden sm:inline ml-2 " />
        </h3>
        Our work is not done in vain. We should make it so that our efforts have
        a lasting impact on the world around us. We dismantle the barriers that
        prevent changes from being made. After all, we came to REPAIR, not to
        make a temporary fix. The world never changed by temporary fixes, did
        it?
      </>
    ),
  },
  {
    label: "R",
    value: "lr",
    content: (
      <>
        <h3 className="flex items-center justify-center">
          Restoration
          <MdRestore className="hidden sm:inline ml-2 " />
        </h3>
        We understand that sometimes the world needs healing. Through
        collaborative efforts and dedicated initiatives, we work tirelessly to
        mend what's been fractured and restore what's been lost. Whether it's
        revitalizing neglected urban spaces, rehabilitating natural habitats, or
        helping communities recover from adversity, it breathes new life into
        the world around us.
      </>
    ),
  },
];

const HomePage: FC = () => {
  const { status } = useSession();

  return (
    <>
      <div className="relative w-full min-h-[570px] h-[90vh] rounded-xl mb-3">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center ">
          <h1 className="title">BTHS Repair the World</h1>
          <h4>
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
          </h4>
        </div>

        <Image
          src="/images/banner.jpg"
          alt=""
          fill
          className="object-cover -z-20 brightness-75"
        />
      </div>
      <Layout>
        <Tabs value="r" className="-mt-10">
          <TabsHeader className="flex">
            {REPAIR_TABS.map(({ label, value }) => (
              <Tab key={value} value={value}>
                <h6
                  className="lg:text-[40px] lg:font-[800] md:text-[35px] md:font-[700];
              sm:text-[30px] sm:font-[600] text-[25px] font-[500] flex items-center"
                >
                  {label}
                </h6>
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            {REPAIR_TABS.map(({ value, content }) => (
              <TabPanel
                key={value}
                value={value}
                className="text-white font-raleway"
              >
                {content}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>

        {status === "unauthenticated" && (
          <Button
            ripple
            onClick={() => signIn("auth0")}
            className="bg-blue-700 lg:p-4 p-[1.6vw]"
          >
            <h5>
              <BsPencilSquare className="inline-block mr-2 lg:w-9 w-[3.6vw]" />
              Join us now!
            </h5>
          </Button>
        )}
      </Layout>
    </>
  );
};

export default HomePage;
