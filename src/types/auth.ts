import type { Session } from "next-auth";

export type AppSession = Session;

export interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}
