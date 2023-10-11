import { FC } from "react";
import { Privacy } from "./components";
import Layout from "@/components/Layout";

export const metadata = {
  title: "Bylaws",
  description: "Club Constuition for BTHS Repair the World",
};

const Page: FC = () => {
  return (
    <Layout>
      <Privacy />
    </Layout>
  );
};

export default Page;
