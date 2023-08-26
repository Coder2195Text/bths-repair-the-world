import { FC } from "react";
import { Banner, JoinButton, REPAIRTabs } from "./components";
import Layout from "@/components/Layout";

export const metadata = {
  title: "Home - BTHS Repair the World",
  description: "Inspring BTHS youth to make change in a unjust society.",
};

const HomePage: FC = () => {
  return (
    <>
      <Banner />
      <Layout>
        <REPAIRTabs />
        <JoinButton />
      </Layout>
    </>
  );
};

export default HomePage;
