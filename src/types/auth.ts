import type { Role } from "@prisma/client";
import type { Session } from "next-auth";

export type AppSession = Session;

export interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: Role;
}
