import Layout from "@/components/Layout";

import { FC } from "react";
import { TOS } from "./components";

export const metadata = {
  title: "FAQ",
  description: "FAQ for BTHS Action",
};

const Page: FC = () => {
  return (
    <Layout>
      <TOS />
    </Layout>
  );
};

export default Page;
