"use client";
import { useAccount } from "@/components/AccountContext";
import EventForm from "@/components/EventForm";
import Layout from "@/components/Layout";
import { useChannel, useEvent } from "@harelpls/use-pusher";
import { Button } from "@material-tailwind/react";
import { colors } from "@material-tailwind/react/types/generic";
import { Event, EventAttendance, UserPosition } from "@prisma/client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createElement,
  useEffect,
  useState,
} from "react";
import { IconType } from "react-icons";
import {
  BiCalendarEdit,
  BiLinkExternal,
  BiLogOut,
  BiTrash,
} from "react-icons/bi";
import {
  BsAward,
  BsCalendar2Check,
  BsClock,
  BsFillPersonCheckFill,
} from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import reactGemoji from "remark-gemoji";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineWarning } from "react-icons/ai";
import { toast } from "react-toastify";

interface Props {
  event: Event;
}

interface PropsWrite extends Props {
  setEvent: Dispatch<SetStateAction<Event>>;
}


const AdminActions: FC<PropsWrite> = ({ event, setEvent }) => {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [deleteProgress, setDeleteProgress] = useState<boolean>(false);
  const router = useRouter();
  const { data } = useAccount();

  const ADMIN_BUTTONS: {
    color: string;
    hexColor: string;
    icon: IconType;
    onClick: () => any;
    children: ReactNode;
  }[] = [
    {
      color: "blue",
      hexColor: "#2356ff",
      icon: BiCalendarEdit,
      onClick: () => setFormOpen(true),
      children: "Edit Event",
    },
    {
      color: "blue",
      hexColor: "#2356ff",
      icon: BsFillPersonCheckFill,
      onClick: () => router.push(`/events/${event.id}/attendance`),
      children: "Attendance",
    },
    {
      color: "red",
      hexColor: "red",
      icon: BiTrash,
      onClick: async () => {
        if (!confirm("Are you sure you want to delete this event?")) return;

        setDeleteProgress(true);
        const res = await fetch(`/api/events/${event.id}`, {
          method: "DELETE",
        });
        if (res.status === 200) {
          toast.success("Successfully deleted event.");
          router.push("/events");
        } else {
          alert("Error deleting event!");
          setDeleteProgress(false);
        }
      },
      children: `${deleteProgress ? "Deleting" : "Delete"} Event${
        deleteProgress ? "..." : ""
      }`,
    },
  ];

  if (
    ([UserPosition.ADMIN, UserPosition.EXEC] as UserPosition[]).includes(
      data?.position!
    )
  )
    return (
      <div className="w-full flex items-center gap-2 gap-x-4 justify-center flex-wrap">
        {formOpen && (
          <EventForm
            mode="edit"
            setOpen={setFormOpen}
            eventData={event}
            setEventData={setEvent}
          />
        )}
        {ADMIN_BUTTONS.map(
          ({ hexColor, icon, onClick, children, color }, index) => (
            <Button
              key={index}
              color={color as colors}
              className={`${
                hexColor === "red" ? `bg-red-500` : `bg-[${hexColor}]`
              } font-figtree p-1 text-2xl flex items-center`}
              onClick={onClick}
            >
              {createElement(icon, { className: "mr-2" })}
              {children}
            </Button>
          )
        )}
      </div>
    );
};

