import { auth, signIn, signOut } from "@/lib/auth";

export const authService = {
  getSession: () => auth(),

  signInWithGoogle: (callbackUrl = "/") =>
    signIn("google", { redirectTo: callbackUrl }),

  signOut: (callbackUrl = "/") => signOut({ redirectTo: callbackUrl }),
};
