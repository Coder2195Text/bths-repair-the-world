import Layout from "@/components/Layout";
import { Event } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { BiLinkExternal } from "react-icons/bi";
import { BsClock, BsAward } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import reactGemoji from "remark-gemoji";
import { EventParsed } from "@/types/event";

interface Props {
  event: EventParsed;
}

const EventPage: FC<Props> = ({ event }) => {
  return (
    <Layout>
      <h1>Event: {event.name}</h1>
      <div className="w-full flex flex-wrap mt-5">
        <div className="w-full md:w-1/2 inline-block">
          {event.imageURL && (
            <Image
              src={event.imageURL}
              alt={event.name}
              width={1000}
              height={1000}
              className="w-full rounded-lg mb-5"
            />
          )}
          <h3>Rewards: </h3>
          <BsClock className="inline" /> Total Hours : {event.maxHours}
          <br />
          <BsAward className="inline" /> Total Points : {event.maxPoints}
          <br />
          <h3>Event Time: {event.eventTime.toLocaleString()}</h3>
          <h3>
            Location:{" "}
            <Link
              href={encodeURI(
                `https://www.google.com/maps/dir/?api=1&destination=${event.address}&travelmode=transit`
              )}
              target="_blank"
            >
              {event.address} <BiLinkExternal className="inline" />
            </Link>
          </h3>
          <iframe
            src={encodeURI(
              `https://maps.google.com/maps?q=${event.address}&t=&z=13&ie=UTF8&iwloc=&output=embed`
            )}
            className="w-full border-none h-60"
          ></iframe>
        </div>
        <div className="w-full md:w-1/2 inline-block">
          <h3>Event Description: </h3>
          <div className="min-h-[100px]">
            <ReactMarkdown remarkPlugins={[remarkGfm, reactGemoji]}>
              {event.description}
            </ReactMarkdown>
          </div>
          <h3>Event Attendance:</h3>
        </div>
      </div>
    </Layout>
  );
};

export default EventPage;
