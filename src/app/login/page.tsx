"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ถ้า login แล้ว redirect ไป /admin
  useEffect(() => {
    if (session && session.user?.isAdmin) {
      router.replace("/admin");
    }
  }, [session, router]);

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">กำลังโหลด...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow rounded p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">เข้าสู่ระบบผู้ดูแล</h1>
        {!session ? (
          <>
            <button
              onClick={() => signIn("google")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
            >
              Sign in with Google
            </button>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-4">
              <div>ยินดีต้อนรับ, <b>{session.user?.name}</b></div>
              <div className="text-xs text-gray-500">{session.user?.email}</div>
            </div>
            <button
              onClick={() => signOut()}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition"
            >
              ออกจากระบบ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
