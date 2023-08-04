import { User } from "@prisma/client";

export type UserWriteBody = Omit<
  UserWriteBody,
  "referredBy" | "email" | "registeredAt" | "position"
> & {
  referredBy?: string;
};

export interface UserFull extends User {
  referrals: string[];
}
