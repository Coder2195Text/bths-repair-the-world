import Layout from "@/components/Layout";
import { FC } from "react";
import { RetryButton } from "./components";

const InvalidEmail: FC = () => {
  return <Layout>
    <h1>Invalid Email</h1>
    You must use an account connected to your nycstudents.net or schools.nyc.gov email.
    <br />
    <RetryButton />
  </Layout>;
}

export default InvalidEmail;
