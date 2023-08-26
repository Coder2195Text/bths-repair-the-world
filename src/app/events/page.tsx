import { FC } from "react";
import Layout from "@/components/Layout";
import { EventList, TitleBar } from "./components";

export const metadata = {
  title: "Events - BTHS Repair the World",
  description: "Check out some of our events!",
};

const Page: FC = () => {
  return (
    <Layout>
      <TitleBar />
      <EventList />
    </Layout>
  );
};

export default Page;
