import { FC } from "react";
import Layout from "@/components/Layout";
import { ExecList } from "./components";
import { ExecDetails, User } from "@prisma/client";

export const metadata = {
  title: "Execs - BTHS Repair the World",
  description: "Check out our exec team! Our execs are very cool fr no cap!",
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
