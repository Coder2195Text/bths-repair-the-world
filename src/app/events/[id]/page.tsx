import { prisma } from "@/utils/prisma";
import { Metadata } from "next";
import { EventPage } from "./components";
import { notFound } from "next/navigation";
import { FC } from "react";
import probe from "probe-image-size";
import removeMarkdown from "markdown-to-text";

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
      title: "Nonexistent Event",
      description: "You may have attached a bad link.",
    };
  }

  const description = removeMarkdown(event.description.toString());
  let imageSize;
  if (event.imageURL) imageSize = await probe(event.imageURL);

  const metadata: Metadata = {
    title: event.name,
    description:
      description.length > 500
        ? description.substring(0, 500) + "..."
        : description,
    openGraph: {
      ...(event.imageURL
        ? {
            images: {
              url: event.imageURL,
              width: imageSize?.width,
              height: imageSize?.height,
            },
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
    },
  };

  return metadata;
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
