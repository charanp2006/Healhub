import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import userModel from "./lib/models/userModel";
import doctorModel from "./lib/models/doctorModel";
import hospitalModel from "./lib/models/hospitalModel";
import { connectDB } from "./lib/db";
import type { AuthRole } from "./lib/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        role: { label: "Role", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const role = credentials?.role as string | undefined;
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!role || !email || !password) return null;

        try {
          await connectDB();

          if (role === "admin") {
            if (
              email === process.env.ADMIN_EMAIL &&
              password === process.env.ADMIN_PW
            ) {
              return {
                id: "admin",
                role: "admin",
                email,
                name: "Admin",
              } as never;
            }
            return null;
          }

          if (role === "user") {
            const user = await userModel.findOne({ email });
            if (!user) return null;
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return null;
            return {
              id: String(user._id),
              role: "user",
              email: user.email || "",
              name: user.name || "",
            } as never;
          }

          if (role === "doctor") {
            const doctor = await doctorModel.findOne({ email });
            if (!doctor) return null;
            const isMatch = await bcrypt.compare(password, doctor.password);
            if (!isMatch) return null;
            return {
              id: String(doctor._id),
              role: "doctor",
              email: doctor.email || "",
              name: doctor.name || "",
            } as never;
          }

          if (role === "hospital") {
            const hospital = await hospitalModel.findOne({ email });
            if (!hospital || !hospital.isRegistered) return null;
            const isMatch = await bcrypt.compare(password, hospital.password);
            if (!isMatch) return null;
            return {
              id: String(hospital._id),
              role: "hospital",
              email: hospital.email || "",
              name: hospital.name || "",
            } as never;
          }

          return null;
        } catch (error) {
          console.log("Error in auth authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as {
          id?: string;
          role?: AuthRole;
          email?: string;
          name?: string;
        };
        if (u.id) token.sub = u.id;
        if (u.role) token.role = u.role as string;
        if (u.email) token.email = u.email;
        if (u.name) token.name = u.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as string) ||
          (undefined as never);
      }
      return session;
    },
  },
});
