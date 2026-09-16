"use client";

import { useActionState } from "react";
import { createComplaintAction, type ComplaintActionState } from "@/app/actions/complaints";

const initialState: ComplaintActionState = {};

export default function ComplaintForm() {
  const [state, formAction, pending] = useActionState(createComplaintAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700">Category</label>
        <select
          name="category"
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
          defaultValue=""
          required
        >
          <option value="" disabled>
            Select
          </option>
          <option>Classroom</option>
          <option>Lab</option>
          <option>Network / WiFi</option>
          <option>Equipment</option>
          <option>Cleanliness</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">Subject</label>
        <input
          name="subject"
          type="text"
          required
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
          placeholder="Short title"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">Description</label>
        <textarea
          name="description"
          required
          rows={6}
          className="mt-1 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
          placeholder="Explain the issue clearly…"
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
        className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit Complaint"}
      </button>
    </form>
  );
}
