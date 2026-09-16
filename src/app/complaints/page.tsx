import Link from "next/link";
import { db } from "@/db";
import { complaints } from "@/db/schema";
import { deleteComplaintAction } from "@/app/actions/complaints";
import { requireUser } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    submitted: "bg-amber-50 text-amber-700 border-amber-200",
    in_progress: "bg-blue-50 text-blue-700 border-blue-200",
    resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${map[status] ?? "bg-slate-50 text-slate-700 border-slate-200"}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

export default async function ComplaintsPage() {
  const user = await requireUser();

  const rows = await db
    .select()
    .from(complaints)
    .where(eq(complaints.userId, user.id))
    .orderBy(desc(complaints.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Complaint Box</h1>
          <p className="mt-2 text-sm text-slate-600">Submit and track your complaints.</p>
        </div>
        <Link
          href="/complaints/new"
          className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          New Complaint
        </Link>
      </div>

      <div className="rounded-3xl border border-white/60 bg-white/70 shadow-sm backdrop-blur">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.length ? (
                rows.map((c) => (
                  <tr key={c.id} className="align-top">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-950">{c.subject}</div>
                      <div className="mt-1 line-clamp-2 text-xs text-slate-600">{c.description}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{c.category}</td>
                    <td className="px-6 py-4">
                      <StatusPill status={c.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-700">{new Date(c.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {c.status === "submitted" ? (
                        <form action={deleteComplaintAction}>
                          <input type="hidden" name="id" value={c.id} />
                          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold hover:bg-slate-50">
                            Delete
                          </button>
                        </form>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-10 text-sm text-slate-600" colSpan={5}>
                    No complaints yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
