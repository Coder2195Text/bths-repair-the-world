import { FC } from "react";
import { Privacy } from "./components";
import Layout from "@/components/Layout";

export const metadata = {
  title: "Privacy Policy - BTHS Repair the World",
  description: "Privacy Policy for BTHS Repair the World",
};

const Page: FC = () => {
  return (
    <Layout>
      <Privacy />
    </Layout>
  );
};

export default Page;
