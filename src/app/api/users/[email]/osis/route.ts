import { prisma } from "@/utils/prisma";
import { UserPosition } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_OPTIONS } from "@/app/api/auth/[...nextauth]/options";
import { Params } from "../route";

async function handler(
  method: "POST" | "DELETE",
  req: NextRequest,
  { params: { email } }: Params
) {
  console.log(await req.headers.get("Authorization"));
  const allowed =
    (await req.headers.get("Authorization")) === process.env.OSIS_API_KEY ||
    (await getServerSession({ ...AUTH_OPTIONS }).then(async (s) => {
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
    }));

  if (!allowed)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (
    !(await prisma.user.findUnique({
      where: { email },
      select: { email: true },
    }))
  )
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    return NextResponse.json(
      await prisma.user.update({
        where: { email },
        data: { didOsis: method == "POST" },
      }),
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export const POST = handler.bind(null, "POST");
export const DELETE = handler.bind(null, "DELETE");
