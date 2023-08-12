import { Event } from "@prisma/client";

type EventParsed = Omit<Event, "description"> & { description: string };
