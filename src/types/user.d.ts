import { User } from "@prisma/client";

export interface UserPOSTBody {
  name: string;
  pronouns: string;
  gradYear: number;
  preferredName?: string;
  prefect: string;
  birthday: string;
  referredBy?: string;
  sgoSticker: boolean;
}

type UserPatchBody = Partial<UserPOSTBody>;

export interface UserFull extends User {
  referrals: string[];
}
