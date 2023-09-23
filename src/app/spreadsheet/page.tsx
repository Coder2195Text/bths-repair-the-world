import Layout from "@/components/Layout";
import { Metadata } from "next";
import { FC } from "react";

const metadata: Metadata = {
  title: "Spreadsheet - BTHS Repair the World",
  description:
    "Need to see your points and hours at any given time? This is where you get it!!!",
};

const Page: FC = () => {
  return (
    <Layout>
      <h1>Spreadsheet</h1>
    </Layout>
  );
};

export default Page;
