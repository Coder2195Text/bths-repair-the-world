import { NextRequest, NextResponse } from "next/server";
import { Params } from "../route";
import { AUTH_OPTIONS } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/utils/prisma";
import { UserPosition } from "@prisma/client";
import { getServerSession } from "next-auth";

async function handler(
  method: "GET",
  req: NextRequest,
  { params: { id } }: Params
) {
  const admin = await getServerSession({
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

  if (!admin)
    return NextResponse.json(
      {
        error: "Not authorized",
      },
      { status: 401 }
    );

  try {
    const attendance = await prisma.eventAttendance.findMany({
      where: { eventId: id },
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

    return NextResponse.json(attendance, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export const GET = handler.bind(null, "GET");