const UserAttendance: FC<PropsWrite> = ({ event, setEvent }) => {
  const [buttonProgress, setButtonProgress] = useState<boolean>(false);
  const [formCount, setFormCount] = useState<number | "unloaded">("unloaded");
  const { status } = useSession();

  const [eventAttendance, setEventAttendance] = useState<
    EventAttendance | null | "unloaded"
  >("unloaded");

  const blockedJoin = event.limit
    ? (formCount as number) >= event.limit
    : false;

  const channel = useChannel(event.id);
  useEvent(channel, "update", (data) => {
    console.log(data);
    if (
      eventAttendance &&
      eventAttendance !== "unloaded" &&
      (data as EventAttendance).userEmail === eventAttendance.userEmail
    )
      setEventAttendance({
        ...eventAttendance,
        ...(data as Partial<EventAttendance>),
      });
  });

  useEvent(channel, "delete", () => {
    if (formCount !== "unloaded") setFormCount(formCount - 1);
  });

  useEvent(channel, "create", () => {
    if (formCount !== "unloaded") setFormCount(formCount + 1);
  });

  useEffect(() => {
    const fetchAttendance = async () => {
      const res = await fetch(`/api/events/${event.id}/attendance/@me`);
      const data = await res.json();
      console.log(data);
      setEventAttendance(data);
    };
    const fetchFormCount = async () => {
      const res = await fetch(`/api/events/${event.id}/attendance/form-count`);
      const data: {
        count: number;
        limit: number | null;
      } = await res.json();
      console.log(data);

      setEvent({
        ...event,
        limit: data.limit,
      })

      setFormCount(data.count);
    };

    fetchAttendance();
    fetchFormCount();
  }, []);

  if (status === "unauthenticated")
    return (
      <>
        <h3>You must be logged in to view attendance.</h3>
        <Button
          color="blue"
          className="bg-[#2356ff] font-figtree p-1 text-2xl"
          onClick={() => signIn("auth0")}
        >
          Login
        </Button>
      </>
    );
  if (
    eventAttendance === "unloaded" ||
    status === "loading" ||
    formCount === "unloaded"
  )
    return <h3>Loading Attendance...</h3>;

  return (
    <>
      <h3>Event Attendance:</h3>
      {eventAttendance && (
        <div>
          <h5>
            <AiOutlineWarning className="inline" /> You must check in and check
            out with an exec to get credit for the event.
          </h5>
          You have {!eventAttendance.attendedAt && "not"} attended the event and
          earned {eventAttendance.earnedHours} hours and{" "}
          {eventAttendance.earnedPoints} points.
        </div>
      )}
      {new Date(event?.eventTime) < new Date() ? (
        <h5>
          You cannot {eventAttendance ? "leave" : "join"} an event that has
          already happened.
        </h5>
      ) : (
        <>
          {!eventAttendance &&
            (blockedJoin ? (
              <h5>You cannot join this event because it is full.</h5>
            ) : (
              <h5>
                Reading the description is critical, as you may do something
                wrong and not get credit for the event.
                <br />
                {event.limit && (
                  <>
                    Event seats: {formCount}/{event.limit}
                  </>
                )}
              </h5>
            ))}
          <Button
            disabled={buttonProgress || (blockedJoin && !eventAttendance)}
            color="blue"
            className="bg-[#2356ff] font-figtree p-1 text-2xl"
            onClick={async () => {
              setButtonProgress(true);
              const res = await fetch(
                `/api/events/${event.id}/attendance/@me`,
                {
                  method: eventAttendance ? "DELETE" : "POST",
                }
              );
              if (res.status === 200) {
                toast.success(
                  `Successfully ${eventAttendance ? "left" : "joined"} event.`
                );
                eventAttendance
                  ? setEventAttendance(null)
                  : setEventAttendance(await res.json());
              } else
                toast.error(
                  `Error ${eventAttendance ? "leaving" : "joining"} event.`
                );
              setButtonProgress(false);
            }}
          >
            {createElement(eventAttendance ? BiLogOut : BsCalendar2Check, {
              className: "inline",
            })}{" "}
            {buttonProgress
              ? eventAttendance
                ? "Leaving"
                : "Joining"
              : eventAttendance
              ? "Leave"
              : "Join"}{" "}
            Event
          </Button>
        </>
      )}
    </>
  );
};

const EventDetails: FC<Props> = ({ event }) => {
  return (
    <>
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
        className="w-full border-none h-60 rounded-xl"
      ></iframe>
    </>
  );
};

const EventDescription: FC<Props> = ({ event }) => {
  return (
    <>
      <h3>Event Description: </h3>
      <div className="min-h-[200px] rounded-md bg-blue-gray-900 bg-opacity-50 p-2">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, reactGemoji]}
          linkTarget="_blank"
          components={{
            h1: (props) => <h1 {...props} className="text-[35px] font-[700]" />,
            h2: (props) => (
              <h2 {...props} className="text-[32.5px] font-[650]" />
            ),
            h3: (props) => <h3 {...props} className="text-[30px] font-[600]" />,
            h4: (props) => (
              <h4 {...props} className="text-[27.5px] font-[550]" />
            ),
            h5: (props) => <h5 {...props} className="text-[25px] font-[500]" />,
            h6: (props) => (
              <h6 {...props} className="text-[22.5px] font-[450]" />
            ),
          }}
        >
          {event.description}
        </ReactMarkdown>
      </div>
    </>
  );
};

export const EventPage: FC<Props> = ({ event: defaultEvent }) => {
  const [event, setEvent] = useState<Event>(defaultEvent);

  return (
    <Layout>
      <h1>Event: {event.name}</h1>
      <AdminActions event={event} setEvent={setEvent} />
      <div className="w-full flex flex-wrap mt-5">
        <div className="w-full md:w-1/2 p-2">
          <EventDetails event={event} />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <EventDescription event={event} />
          <UserAttendance event={event} setEvent={setEvent} />
        </div>
      </div>
    </Layout>
  );
};
