import NextAuth from "next-auth";
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
        clientId: process.env.AUTH_GOOGLE_ID!,
        clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    })
  ],
  pages: {
    signIn: "/"
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email || !user.id) return true;
      const result = await prisma.workSpace.findUnique({
        where: {
          userId: user.id
        }
      });
      if (result) return true;
      const slug = user.name?.toLowerCase().replace(/\s+/g, "-");
      await prisma.workSpace.create({
        data: {
          name: user.name ?? "My Workspace",
          slug: slug!,
          userId: user.id,
        }
      });
      return true;
    }
  }
});
