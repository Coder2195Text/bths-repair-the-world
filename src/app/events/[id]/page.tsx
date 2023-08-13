import { prisma } from "@/utils/prisma";
import { Metadata } from "next";
import EventPage from "./EventPage";
import { notFound } from "next/navigation";
import { FC } from "react";

export const dynamicParams = true;

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

export async function generateStaticParams() {
  const events = await prisma.event.findMany({
    select: { id: true },
  });

  return events.map((event) => ({ id: event.id }));
}

async function fetchEvent(id: string) {
  const res = await fetch(`${process.env.BASE_URL}/api/events/${id}`, {
    next: {
      revalidate: 10,
    },
  });
  if (res.status === 404) {
    return null;
  }
  return res.json();
}

const Page: FC<Params> = async ({ params: { id } }) => {
  const event = await fetchEvent(id);
  if (!event) {
    notFound();
  }
  event.eventTime = new Date(event.eventTime);
  event.createdAt = new Date(event.createdAt);

  return <EventPage event={event} />;
};

export default Page;
