import { getServerSession } from "next-auth";
import { AUTH_OPTIONS } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import type { UserWriteBody } from "@/types/user";
import { prisma } from "@/utils/prisma";
import { ExecDetails, UserPosition } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { POSITION_LIST } from "@/utils/constants";

type Params = { params: { email: string } };

const POSTSchema = Joi.object({
  position: Joi.string()
    .valid(...POSITION_LIST)
    .required(),
  description: Joi.string().max(5000).required(),
  selfieURL: Joi.string().max(190).uri().required(),
});

const PATCHSchema = Joi.object({
  position: Joi.string().valid(...POSITION_LIST),
  description: Joi.string().max(5000),
  selfieURL: Joi.string().max(190).uri(),
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

      if (email === "@me") {
        email = s.user.email;
      }

      const rank = await prisma.user
        .findUnique({
          where: { email },
          select: { position: true },
        })
        .then((u) => u?.position);

      if (rank === UserPosition.ADMIN) return true;
      if (rank === UserPosition.EXEC && email === s.user.email) return true;
      return false;
    }
  );

  if (!allowed) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (method === "GET") {
    const body = await prisma.execDetails.findUnique({
      where: {
        email,
      },
    });

    return NextResponse.json(body, { status: 200 });
  }

  if (!req.body)
    return NextResponse.json({ error: "Missing body" }, { status: 400 });

  const result: Promise<[false, string] | [true, ExecDetails]> = req.body
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
      let errors = (method === "POST" ? POSTSchema : PATCHSchema).validate(
        parsed
      ).error;
      return errors ? [false, errors] : [true, parsed];
    });

  if ((await result)[0]) {
    const data = (await result)[1] as ExecDetails;

    try {
      const body = await (method === "POST"
        ? prisma.execDetails.create({
            data: {
              ...data,
              email,
            },
          })
        : prisma.execDetails.update({
            where: { email },
            data,
          }));

      await revalidateTag("exec-desc");
      return NextResponse.json(body, {
        status: 200,
      });
    } catch (e) {
      console.log(e);
      return NextResponse.json({ error: e }, { status: 500 });
    }
  }
  return NextResponse.json({ error: (await result)[1] }, { status: 400 });
}

export const GET = handler.bind(null, "GET");
export const POST = handler.bind(null, "POST");
export const PATCH = handler.bind(null, "PATCH");
