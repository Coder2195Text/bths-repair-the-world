import { getServerSession } from "next-auth";
import { AUTH_OPTIONS } from "../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import { prisma } from "@/utils/prisma";
import { Event } from "@prisma/client";

const schema = Joi.object({
  name: Joi.string().required().max(190),
  description: Joi.string().required(),
  maxPoints: Joi.number().required(),
  eventTime: Joi.date().iso().required(),
});

type EventPOSTBody = Omit<
  Event,
  "id" | "createdAt" | "description" | "createdAt"
> & {
  description: string;
  eventTime: string;
};

type EventPATCHBody = Partial<EventPOSTBody>;

async function handler(method: "GET" | "POST", req: NextRequest) {
  const { searchParams } = new URL(req.nextUrl);
  const skip = Number(searchParams.get("page")) || 0;
  if (skip < 0)
    return NextResponse.json({ error: "Bad page" }, { status: 400 });

  if (method === "GET") {
    const events = (
      await prisma.event.findMany({
        orderBy: { eventTime: "desc" },
        skip: skip * 5,
        take: 5,
      })
    ).map((e) => ({
      ...e,
      description: Buffer.from(e.description).toString(),
    }));

    return NextResponse.json(events, { status: 200 });
  }

  const allowed = await getServerSession({ ...AUTH_OPTIONS }).then(
    async (s) => {
      if (!s?.user.email) return false;
      return await prisma.user
        .findUnique({
          where: { email: s.user.email },
          select: { position: true },
        })
        .then((u) => ["admin", "exec"].includes(u?.position!));
    },
  );

  if (!allowed)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  if (!req.body)
    return NextResponse.json({ error: "Missing body" }, { status: 400 });

  const result = req.body
    .getReader()
    .read()
    .then((r) => r.value && new TextDecoder().decode(r.value))
    .then(function(val): [boolean, any] {
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
    const rawData: EventPOSTBody | EventPATCHBody = (await result)[1];

    const newData: Omit<Event, "id" | "createdAt"> = {
      ...(rawData as EventPOSTBody),
      description: Buffer.from(rawData.description!),
      eventTime: new Date(rawData.eventTime!),
    };

    try {
      const body = await prisma.event.create({
        data: newData,
      });

      return NextResponse.json(
        {
          ...body,
          description: body.description.toString(),
        },
        {
          status: 200,
        },
      );
    } catch (e) {
      console.log(e);
      return NextResponse.json({ error: e }, { status: 500 });
    }
  }
  return NextResponse.json({ error: (await result)[1] }, { status: 400 });
}

export const GET = handler.bind(null, "GET");
export const POST = handler.bind(null, "POST");
