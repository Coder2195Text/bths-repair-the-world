import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_OPTIONS } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export type Params = { params: { id: string } };

async function handler(
  method: "GET" | "PATCH" | "DELETE",
  req: NextRequest,
  { params: { id } }: Params
) {
  const session = await getServerSession({ ...AUTH_OPTIONS });
  if (method === "GET") {
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });

    return NextResponse.json(
      {
        ...event,
        description: event.description.toString(),
      },
      { status: 200 }
    );
  }
}

export const GET = handler.bind(null, "GET");
