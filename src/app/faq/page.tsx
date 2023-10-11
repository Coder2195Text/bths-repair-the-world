import Layout from "@/components/Layout";

import { FC } from "react";
import { TOS } from "./components";

export const metadata = {
  title: "FAQ",
  description: "FAQ for Repair the World",
};

const Page: FC = () => {
  return (
    <Layout>
      <TOS />
    </Layout>
  );
};

export default Page;
