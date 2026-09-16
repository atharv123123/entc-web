import Link from "next/link";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto grid max-w-md gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-slate-950">
          Forgot Password
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur">
        <ForgotPasswordForm />

        <div className="mt-6 text-center text-sm text-slate-600">
          Remember your password?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-indigo-700 hover:text-indigo-800"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
