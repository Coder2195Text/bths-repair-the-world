import { FC } from "react";
import Layout from "@/components/Layout";
import { ExecList } from "./server-components";

export const metadata = {
  title: "Executives - BTHS Repair the World",
  description: "Meet the BTHS Repair the World Executives.",
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
