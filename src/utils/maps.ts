import { ExecPosition } from "@prisma/client";

export const POSITION_MAP: {
  [key in ExecPosition]: string;
} = {
  PRESIDENT: "President",
  VICE_PRESIDENT: "Vice President",
  TREASURER: "Treasurer",
  EVENT_COORDINATOR: "Event Coordinator",
};
