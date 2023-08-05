import { getServerSession } from "next-auth";
import { AUTH_OPTIONS } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import type { UserWriteBody } from "@/types/user";
import { prisma } from "@/utils/prisma";

type Params = { params: { email: string } };

const POSTSchema = Joi.object({
  name: Joi.string().required().max(190),
  pronouns: Joi.string().required().max(190),
  gradYear: Joi.number().required().min(2024).max(2027),
  preferredName: Joi.string().optional().max(190),
  prefect: Joi.string()
    .required()
    .regex(/^[A-Za-z]\d[A-Za-z]$/),
  birthday: Joi.string().regex(
    /\b\d{4}-(?:1[0-2]|0?[1-9])-(?:3[0-1]|[12][0-9]|0?[1-9])\b/
  ),
  referredBy: Joi.string()
    .optional()
    .email()
    .regex(/@nycstudents.net$/),
  sgoSticker: Joi.boolean().required(),
  eventAlerts: Joi.boolean().required(),
});

const PATCHSchema = Joi.object({
  name: Joi.string().max(190),
  pronouns: Joi.string().max(190),
  gradYear: Joi.number().min(2024).max(2027),
  preferredName: Joi.string().max(190),
  prefect: Joi.string().regex(/^[A-Za-z]\d[A-Za-z]$/),
  birthday: Joi.string().regex(
    /\b\d{4}-(?:1[0-2]|0?[1-9])-(?:3[0-1]|[12][0-9]|0?[1-9])\b/
  ),
  referredBy: Joi.string()
    .email()
    .regex(/@nycstudents.net$/),
  sgoSticker: Joi.boolean(),
  eventAlerts: Joi.boolean(),
});

async function handler(
  method: "GET" | "PATCH" | "POST",
  req: NextRequest,
  { params: { email } }: Params
) {
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  if (email !== "@me" && Joi.string().email().validate(email).error) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const allowed = await getServerSession({ ...AUTH_OPTIONS }).then(
    async (s) => {
      if (!s?.user?.email) return false;
      if (email == "@me" && s.user.email) {
        email = s.user.email;
        return true;
      }

      return await prisma.user
        .findUnique({
          where: { email: s.user.email },
          select: { position: true },
        })
        .then((u) => ["admin", "exec"].includes(u?.position!));
    }
  );

  if (!allowed) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (method === "GET") {
    const [user, referrals] = await Promise.all([
      prisma.user.findUnique({
        where: { email },
      }),
      prisma.user
        .findMany({
          where: { referredBy: email },
          select: {
            email: true,
          },
        })
        .then((u) => u.map((u) => u.email)),
    ]);

    return NextResponse.json(user && { ...user, referrals }, { status: 200 });
  }

  if (method === "PATCH" || method === "POST") {
    if (!req.body)
      return NextResponse.json({ error: "Missing body" }, { status: 400 });

    const result: Promise<[false, string] | [true, UserWriteBody]> = req.body
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
        let errors = (method === "POST" ? POSTSchema : PATCHSchema).validate(
          parsed
        ).error;
        return errors ? [false, errors] : [true, parsed];
      });

    if ((await result)[0]) {
      const data = (await result)[1] as UserWriteBody;

      try {
        const [body, referrals] = await Promise.all([
          method === "POST"
            ? prisma.user.create({
              data: {
                ...data,
                email,
                preferredName: data.preferredName || data.name,
              },
            })
            : prisma.user.update({
              where: { email },
              data: {
                ...data,
                preferredName: data.preferredName || data.name,
                lastUpdated: new Date().toISOString(),
              },
            }),
          prisma.user
            .findMany({
              where: { referredBy: email },
              select: {
                email: true,
              },
            })
            .then((u) => u.map((u) => u.email)),
        ]);

        return NextResponse.json(
          {
            ...body,
            referrals,
          },
          {
            status: 200,
          }
        );
      } catch (e) {
        console.log(e);
        return NextResponse.json({ error: e }, { status: 500 });
      }
    }
    return NextResponse.json({ error: (await result)[1] }, { status: 400 });
  }
}

export const GET = handler.bind(null, "GET");
export const POST = handler.bind(null, "POST");
export const PATCH = handler.bind(null, "PATCH");
