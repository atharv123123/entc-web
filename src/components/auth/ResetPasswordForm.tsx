"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import {
  resetPasswordAction,
  type AuthActionState,
} from "@/app/actions/auth";

const initialState: AuthActionState = {};

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [state, formAction, pending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  if (!token) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        Invalid or missing reset link. Please request a new one.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      <div>
        <label className="text-sm font-medium text-slate-700">
          New Password
        </label>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
          placeholder="Minimum 6 characters"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">
          Confirm Password
        </label>
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
          placeholder="Re-enter password"
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
        {pending ? "Resetting…" : "Reset Password"}
      </button>
    </form>
  );
}
