import { ExecPosition } from "@prisma/client";

export const POSITION_MAP: {
  [key in ExecPosition]: string;
} = {
  PRESIDENT: "President",
  VICE_PRESIDENT: "Vice President",
  TREASURER: "Treasurer",
  EVENT_COORDINATOR: "Event Coordinator",
} as const;

export const POSITION_LIST: ExecPosition[] = Object.keys(
  POSITION_MAP
) as ExecPosition[];