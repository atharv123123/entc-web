import Link from "next/link";
import ComplaintForm from "@/components/complaints/ComplaintForm";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewComplaintPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Submit a Complaint</h1>
          <p className="mt-2 text-sm text-slate-600">Your complaint will be visible to the department admin.</p>
        </div>
        <Link
          href="/complaints"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          Back
        </Link>
      </div>

      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur">
        <ComplaintForm />
      </div>
    </div>
  );
}
