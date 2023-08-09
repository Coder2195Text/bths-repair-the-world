"use client";
import { useAccount } from "@/components/AccountContext";
import Layout from "@/components/Layout";
import { Event } from "@prisma/client";
import { signIn, useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
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
        {
          events.map(({ name, id, imageURL, eventTime }) =>
            <div>
              {new Date(eventTime).toDateString()} {name}
            </div>
          )
        }
        {loading === LoadingState.Loading ? (
          <>
            Loading...
            <br />
            <BarLoader
              color="#2563EB"
              className="my-3"
              width={600}
              height={10}
            />
          </>
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
            Load More Events
          </a>
        ) : (
          <div> No more events to load. </div>
        )}
      </div>
    </Layout>
  );
};

export default Page;
