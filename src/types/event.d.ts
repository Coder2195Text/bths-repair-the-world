import { Event } from "@prisma/client";

type EventWithAttending = Event & {
  attending: boolean;
};
