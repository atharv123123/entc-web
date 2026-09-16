"use client";

import { useActionState } from "react";
import { createFeedbackAction, type FeedbackActionState } from "@/app/actions/feedback";

const initialState: FeedbackActionState = {};

export default function FeedbackForm() {
  const [state, formAction, pending] = useActionState(createFeedbackAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700">Rating (optional)</label>
        <select
          name="rating"
          defaultValue=""
          className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
        >
          <option value="">No rating</option>
          <option value="5">5 - Excellent</option>
          <option value="4">4 - Good</option>
          <option value="3">3 - Average</option>
          <option value="2">2 - Poor</option>
          <option value="1">1 - Very Poor</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">Your Feedback</label>
        <textarea
          name="message"
          required
          rows={6}
          className="mt-1 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
          placeholder="Write your suggestions…"
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
        {pending ? "Submitting…" : "Submit Feedback"}
      </button>
    </form>
  );
}
