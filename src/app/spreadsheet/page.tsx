import Layout from "@/components/Layout";
import { Event, EventAttendance, User } from "@prisma/client";
import { Metadata } from "next";
import { FC } from "react";
import { Spreadsheet } from "./server-components";
import { LiaUserTieSolid } from "react-icons/lia";
import { getServerSession } from "next-auth";
import { AUTH_OPTIONS } from "../api/auth/[...nextauth]/options";
import { LoginButton } from "./components";

export const metadata: Metadata = {
  title: "Spreadsheet",
  description:
    "Need to see your points and hours at any given time? This is where you get it!!!",
};

export interface Data {
  events: Event[];
  users: (User & {
    events: EventAttendance[];
  })[];
}

async function fetchData() {
  const res = await fetch(`${process.env.BASE_URL}/api/spreadsheet`, {
    next: {
      revalidate: 60,
    },
  });
  return res.json() as Promise<Data>;
}

const Page: FC = async () => {
  const data = fetchData();
  const session = await getServerSession(AUTH_OPTIONS);
  const spreadsheet = <Spreadsheet data={data} />;
  return (
    <Layout>
      <h1>Spreadsheet</h1>
      <h6>
        Please note that all executives automatically get full credits, denoted
        as <LiaUserTieSolid className="inline-block" />
      </h6>
      {session ? (
        spreadsheet
      ) : (
        <>
          You must be logged in to view spreadsheet <br />
          <LoginButton />
        </>
      )}
    </Layout>
  );
};

export default Page;
