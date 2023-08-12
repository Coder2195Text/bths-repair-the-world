import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_OPTIONS } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

type Params = { params: { id: string } };

async function handler(
  method: "GET",
  req: NextRequest,
  { params: { id } }: Params,
) {
  const session = await getServerSession({ ...AUTH_OPTIONS });
  if (method === "GET") {
    const [event, attending] = await Promise.all([
      prisma.event.findUnique({
        where: { id },
      }),
      session?.user.email &&
      prisma.eventAttendance.findUnique({
        where: {
          userEmail_eventId: { eventId: id, userEmail: session.user.email },
        },
      }),
    ]);

    if (!event)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });

    return NextResponse.json(
      {
        ...event,
        description: Buffer.from(event.description).toString(),
        attending: Boolean(attending),
      },
      { status: 200 },
    );
  }
}

export const GET = handler.bind(null, "GET");
