import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { AUTH_OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import Joi from "joi";
import { UserPosition } from "@prisma/client";
import { Exception } from "@prisma/client/runtime/library";

type Params = { params: { id: string; email: string } };

async function handler(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  req: NextRequest,
  { params: { id, email } }: Params
) {
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

  if (rank !== "admin" && new Date(event?.eventTime) < new Date()) {
    return NextResponse.json(
      { error: "Event has already passed" },
      { status: 403 }
    );
  }

  if (method === "POST") {
    try {
      const event = await prisma.eventAttendance.create({
        data: {
          userEmail: email,
          eventId: id,
        },
      });

      return NextResponse.json(event, { status: 200 });
    } catch (e) {
      return NextResponse.json(
        { error: (e as Exception).toString() },
        { status: 500 }
      );
    }
  }

  if (method === "DELETE") {
    try {
      const event = await prisma.eventAttendance.delete({
        where: {
          userEmail_eventId: {
            userEmail: email,
            eventId: id,
          },
        },
      });

      return NextResponse.json(event, { status: 200 });
    } catch (e) {
      return NextResponse.json(
        { error: (e as Exception).toString() },
        { status: 500 }
      );
    }
  }
}

export const GET = handler.bind(null, "GET");
export const POST = handler.bind(null, "POST");
export const DELETE = handler.bind(null, "DELETE");
