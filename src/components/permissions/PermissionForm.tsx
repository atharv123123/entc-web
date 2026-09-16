"use client";

import { useActionState } from "react";
import {
  createPermissionRequestAction,
  type PermissionActionState,
} from "@/app/actions/permissions";

const initialState: PermissionActionState = {};

export default function PermissionForm() {
  const [state, formAction, pending] = useActionState(createPermissionRequestAction, initialState);

  return (
    <form action={formAction} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="text-sm font-medium text-slate-700">Request Type</label>
        <input
          name="requestType"
          required
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
          placeholder="Gate pass / Leave / Lab access etc"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">From</label>
        <input
          name="fromDate"
          type="date"
          required
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">To</label>
        <input
          name="toDate"
          type="date"
          required
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
        />
      </div>

      <div className="md:col-span-2">
        <label className="text-sm font-medium text-slate-700">Reason</label>
        <textarea
          name="reason"
          required
          rows={4}
          className="mt-1 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
          placeholder="Explain the reason…"
        />
      </div>

      {state?.error ? (
        <div className="md:col-span-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.error}
        </div>
      ) : null}

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {pending ? "Submitting…" : "Submit Request"}
        </button>
      </div>
    </form>
  );
}
