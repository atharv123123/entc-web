import { db } from "@/db";
import { permissionRequests } from "@/db/schema";
import PermissionForm from "@/components/permissions/PermissionForm";
import { requireUser } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${map[status] ?? "bg-slate-50 text-slate-700 border-slate-200"}`}
    >
      {status}
    </span>
  );
}

export default async function PermissionsPage() {
  const user = await requireUser();

  const rows = await db
    .select()
    .from(permissionRequests)
    .where(eq(permissionRequests.userId, user.id))
    .orderBy(desc(permissionRequests.createdAt));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-950">Permissions</h1>
        <p className="mt-2 text-sm text-slate-600">Request permissions and track approval status.</p>
      </div>

      <section className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="text-sm font-semibold text-slate-950">New Permission Request</div>
        <div className="mt-4">
          <PermissionForm />
        </div>
      </section>

      <section className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="text-sm font-semibold text-slate-950">Your Requests</div>
        <div className="mt-4 space-y-3">
          {rows.length ? (
            rows.map((r) => (
              <div key={r.id} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-slate-950">{r.requestType}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {r.fromDate} → {r.toDate}
                    </div>
                  </div>
                  <StatusPill status={r.status} />
                </div>
                <div className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{r.reason}</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-600">No requests yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
