import { db } from "@/db";
import { announcements } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  const rows = await db.select().from(announcements).orderBy(desc(announcements.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-950">Announcements</h1>
        <p className="mt-2 text-sm text-slate-600">Department announcements and important notices.</p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/events"
          className="rounded-2xl border border-white/60 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur hover:bg-white/90"
        >
          Event Calendar
        </Link>
        <Link
          href="/companies"
          className="rounded-2xl border border-white/60 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur hover:bg-white/90"
        >
          Incoming Company
        </Link>
      </div>

      <div className="grid gap-4">
        {rows.length ? (
          rows.map((a) => (
            <article
              key={a.id}
              className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur"
            >
              <h2 className="text-lg font-semibold text-slate-950">{a.title}</h2>
              <div className="mt-1 text-xs text-slate-500">{new Date(a.createdAt).toLocaleString()}</div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{a.body}</p>
            </article>
          ))
        ) : (
          <div className="rounded-3xl border border-white/60 bg-white/70 p-6 text-sm text-slate-600 shadow-sm backdrop-blur">
            No announcements yet.
          </div>
        )}
      </div>
    </div>
  );
}
