import { prisma } from "@/utils/prisma";
import { Prisma, UserPosition } from "@prisma/client";
import { getServerSession } from "next-auth";
import email from "next-auth/providers/email";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_OPTIONS } from "../auth/[...nextauth]/route";

export const POST = async (req: NextRequest) => {
  const allowed = await getServerSession({ ...AUTH_OPTIONS }).then(
    async (s) => {
      if (!s?.user?.email) return false;

      return await prisma.user
        .findUnique({
          where: { email: s.user.email },
          select: { position: true },
        })
        .then((u) =>
          ([UserPosition.ADMIN, UserPosition.EXEC] as UserPosition[]).includes(
            u?.position!
          )
        );
    }
  );

  if (!allowed)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!req.body)
    return NextResponse.json({ error: "Missing body" }, { status: 400 });

  const result: Promise<[false, string] | [true, Prisma.UserWhereInput]> =
    req.body
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
        try {
          parsed = Prisma.validator<Prisma.UserWhereInput>()(parsed);
        } catch (e) {
          return [false, e];
        }
        return [true, parsed];
      });

  if (!(await result)[0])
    return NextResponse.json({ error: (await result)[1] }, { status: 400 });

  try {
    return NextResponse.json(
      await prisma.user
        .findMany({
          where: (await result)[1] as Prisma.UserWhereInput,
          select: {
            email: true,
          },
        })
        .then((u) => u.map((u) => u.email)),
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
};
