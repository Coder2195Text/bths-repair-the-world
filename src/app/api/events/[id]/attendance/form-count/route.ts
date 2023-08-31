import { NextRequest, NextResponse } from "next/server";
import { Params } from "../../route";
import { AUTH_OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/utils/prisma";
import { UserPosition } from "@prisma/client";
import { getServerSession } from "next-auth";

async function handler(
  method: "GET",
  req: NextRequest,
  { params: { id } }: Params
) {
  const allowed = await getServerSession({
    ...AUTH_OPTIONS,
  }).then(async (s) => {
    return s?.user?.email;
  });

  if (!allowed)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    return NextResponse.json(
      await prisma.eventAttendance.count({ where: { eventId: id } }),
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export const GET = handler.bind(null, "GET");
