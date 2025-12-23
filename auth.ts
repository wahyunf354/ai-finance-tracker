import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login
      return !!auth;
    },
  },
  events: {
    async signIn({ user }) {
      if (!user.email) return;

      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Upsert user data to public.users table
      const { error } = await supabase.from("users").upsert(
        {
          email: user.email,
          name: user.name,
          image: user.image,
          last_login: new Date().toISOString(),
        },
        { onConflict: "email" }
      );

      if (error) {
        console.error("Error syncing user to Supabase:", error);
      }
    },
  },
});
