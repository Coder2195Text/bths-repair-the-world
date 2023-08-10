"use client";
import { useAccount } from "@/components/AccountContext";
import Layout from "@/components/Layout";
import { Event } from "@prisma/client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { BsAward, BsClock } from "react-icons/bs";
import { FiXCircle, FiCheckCircle } from "react-icons/fi";
import { BarLoader } from "react-spinners";

enum LoadingState {
  Loading,
  Loaded,
  NoMore,
}

const Page: FC = () => {
  const { data } = useAccount();
  const { status } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<LoadingState>(LoadingState.Loading);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(LoadingState.Loaded);
      });
  }, []);

  return (
    <Layout>
      <h1>Events</h1>

      <div className="flex flex-col justify-center w-full">
        {events.map(
          ({ name, id, imageURL, eventTime, maxHours, maxPoints }) => (
            <Link
              href={`/events/${id}`}
              className="p-3 my-2 text-left text-white bg-white bg-opacity-10 rounded-lg hover:text-white hover:shadow-2xl shadow-white hover:brightness-75"
            >
              <div className="w-full">
                <div className="flex flex-col items-stretch w-full md:flex-row">
                  <div className="w-full md:w-1/2">
                    <h3>{name}</h3>
                    Starts at {new Date(eventTime).toLocaleString()}
                    <br />
                    <BsClock className="inline" /> Total Hours : {maxHours}
                    <br />
                    <BsAward className="inline" /> Total Points : {maxPoints}
                    <br />
                    {new Date(eventTime).getTime() < Date.now() ? (
                      <span className="text-red-300">
                        <FiXCircle className="inline" /> Event is no longer
                        accepting registration
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
          ),
        )}
        {loading === LoadingState.Loading ? (
          <div className="mt-5 text-center">
            <h5>Loading Events...</h5>
            <div className="flex justify-center w-full">
              <BarLoader
                color="#2563EB"
                className="my-3"
                width={600}
                height={10}
              />
            </div>
          </div>
        ) : loading === LoadingState.Loaded ? (
          <a
            onClick={async () => {
              setLoading(LoadingState.Loading);
              const more: Event[] = await fetch(
                `/api/events?page=${page}`,
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
        ) : (
          <div> No more events to load. </div>
        )}
      </div>
    </Layout>
  );
};

export default Page;
