import { User } from "@prisma/client";

export type UserWriteBody = Omit<
  User,
  "referredBy" | "email" | "registeredAt" | "position"
> & {
  referredBy?: string;
};

export interface UserFull extends User {
  referrals: string[];
}
