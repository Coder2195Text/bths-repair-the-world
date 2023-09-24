import Layout from "@/components/Layout";
import { EventAttendance, User } from "@prisma/client";
import { Metadata } from "next";
import { FC } from "react";
import { Spreadsheet } from "./components";

const metadata: Metadata = {
  title: "Spreadsheet - BTHS Repair the World",
  description:
    "Need to see your points and hours at any given time? This is where you get it!!!",
};

interface Data {
  events: Event[];
  users: (User & {
    events: EventAttendance[];
  })[];
}

const Page: FC = () => {
  return (
    <Layout>
      <h1>Spreadsheet</h1>
      <Spreadsheet />
    </Layout>
  );
};

export default Page;
