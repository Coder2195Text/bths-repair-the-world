"use client";

import { Params } from "@/app/api/events/[id]/route";
import { useAccount } from "@/components/AccountContext";
import Layout from "@/components/Layout";
import { Event, EventAttendance, User, UserPosition } from "@prisma/client";
import { FC, useEffect, useState, useRef } from "react";
import { BsClipboard2Check, BsClipboard2X } from "react-icons/bs";
import { Button } from "@material-tailwind/react";
import { useChannel, useEvent } from "@harelpls/use-pusher";
import { Loading } from "@/components/Loading";
import { toast } from "react-toastify";
import Link from "next/link";

type Attendance = {
  user: {
    name: string;
    preferredName: string | null;
    gradYear: number;
    position: UserPosition;
  };
} & EventAttendance;

const CheckInButton: FC<{ attendance: Attendance; event: Event }> = ({
  attendance,
  event,
}) => {
  const [buttonProgress, setButtonProgress] = useState<boolean>(false);
  return (
    <Button
      color="light-green"
      className="p-1 text-xl"
      onClick={async () => {
        if (
          !confirm(
            `Are you sure you want to check in ${attendance.user.preferredName} (${attendance.userEmail})`
          )
        )
          return;
        setButtonProgress(true);
        const res = await fetch(
          `/api/events/${event.id}/attendance/${attendance.userEmail}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              attendedAt: new Date().toISOString(),
            }),
          }
        );

        if (res.status < 400) {
          toast.success(
            `Successfully checked in ${attendance.user.preferredName} (${attendance.userEmail})`
          );
        } else {
          toast.error(
            `Error checking in ${attendance.user.preferredName} (${attendance.userEmail})`
          );
        }

        setButtonProgress(false);
      }}
    >
      <BsClipboard2Check className="inline" /> Check{buttonProgress && "ing"} In
    </Button>
  );
};

const RemoveButton: FC<{ attendance: Attendance; event: Event }> = ({
  attendance,
  event,
}) => {
  const [buttonProgress, setButtonProgress] = useState<boolean>(false);
  return (
    <Button
      color="red"
      className="p-1 text-xl mx-2"
      onClick={async () => {
        if (
          !confirm(
            `Are you sure you want to remove the check in of ${attendance.user.preferredName} (${attendance.userEmail})`
          )
        )
          return;
        setButtonProgress(true);
        const res = await fetch(
          `/api/events/${event.id}/attendance/${attendance.userEmail}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              attendedAt: null,
              earnedPoints: 0,
              earnedHours: 0,
            }),
          }

        );

        if (res.status < 400) {
          toast.success(
            `Successfully removed the check in of ${attendance.user.preferredName} (${attendance.userEmail})`
          );
        } else {
          toast.error(
            `Error removing the check in of ${attendance.user.preferredName} (${attendance.userEmail})`
          );
        }
        setButtonProgress(false);
      }}
    >
      <BsClipboard2X className="inline" /> Remov{buttonProgress ? "ing" : "e"}{" "}
      Check In
    </Button>
  );
};

