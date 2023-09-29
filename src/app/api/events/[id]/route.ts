import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_OPTIONS } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { Event, UserPosition } from "@prisma/client";
import Joi from "joi";

export type Params = { params: { id: string } };

const schema = Joi.object({
  limit: Joi.number().optional().allow(null),
  name: Joi.string().optional().max(190),
  description: Joi.string().optional().max(4000),
  maxPoints: Joi.number().optional().min(0),
  eventTime: Joi.date().iso().optional(),
  imageURL: Joi.string().uri().optional().allow(null),
  maxHours: Joi.number().optional().min(0),
  address: Joi.string().optional().max(1000),
});

async function handler(
  method: "GET" | "PATCH" | "DELETE",
  req: NextRequest,
  { params: { id } }: Params
) {
  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event)
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  if (method === "GET") {
    return NextResponse.json(event, { status: 200 });
  }

  const allowed = await getServerSession({
    ...AUTH_OPTIONS,
  }).then(async (s) => {
    if (!s?.user.email) return false;
    return await prisma.user
      .findUnique({
        where: { email: s.user.email },
        select: { position: true, email: true },
      })
      .then((u) =>
        ([UserPosition.EXEC, UserPosition.ADMIN] as UserPosition[]).includes(
          u?.position!
        )
      );
  });

  if (!allowed)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  if (method === "DELETE") {
    try {
      await prisma.eventAttendance.deleteMany({
        where: { eventId: id },
      });
      const event = await prisma.event.delete({
        where: { id },
      });
      return NextResponse.json(event, { status: 200 });
    } catch (e) {
      return NextResponse.json(
        { error: (e as Error).message },
        { status: 500 }
      );
    }
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
    const data: Partial<Event> = (await result)[1];

    try {
      if (data.description) {
        data.description = data.description.replaceAll("{@link}", `https://bths-repair.tech/events/${id}`);
      }
      const eventUpdated = await prisma.event.update({
        where: { id },
        data: data,
      });
      return NextResponse.json(eventUpdated, { status: 200 });
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
export const PATCH = handler.bind(null, "PATCH");
export const DELETE = handler.bind(null, "DELETE");
