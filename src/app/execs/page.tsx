import { FC } from "react";
import ExecsPage from "./ExecsPage";
import { ExecDetails, User } from "@prisma/client";

async function fetchExecs() {
  const res = await fetch(`${process.env.BASE_URL}/api/exec-desc`, {
    next: {
      revalidate: 30,
    },
  });
  return res.json();
}

export type ExecsDetails = ({
  execDetails?: ExecDetails;
} & Pick<User, "name" | "preferredName" | "gradYear" | "pronouns" | "email">)[];

export const metadata = {
  title: "Executives - BTHS Repair the World",
  description: "Meet the BTHS Repair the World Executives.",
};

const Page: FC = async () => {
  const execs = (await fetchExecs()) as ExecsDetails;
  return <ExecsPage execs={execs} />;
};

export default Page;
