"use client";

import { useActionState } from "react";
import { registerAction, type AuthActionState } from "@/app/actions/auth";

const initialState: AuthActionState = {};

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700">Full Name</label>
        <input
          name="name"
          type="text"
          required
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
          placeholder="Your name"
        />
      </div>
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
          placeholder="Minimum 6 characters"
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
        {pending ? "Creating account…" : "Register"}
      </button>

      <p className="text-xs text-slate-500">
        Note: The first account created in this app becomes Admin automatically.
      </p>
    </form>
  );
}
