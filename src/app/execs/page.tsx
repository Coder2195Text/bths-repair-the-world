import { FC } from "react";
import Layout from "@/components/Layout";
import { ExecList } from "./components";
import { ExecDetails, User } from "@prisma/client";

export const metadata = {
  title: "Events - BTHS Repair the World",
  description: "Check out some of our events!",
};

const ExecsPage: FC = () => {
  return (
    <Layout>
      <h1>Our Exec Team</h1>
      <ExecList />
    </Layout>
  );
};

export default ExecsPage;
