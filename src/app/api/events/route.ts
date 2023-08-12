import { getServerSession } from "next-auth";
import { AUTH_OPTIONS } from "../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import { prisma } from "@/utils/prisma";
import { Event, UserPosition } from "@prisma/client";
import { Embed, Webhook } from "@vermaysha/discord-webhook";
import { Optional } from "@prisma/client/runtime/library";

const schema = Joi.object({
  name: Joi.string().required().max(190),
  description: Joi.string().required(),
  maxPoints: Joi.number().required(),
  eventTime: Joi.date().iso().required(),
  image: Joi.string().uri().optional(),
  maxHours: Joi.number().required(),
  address: Joi.string().required().max(1000),
});

type EventPOSTBody = Omit<
  Event,
  "id" | "createdAt" | "description" | "createdAt"
> & {
  description: string;
  eventTime: string;
};

async function handler(method: "GET" | "POST", req: NextRequest) {
  const { searchParams } = new URL(req.nextUrl);
  const skip = Number(searchParams.get("page")) || 0;
  if (skip < 0)
    return NextResponse.json({ error: "Bad page" }, { status: 400 });

  if (method === "GET") {
    let events = (
      await prisma.event.findMany({
        orderBy: { eventTime: "desc" },
        skip: skip * 10,
        take: 10,
      })
    ).map((e) => {
      if (searchParams.has("preview")) {
        delete (e as Optional<Event>).address;
        delete (e as Optional<Event>).description;
        return e;
      }

      return {
        ...e,
        description: Buffer.from(e.description).toString(),
      };
    });

    return NextResponse.json(searchParams.get("preview") ? events : events, {
      status: 200,
    });
  }

  const [allowed, email]: [boolean, string] = await getServerSession({
    ...AUTH_OPTIONS,
  }).then(async (s) => {
    if (!s?.user.email) return [false, "No email"];
    return await prisma.user
      .findUnique({
        where: { email: s.user.email },
        select: { position: true, email: true },
      })
      .then((u) => [
        ([UserPosition.EXEC, UserPosition.ADMIN] as UserPosition[]).includes(
          u?.position!,
        ),
        u?.email as string,
      ]);
  });

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
    const rawData: EventPOSTBody = (await result)[1];

    const newData: Omit<Event, "id" | "createdAt"> = {
      ...rawData,
      description: Buffer.from(rawData.description!),
      eventTime: new Date(rawData.eventTime!),
    };

    try {
      const [body, name] = await Promise.all([
        prisma.event.create({
          data: newData,
        }),
        prisma.user
          .findUnique({
            where: { email },
            select: { preferredName: true },
          })
          .then((u) => u?.preferredName),
      ]);

      const hook = new Webhook(process.env.EVENT_WEBHOOK!);

      const embed = new Embed();
      embed
        .setTitle("New Event: " + newData.name)
        .setDescription(
          `# ${name} has posted a [new event](https://bths-repair.tech/events/${body.id
          })!\n## **Description**\n ${newData.description
          }\n## **Event Time:** ${newData.eventTime.toLocaleString()}\n## **Points:** ${newData.maxPoints
          }\n## **Hours:** ${newData.maxHours}\n## Location: [${newData.address
          }](${encodeURI(
            `https://www.google.com/maps/dir/?api=1&destination=${newData.address}&travelmode=transit`,
          )})`,
        )
        .setThumbnail({
          url: body.imageURL || "https://bths-repair.tech/icon.png",
        })
        .setAuthor({
          name: name!,
        })
        .setTimestamp()
        .setUrl(`https://bths-repair.tech/events/${body.id}`);

      hook
        .setContent(
          "Tired of events? Go to <#1134529490740064307> to remove <@&1136780952274735266>.\n# New event posted!",
        )
        .addEmbed(embed)
        .send();

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
