"use client";

import Layout from "@/components/Layout";
import Privacy from "@/mdx/privacy.mdx";
import { FC } from "react";

const Page: FC = () => {
  return (
    <Layout>
      <div className="w-full text-left">
        <Privacy />
      </div>
    </Layout>
  );
};

export default Page;
