import { FC } from "react";
import Layout from "@/components/Layout";
import { ExecList, ExecsDetails } from "./server-components";
import { ExecDetails, User } from "@prisma/client";

async function fetchExecs() {
  const res = await fetch(
    `${process.env.BASE_URL}/api/exec-desc?refresh=${Date.now()}`,
    {
      next: {
        revalidate: 5,
      },
    }
  );
  return res.json();
}

export const metadata = {
  title: "Executives - BTHS Repair the World",
  description: "Meet the BTHS Repair the World executives.",
};

const ExecsPage: FC = async () => {
  const execs = fetchExecs();
  return (
    <Layout>
      <h1>Our Exec Team</h1>
      <ExecList execs={execs} />
    </Layout>
  );
};

export default ExecsPage;
