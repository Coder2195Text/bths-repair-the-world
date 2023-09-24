"use client";
import { useAccount } from "@/components/AccountContext";
import EventForm from "@/components/EventForm";
import { Loading } from "@/components/Loading";
import { Button } from "@material-tailwind/react";
import { Event, UserPosition } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { BiCalendarPlus } from "react-icons/bi";
import { BsClock, BsAward } from "react-icons/bs";
import { FiXCircle, FiCheckCircle } from "react-icons/fi";

export const TitleBar: FC = () => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { data } = useAccount();

  return (
    <>
      {formOpen && <EventForm mode="post" setOpen={setFormOpen} />}
      <h1 className="flex flex-wrap justify-around w-full">
        Events
        {([UserPosition.ADMIN, UserPosition.EXEC] as UserPosition[]).includes(
          data?.position!
        ) && (
          <Button
            color="blue"
            className="bg-[#2356ff] font-figtree p-1 text-2xl"
            onClick={() => setFormOpen(true)}
          >
            <BiCalendarPlus className="inline" /> Add Event
          </Button>
        )}
      </h1>
    </>
  );
};

export const EventCard: FC<{
  event: Event & { formCount: number };
}> = ({
  event: {
    name,
    id,
    imageURL,
    eventTime,
    maxHours,
    maxPoints,
    formCount,
    limit,
  },
}) => {
  return (
    <Link
      key={id}
      href={`/events/${id}`}
      className="p-3 my-2 text-left text-white bg-white bg-opacity-10 rounded-lg hover:text-white hover:shadow-2xl shadow-white hover:brightness-75"
    >
      <div className="w-full">
        <div className="flex flex-col items-stretch w-full md:flex-row">
          <div className={`w-full ${imageURL ? "md:w-1/2" : ""}`}>
            <h3>{name}</h3>
            {new Date(eventTime).getTime() < Date.now()
              ? "Occured"
              : "Starts"}{" "}
            on {new Date(eventTime).toLocaleString()}
            <br />
            <BsClock className="inline" /> Total Hours : {maxHours}
            <br />
            <BsAward className="inline" /> Total Points : {maxPoints}
            <br />
            {new Date(eventTime).getTime() < Date.now() ||
            (limit && formCount >= limit) ? (
              <span className="text-red-300">
                <FiXCircle className="inline" /> Event is no longer accepting
                registration
              </span>
            ) : (
              <span className="text-green-300">
                <FiCheckCircle className="inline" /> Event is available
              </span>
            )}
          </div>
          {imageURL && (
            <>
              <div className="hidden relative w-1/2 md:block">
                <Image
                  src={imageURL}
                  fill
                  alt=""
                  className="object-contain pl-2 rounded-lg"
                />
              </div>
              <div className="relative mt-2 w-full md:hidden">
                <Image
                  src={imageURL}
                  alt=""
                  width={1000}
                  height={1000}
                  className="rounded-lg"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

enum LoadingState {
  Loading,
  Loaded,
  NoMore,
}

export const EventList: FC = () => {
  const [events, setEvents] = useState<(Event & { formCount: number })[]>([]);
  const [loading, setLoading] = useState<LoadingState>(LoadingState.Loading);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    fetch("/api/events?preview")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        if (data.length < 10) setLoading(LoadingState.NoMore);
        else setLoading(LoadingState.Loaded);
      });
  }, []);

  return (
    <div className="flex flex-col justify-center w-full">
      {events.map((event) => (
        <EventCard event={event} />
      ))}
      {loading === LoadingState.Loading && <Loading>Loading Events...</Loading>}
      {loading === LoadingState.Loaded && (
        <a
          onClick={async () => {
            setLoading(LoadingState.Loading);
            const more: (Event & { formCount: number })[] = await fetch(
              `/api/events?preview&page=${page}`
            ).then((res) => res.json());
            setPage(page + 1);
            setEvents([...events, ...more]);
            if (more.length !== 10) {
              setLoading(LoadingState.NoMore);
            } else {
              setLoading(LoadingState.Loaded);
            }
          }}
        >
          <h6>Load More Events</h6>
        </a>
      )}
      {loading === LoadingState.NoMore && <div> No more events to load. </div>}
    </div>
  );
};
