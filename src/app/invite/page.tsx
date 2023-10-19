import { FC, Suspense } from "react";
import { Metadata } from "next";
import { prisma } from "@/utils/prisma";
import { Invite } from "./components";
import { Loading } from "@/components/Loading";

export const dynamicParams = true;

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const email = searchParams.ref;
  let name: string | undefined = undefined;
  if (typeof email === "string") {
    name = await prisma.user
      .findUnique({
        where: { email },
        select: { preferredName: true },
      })
      .then((user) => user?.preferredName);
  }
  if (!name) {
    return {
      title: "BTHS RTW Invitation",
      description:
        "We want YOU to join us!!! Come volunteer with us and make some change!",
    };
  }

  return {
    title: `BTHS RTW Invitation from ${name}`,
    description: `${name} wants YOU to join us!!! Come volunteer with us and make some change!`,
  };
}

const InvitePage: FC = () => {
  return (
    <Suspense fallback={<Loading>Loading invite...</Loading>}>
      <Invite />
    </Suspense>
  );
};

export default InvitePage;
