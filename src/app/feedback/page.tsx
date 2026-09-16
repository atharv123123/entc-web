import Link from "next/link";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Feedback</h1>
          <p className="mt-2 text-sm text-slate-600">Help us improve the department services and portal.</p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          Back
        </Link>
      </div>

      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur">
        <FeedbackForm />
      </div>
    </div>
  );
}