const EventAttendancePage: FC<Params> = ({ params: { id } }) => {
  const { data, status } = useAccount();
  const [event, setEvent] = useState<Event | null | "unset">("unset");
  const [attendance, setAttendance] = useState<Attendance[] | null | "unset">(
    "unset"
  );

  const pointsRef = useRef<{ [key: string]: HTMLInputElement }>({});
  const hoursRef = useRef<{ [key: string]: HTMLInputElement }>({});

  const channel = useChannel(id);
  useEvent(channel, "create", (rawData) => {
    let data = rawData as Attendance;
    if (data.attendedAt) {
      data.attendedAt = new Date(data.attendedAt);
    }
    if (attendance && attendance !== "unset")
      setAttendance([...attendance, data as Attendance]);
  });

  useEvent(channel, "delete", (rawData) => {
    let data = rawData as Attendance;
    if (data.attendedAt) {
      data.attendedAt = new Date(data.attendedAt);
    }
    if (attendance && attendance !== "unset")
      setAttendance(
        attendance.filter((a) => a.userEmail !== (data as Partial<User>).email)
      );
  });

  useEvent(channel, "update", (rawData) => {
    let data = rawData as Attendance;
    if (data.earnedHours && hoursRef.current[data.userEmail]) {
      hoursRef.current[data.userEmail].value = data.earnedHours.toString();
    }
    if (data.earnedPoints && pointsRef.current[data.userEmail]) {
      pointsRef.current[data.userEmail].value = data.earnedPoints.toString();
    }
    if (data.attendedAt) {
      data.attendedAt = new Date(data.attendedAt);
    }
    if (attendance && attendance !== "unset")
      setAttendance(
        attendance.map((a) =>
          a.userEmail === (data as Attendance).userEmail
            ? { ...a, ...(data as Attendance) }
            : a
        )
      );
  });

  useEffect(() => {
    const fetchAttendance = async () => {
      await Promise.all([
        fetch(`/api/events/${id}/attendance`).then(async (res) =>
          setAttendance(
            res.status < 400
              ? ((await res.json()) as Attendance[]).map((a) => ({
                ...a,
                ...(a.attendedAt
                  ? { attendedAt: new Date(a.attendedAt) }
                  : {}),
              }))
              : null
          )
        ),
        fetch(`/api/events/${id}`).then(async (res) =>
          setEvent(res.status < 400 ? await res.json() : null)
        ),
      ]);
    };
    fetchAttendance();
  }, []);

  return (
    <Layout>
      {(event === "unset" || attendance === "unset") && (
        <Loading>Loading event attendance...</Loading>
      )}
      {event !== "unset" &&
        attendance !== "unset" &&
        (event && attendance ? (
          <>
            <h1>{event.name} - Attendance</h1>
            <div className="w-full">
              {attendance.map((userAttendance) => (
                <div
                  key={userAttendance.userEmail}
                  className="border-2 border-solid border-gray-500 p-2"
                >
                  {userAttendance?.user?.preferredName} (
                  {userAttendance?.user?.name}) - {userAttendance?.userEmail}
                  <br />
                  <div>
                    {userAttendance?.attendedAt ? (
                      <>
                        <span className="mr-2">
                          Marked present at{" "}
                          {userAttendance.attendedAt.toLocaleString("en-us", {
                            timeZone: "America/New_York",
                          })}
                          <RemoveButton
                            attendance={userAttendance}
                            event={event}
                          />
                        </span>

                        <label>
                          Points:
                          <input
                            ref={(element) =>
                            (pointsRef.current[userAttendance.userEmail] =
                              element!)
                            }
                            type="number"
                            min="0"
                            className="custom w-12"
                            max={event?.maxPoints}
                            defaultValue={userAttendance?.earnedPoints}
                            step={0.1}
                            onBlur={async (e) => {
                              const res = await fetch(
                                `/api/events/${event.id}/attendance/${userAttendance.userEmail}`,
                                {
                                  method: "PATCH",
                                  body: JSON.stringify({
                                    earnedPoints: parseFloat(
                                      e.currentTarget.value
                                    ),
                                  }),
                                }
                              );
                              if (res.status >= 400) {
                                alert(
                                  "Error updating points. Please try again later."
                                );
                              }
                            }}
                            onChange={(e) => console.log(e.currentTarget.value)}
                          />
                        </label>
                        <label>
                          Hours:
                          <input
                            className="custom w-12"
                            type="number"
                            min="0"
                            step={0.25}
                            max={event?.maxHours}
                            defaultValue={userAttendance?.earnedHours}
                            ref={(element) =>
                            (hoursRef.current[userAttendance.userEmail] =
                              element!)
                            }
                            onBlur={async (e) => {
                              const res = await fetch(
                                `/api/events/${event.id}/attendance/${userAttendance.userEmail}`,
                                {
                                  method: "PATCH",
                                  body: JSON.stringify({
                                    earnedHours: parseFloat(
                                      e.currentTarget.value
                                    ),
                                  }),
                                }
                              );
                            }}
                          />
                        </label>
                      </>
                    ) : (
                      <>
                        <CheckInButton
                          attendance={userAttendance}
                          event={event}
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (<>
          <h1>Not authorized to do attendance</h1>
          <Link href={`/events/${id}`}>
            Go back to event
          </Link>
        </>
        ))}
    </Layout>
  );
};

export default EventAttendancePage;
