import { FC } from "react";
import { Privacy } from "./components";
import Layout from "@/components/Layout";

export const metadata = {
  title: "Bylaws",
  description: "Club Bylaws for BTHS Action",
};

const Page: FC = () => {
  return (
    <Layout>
      <Privacy />
    </Layout>
  );
};

export default Page;
