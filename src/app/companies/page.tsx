import { db } from "@/db";
import { companies } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const rows = await db
    .select()
    .from(companies)
    .orderBy(desc(companies.visitDate), desc(companies.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-950">Incoming Company</h1>
        <p className="mt-2 text-sm text-slate-600">Placement / recruitment visit updates.</p>
      </div>

      <div className="grid gap-4">
        {rows.length ? (
          rows.map((c) => (
            <div
              key={c.id}
              className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="text-lg font-semibold text-slate-950">{c.name}</div>
                <div className="text-xs text-slate-500">{c.visitDate ?? "Date TBA"}</div>
              </div>
              {c.details ? <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{c.details}</p> : null}
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-white/60 bg-white/70 p-6 text-sm text-slate-600 shadow-sm backdrop-blur">
            No company visits added yet.
          </div>
        )}
      </div>
    </div>
  );
}
