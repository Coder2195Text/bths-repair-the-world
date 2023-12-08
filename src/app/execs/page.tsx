import { FC } from "react";
import Layout from "@/components/Layout";
import { ExecList } from "./server-components";

async function fetchExecs() {
  const res = await fetch(`${process.env.BASE_URL}/api/exec-desc`, {
    next: {
      revalidate: 5,
    },
  });
  return res.json();
}

export const metadata = {
  title: "Executives",
  description: "Meet the BTHS Action executives.",
};

const ExecsPage: FC = () => {
  const execs = fetchExecs();
  return (
    <Layout>
      <h1>Our Exec Team</h1>
      <ExecList execs={execs} />
    </Layout>
  );
};

export default ExecsPage;
