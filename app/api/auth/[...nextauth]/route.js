import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials?.email },
          });
          if (user) {
            const isPasswordCorrect = await bcrypt?.compare(
              credentials?.password,
              user?.password
            );
            if (
              user.status == "Permanent Block" ||
              user.status == "Temporary Block"
            ) {
              throw new Error("You are Temporary Block Or Permenant Block");
            } else if (user?.status == "active") {
              if (isPasswordCorrect) {
                return {
                  ...user,
                  password: null,
                  role: user?.role,
                  status: user?.status,
                };
              } else {
                throw new Error("User Password is incorrect");
              }
            } else {
              throw new Error("some thing went wrong");
            }
          } else {
            throw new Error("Invalid email or password");
          }
        } catch (err) {
          throw new Error(err);
        }
      },
    }),
  ],
  // for Simple Login
  // callbacks: {
  //   async signIn({ user, account }) {
  //     if (account?.provider == 'credentials') {
  //       return true;
  //     }
  //   },
  // },

  // For Rolebase
  // callbacks: {
  //   async jwt({ token, user }) {
  //     if (user) token.role = user.role;
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     if (session?.user) session.user.role = token.role;
  //     return session;
  //   },
  // },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token.userId = user.id),
          (token.role = user.role),
          (token.status = user.status);
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user.role = token.role),
          (session.user.id = token.userId),
          (session.user.status = token.status);
      }
      return session;
    },
    async signIn({ user }) {
      if (user) {
        try {
          await prisma?.loginLog?.create({
            data: {
              userId: user?.id,
              userEmail: user?.email,
              status: user?.status,
            },
          });
        } catch (error) {
          return NextResponse.json({
            status: 500,
            message: `Error Creating Login log ${error} `,
          });
        }
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
