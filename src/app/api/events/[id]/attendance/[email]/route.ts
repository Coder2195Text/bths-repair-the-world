import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { AUTH_OPTIONS } from "@/app/api/auth/[...nextauth]/options";
import Joi from "joi";
import { EventAttendance, UserPosition } from "@prisma/client";
import Pusher from "pusher";

type Params = { params: { id: string; email: string } };

const schema = Joi.object({
  earnedHours: Joi.number().min(0).optional(),
  earnedPoints: Joi.number().min(0).optional(),
  attendedAt: Joi.string().isoDate().optional().allow(null),
});

async function handler(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  req: NextRequest,
  { params: { id, email } }: Params
) {
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true,
  });
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  if (email !== "@me" && Joi.string().email().validate(email).error) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const event = await prisma.event.findUnique({
    where: { id },
    select: {
      eventTime: true,
      finishTime: true,
      limit: true,
      attendees: {
        select: {
          userEmail: true,
        },
      },
    },
  });

  if (!event)
    return NextResponse.json({ error: "Event not found" }, { status: 404 });

  const session = await getServerSession({ ...AUTH_OPTIONS });

  const rank = await (async () => {
    if (!session?.user?.email) return false;
    if (email == "@me" && session.user.email) {
      email = session.user.email;
      return "user";
    }

    return prisma.user
      .findUnique({
        where: { email: session.user.email },
        select: { position: true },
      })
      .then(
        (u) =>
          ([UserPosition.ADMIN, UserPosition.EXEC] as UserPosition[]).includes(
            u?.position!
          ) && "admin"
      );
  })();

  if (!rank) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (method === "GET") {
    const event = await prisma.eventAttendance.findUnique({
      where: {
        userEmail_eventId: {
          userEmail: email,
          eventId: id,
        },
      },
    });

    return NextResponse.json(event, { status: 200 });
  }

  if (rank == "user") {
    if (!event?.finishTime && new Date(event?.eventTime) < new Date())
      return NextResponse.json(
        { error: "Event has already passed" },
        { status: 403 }
      );
    else if (
      event?.finishTime &&
      new Date(event?.eventTime) > new Date() &&
      method == "POST"
    )
      return NextResponse.json(
        { error: "Event hasn't started" },
        { status: 403 }
      );
    else if (event?.finishTime && new Date(event?.finishTime) < new Date())
      return NextResponse.json(
        { error: "Event has already passed" },
        { status: 403 }
      );

    if (
      event?.limit &&
      event.attendees.length >= event.limit &&
      method === "POST"
    )
      return NextResponse.json({ error: "Event is full" }, { status: 403 });
  }

  if (method === "POST") {
    try {
      const eventAttendance = await prisma.eventAttendance.create({
        data: {
          userEmail: email,
          eventId: id,
        },
        include: {
          user: {
            select: {
              name: true,
              position: true,
              gradYear: true,
              preferredName: true,
            },
          },
        },
      });

      await pusher.trigger(id, "create", eventAttendance);

      return NextResponse.json(eventAttendance, { status: 200 });
    } catch (e) {
      return NextResponse.json(
        { error: (e as Error).toString() },
        { status: 500 }
      );
    }
  }

  if (method === "DELETE") {
    try {
      const eventAttendance = await prisma.eventAttendance.delete({
        where: {
          userEmail_eventId: {
            userEmail: email,
            eventId: id,
          },
        },
      });

      await pusher.trigger(id, "delete", {
        email,
      });

      return NextResponse.json(eventAttendance, { status: 200 });
    } catch (e) {
      return NextResponse.json(
        { error: (e as Error).toString() },
        { status: 500 }
      );
    }
  }

  if (rank === "user") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  if (!req.body)
    return NextResponse.json({ error: "Missing body" }, { status: 400 });

  const result = req.body
    .getReader()
    .read()
    .then((r) => r.value && new TextDecoder().decode(r.value))
    .then(function (val): [boolean, any] {
      let parsed;
      if (!val) return [false, "Missing body"];
      try {
        parsed = JSON.parse(val);
      } catch (e) {
        return [false, "Bad JSON"];
      }
      let errors = schema.validate(parsed).error;
      return errors ? [false, errors] : [true, parsed];
    });

  if ((await result)[0]) {
    const data: Partial<EventAttendance> = (await result)[1];
    try {
      const attendance = await prisma.eventAttendance.update({
        where: {
          userEmail_eventId: {
            userEmail: email,
            eventId: id,
          },
        },
        data,
      });

      await pusher.trigger(id, "update", attendance);
      return NextResponse.json(attendance, { status: 200 });
    } catch (e) {
      return NextResponse.json(
        { error: (e as Error).message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: (await result)[1] }, { status: 400 });
}

export const GET = handler.bind(null, "GET");
export const POST = handler.bind(null, "POST");
export const DELETE = handler.bind(null, "DELETE");
export const PATCH = handler.bind(null, "PATCH");
