"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction, type AuthActionState } from "@/app/actions/auth";

const initialState: AuthActionState = {};

export default function LoginForm() {
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";

  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {resetSuccess ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Password reset successful! Please log in.
        </div>
      ) : null}
      <div>
        <label className="text-sm font-medium text-slate-700">Email</label>
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">Password</label>
        <input
          name="password"
          type="password"
          required
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
          placeholder="••••••••"
        />
      </div>

      {state?.error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Login"}
      </button>

      <div className="text-center">
        <a
          href="/auth/forgot-password"
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Forgot Password?
        </a>
      </div>
    </form>
  );
}
