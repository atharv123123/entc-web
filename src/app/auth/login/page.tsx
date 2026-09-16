import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="mx-auto grid max-w-md gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-slate-950">Login</h1>
        <p className="mt-2 text-sm text-slate-600">Access the ENTC Department portal.</p>
      </div>

      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur">
        <LoginForm />

        <div className="mt-6 text-center text-sm text-slate-600">
          New here?{" "}
          <Link href="/auth/register" className="font-semibold text-indigo-700 hover:text-indigo-800">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
