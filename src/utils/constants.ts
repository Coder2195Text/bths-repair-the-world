import { ExecPosition } from "@prisma/client";

export const POSITION_MAP: {
  [key in ExecPosition]: string;
} = {
  PRESIDENT: "President",
  VICE_PRESIDENT: "Vice President",
  SECRETARY: "Secretary",
  TREASURER: "Treasurer",
  EVENT_COORDINATOR: "Event Coordinator",
} as const;

export const POSITION_LIST: ExecPosition[] = Object.keys(
  POSITION_MAP
) as ExecPosition[];

export const GRAD_YEARS = [0, 2024, 2025, 2026, 2027];
export const PRONOUNS = ["He/Him", "She/Her", "They/Them", "Ze/Zir", "It/Its"];
