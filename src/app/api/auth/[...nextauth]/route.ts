import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

// **ดึง admin email จาก ENV**
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(x => x.trim());

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // ถ้า whitelist email เป็น admin ให้เข้าได้
      if (ADMIN_EMAILS.includes(user.email || "")) {
        return true;
      }
      // ถ้าไม่ใช่ admin แต่ต้องการให้ user ทุกคนเข้าได้ ให้ return true ตรงนี้
      // หรือจะ return false เพื่อบล็อคทุกคนที่ไม่ใช่ admin ก็ได้
      return true;
    },
    async session({ session, token }) {
      // เพิ่ม custom field เช่น isAdmin
      if (session?.user?.email && ADMIN_EMAILS.includes(session.user.email)) {
        session.user.isAdmin = true;
      }
      return session;
    },
  },
  // ถ้าอยาก custom หน้าตา sign-in
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
