"use client";

import Layout from "@/components/Layout";
import TOS from "@/mdx/tos.mdx";
import { FC } from "react";

const Page: FC = () => {
  return (
    <Layout>
      <div className="w-full text-left">
        <TOS />
      </div>
    </Layout>
  );
};

export default Page;
