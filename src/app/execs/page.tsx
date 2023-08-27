import { FC } from "react";
import Layout from "@/components/Layout";
import { ExecList, ExecsDetails } from "./server-components";
import { ExecDetails, User } from "@prisma/client";

async function fetchExecs() {
  const res = await fetch(`${process.env.BASE_URL}/api/exec-desc`, {
    next: {
      revalidate: 15,
    },
  });
  return res.json();
}

export const metadata = {
  title: "Executives - BTHS Repair the World",
  description: "Meet the BTHS Repair the World Executives.",
};

const ExecsPage: FC = async () => {
  const execs = await fetchExecs();
  return (
    <Layout>
      <h1>Our Exec Team</h1>
      <ExecList execs={execs} />
    </Layout>
  );
};

export default ExecsPage;
