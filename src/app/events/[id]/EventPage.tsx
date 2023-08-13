"use client";

import Layout from "@/components/Layout";
import { Event, EventAttendance, UserPosition } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import {
  BiCalendarPlus,
  BiLinkExternal,
  BiLogOut,
  BiTrash,
} from "react-icons/bi";
import {
  BsClock,
  BsAward,
  BsCalendar2Check,
  BsFillPersonCheckFill,
} from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import reactGemoji from "remark-gemoji";
import { EventParsed } from "@/types/event";
import EventForm from "@/components/EventForm";
import { Button, button } from "@material-tailwind/react";
import { useAccount } from "@/components/AccountContext";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useChannel, useEvent } from "@harelpls/use-pusher";
import { Params } from "@/app/api/events/[id]/route";

interface Props {
  event: EventParsed;
}

const EventPage: FC<Props> = ({ event: defaultEvent }) => {
  const { data } = useAccount();
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [event, setEvent] = useState<EventParsed>(defaultEvent);
  const [eventAttendance, setEventAttendance] = useState<
    EventAttendance | null | "unloaded"
  >("unloaded");
  const [buttonProgress, setButtonProgress] = useState<boolean>(false);
  const [deleteProgress, setDeleteProgress] = useState<boolean>(false);
  const router = useRouter();
  const { status } = useSession();

  const channel = useChannel(defaultEvent.id);
  useEvent(channel, "update", (data) => {
    console.log(data);
    if (eventAttendance && eventAttendance !== "unloaded")
      setEventAttendance({
        ...eventAttendance,
        ...(data as Partial<EventAttendance>),
      });
  });

  useEffect(() => {
    const fetchAttendance = async () => {
      const res = await fetch(`/api/events/${event.id}/attendance/@me`);
      const data = await res.json();
      console.log(data);
      setEventAttendance(data);
    };
    fetchAttendance();
  }, []);

  return (
    <Layout>
      {formOpen && (
        <EventForm
          mode="edit"
          setOpen={setFormOpen}
          eventData={event}
          setEventData={setEvent}
        />
      )}
      <h1 className="flex flex-wrap justify-around w-full">
        Event: {event.name}
      </h1>
      {([UserPosition.ADMIN, UserPosition.EXEC] as UserPosition[]).includes(
        data?.position!
      ) && (
        <>
          <Button
            color="blue"
            className="bg-[#2356ff] font-figtree p-1 text-2xl mx-2"
            onClick={() => setFormOpen(true)}
          >
            <BiCalendarPlus className="inline" /> Edit Event
          </Button>
          <Button
            color="blue"
            className="bg-[#2356ff] font-figtree p-1 text-2xl mx-2"
            onClick={() => router.push(`/events/${event.id}/attendance`)}
          >
            <BsFillPersonCheckFill className="inline" /> Attendance
          </Button>
          <Button
            color="red"
            className="bg-[#ff4a5a] font-figtree p-1 text-2xl mx-2"
            onClick={async () => {
              if (!confirm("Are you sure you want to delete this event?"))
                return;

              setDeleteProgress(true);
              const res = await fetch(`/api/events/${event.id}`, {
                method: "DELETE",
              });
              if (res.status === 200) {
                router.push("/events");
              } else {
                alert("Error deleting event!");
                setDeleteProgress(false);
              }
            }}
          >
            <BiTrash className="inline" /> Delete Event
          </Button>
        </>
      )}
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
          <h3>
            Event Time:{" "}
            {event.eventTime.toLocaleString("en-US", {
              timeZone: "America/New_York",
            })}
          </h3>
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
          <div className="min-h-[200px]">
            <ReactMarkdown remarkPlugins={[remarkGfm, reactGemoji]}>
              {event.description}
            </ReactMarkdown>
          </div>
          {status === "authenticated" ? (
            eventAttendance === "unloaded" ? (
              <h3>Loading Attendance...</h3>
            ) : eventAttendance ? (
              <>
                <h3>Event Attendance:</h3>
                <div>
                  You have registered for this event. You have{" "}
                  {!eventAttendance.attendedAt && "not"} attended the event and
                  earned {eventAttendance.earnedHours} hours and{" "}
                  {eventAttendance.earnedPoints} points.
                </div>
                {new Date(event?.eventTime) < new Date() ? (
                  <h5>You cannot leave an event that has already happened.</h5>
                ) : (
                  <Button
                    disabled={buttonProgress}
                    color="blue"
                    className="bg-[#2356ff] font-figtree p-1 text-2xl"
                    onClick={async () => {
                      setButtonProgress(true);
                      const res = await fetch(
                        `/api/events/${event.id}/attendance/@me`,
                        {
                          method: "DELETE",
                        }
                      );
                      if (res.status === 200) setEventAttendance(null);
                      else alert("Error leaving event!");
                      setButtonProgress(false);
                    }}
                  >
                    <BiLogOut className="inline" />{" "}
                    {buttonProgress ? "Leaving" : "Leave"} Event
                  </Button>
                )}
              </>
            ) : (
              <>
                <h3>Event Attendance:</h3>
                <div>You have not registered for this event yet.</div>
                {new Date(event?.eventTime) < new Date() ? (
                  <h5>You cannot join an event that has already happened.</h5>
                ) : (
                  <>
                    <h5>
                      By clicking join, you have read the description and done
                      anything required by it.
                    </h5>
                    <Button
                      disabled={buttonProgress}
                      color="blue"
                      className="bg-[#2356ff] font-figtree p-1 text-2xl"
                      onClick={async () => {
                        setButtonProgress(true);
                        const res = await fetch(
                          `/api/events/${event.id}/attendance/@me`,
                          {
                            method: "POST",
                          }
                        );
                        if (res.status === 200)
                          setEventAttendance(await res.json());
                        else alert("Error joining event!");
                        setButtonProgress(false);
                      }}
                    >
                      <BsCalendar2Check className="inline" />{" "}
                      {buttonProgress ? "Joining" : "Join"} Event
                    </Button>
                  </>
                )}
              </>
            )
          ) : (
            <>
              <h3>You must be logged in to join an event.</h3>
              <Button
                color="blue"
                className="bg-[#2356ff] font-figtree p-1 text-2xl"
                onClick={() => signIn("auth0")}
              >
                Login
              </Button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EventPage;
