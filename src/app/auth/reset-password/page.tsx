import Link from "next/link";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto grid max-w-md gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-slate-950">
          Reset Password
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your new password below.
        </p>
      </div>

      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur">
        <ResetPasswordForm />

        <div className="mt-6 text-center text-sm text-slate-600">
          Need a new reset link?{" "}
          <Link
            href="/auth/forgot-password"
            className="font-semibold text-indigo-700 hover:text-indigo-800"
          >
            Request again
          </Link>
        </div>
      </div>
    </div>
  );
}
