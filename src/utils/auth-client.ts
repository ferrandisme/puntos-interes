import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com" // TODO cambiar si se despliega a uno por defecto
      : undefined, // In development betterauth can find the url (Not explicit to prevent port diff problem)
});

export const { signIn, signUp, signOut, useSession } = authClient;
