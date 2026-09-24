import Link from "next/link";
import { db } from "@/db";
import { events } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function EventsListPage() {
  const [user, rows] = await Promise.all([
    getCurrentUser(),
    db.select().from(events).orderBy(asc(events.eventDate)),
  ]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">All Events</h1>
          <p className="mt-2 text-sm text-slate-600">
            Upcoming and past events of the department listed below.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {user?.role === "admin" ? (
            <Link
              href="/admin"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Add Event
            </Link>
          ) : null}
          <Link
            href="/events"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            View Calendar
          </Link>
        </div>
      </div>

      <section className="rounded-3xl border border-white/60 bg-white/60 p-6 shadow-sm backdrop-blur">
        <div className="divide-y divide-slate-200">
          {rows.length ? (
            rows.map((e) => {
              const isUpcoming = e.eventDate >= today;
              return (
                <article key={e.id} className="py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-slate-950">{e.title}</span>
                        {isUpcoming ? (
                          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                            Upcoming
                          </span>
                        ) : null}
                      </div>
                      {e.location ? (
                        <div className="mt-0.5 text-xs text-slate-500">{e.location}</div>
                      ) : null}
                      {e.description ? (
                        <div className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{e.description}</div>
                      ) : null}
                    </div>
                    <div className="shrink-0 text-xs font-semibold text-slate-500">
                      {formatDate(e.eventDate)}
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="py-4 text-sm text-slate-600">No events yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
