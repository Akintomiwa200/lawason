import { auth, signIn, signOut } from "@/lib/auth";

export const authService = {
  getSession: () => auth(),

  signInWithGoogle: (redirectTo = "/") =>
    signIn("google", { redirectTo }),

  signInWithApple: (redirectTo = "/") =>
    signIn("apple", { redirectTo }),

  signInWithEmail: (email: string, password: string, redirectTo = "/") =>
    signIn("credentials", { email, password, redirectTo }),

  signOut: (redirectTo = "/") => signOut({ redirectTo }),
};
