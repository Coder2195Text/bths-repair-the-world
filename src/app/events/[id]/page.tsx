import { prisma } from "@/utils/prisma";
import { Metadata } from "next";
import Page from "./EventPage";

type Params = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params: { id },
}: Params): Promise<Metadata> {
  const event = await prisma.event.findUnique({
    where: { id },
    select: { name: true, description: true, imageURL: true },
  });

  if (!event) {
    return {
      title: "Nonexistent Event - BTHS Repair the World",
      description: "You may have attached a bad link.",
    };
  }

  const description = event.description.toString();

  return {
    title: `${event.name} - BTHS Repair the World`,
    description:
      description.length > 200
        ? description.substring(0, 200) + "..."
        : description,
    openGraph: { ...(event.imageURL ? { images: event.imageURL } : {}) },
  };
}

export default Page;
