import { createAuthClient } from "better-auth/react";
import { stripeClient } from "@better-auth/stripe/client";
import { adminClient } from "better-auth/client/plugins";
import { ac, admin, editor, user } from "./permission";

export const authClient = createAuthClient({
  plugins: [
    stripeClient({
      subscription: true,
    }),
    adminClient({
      ac,
      roles: {
        admin,
        editor,
        user,
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
