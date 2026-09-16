import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return (
    <div className="mx-auto grid max-w-md gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-slate-950">Register</h1>
        <p className="mt-2 text-sm text-slate-600">Create your account to submit complaints and feedback.</p>
      </div>

      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur">
        <RegisterForm />

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-indigo-700 hover:text-indigo-800">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
