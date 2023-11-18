import { prisma } from "@/utils/prisma";
import { Prisma, UserPosition } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_OPTIONS } from "../auth/[...nextauth]/options";

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
        if (!val) return [false, "Missing body"];
        try {
          return [true, JSON.parse(val)];
        } catch (e) {
          return [false, "Bad JSON"];
        }
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
