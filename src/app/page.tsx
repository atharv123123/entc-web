import Link from "next/link";
import { db } from "@/db";
import { announcements, events } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getDepartmentSnapshot } from "@/lib/seed";
import { asc, desc, gte } from "drizzle-orm";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function HomePage() {
  const [user, dept, latestAnnouncements] = await Promise.all([
    getCurrentUser(),
    getDepartmentSnapshot(),
    db.select().from(announcements).orderBy(desc(announcements.createdAt)).limit(5),
  ]);

  const today = new Date();
  const iso = today.toISOString().slice(0, 10);
  const upcomingEvents = await db
    .select()
    .from(events)
    .where(gte(events.eventDate, iso))
    .orderBy(asc(events.eventDate))
    .limit(5);

  type TickerItem = { kind: "event" | "notice"; label: string; text: string };
  const tickerItems: TickerItem[] = [
    ...upcomingEvents.map((e) => ({
      kind: "event" as const,
      label: "EVENT",
      text: e.location ? `${e.title} — ${formatDate(e.eventDate)} (${e.location})` : `${e.title} — ${formatDate(e.eventDate)}`,
    })),
    ...latestAnnouncements.map((a) => ({
      kind: "notice" as const,
      label: "NOTICE",
      text: a.title,
    })),
  ];

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/60 p-8 shadow-sm backdrop-blur md:p-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(600px_circle_at_20%_20%,rgba(99,102,241,0.18),transparent_60%),radial-gradient(700px_circle_at_90%_10%,rgba(236,72,153,0.16),transparent_60%)]" />
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
          Electronics & Telecommunication Engineering
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
          E&TC Department Student Association Portal
        </h1>
        <p className="mt-4 max-w-3xl text-base text-slate-700 md:text-lg">{dept.info.motive}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/register"
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Register
              </Link>
              <Link
                href="/auth/login"
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Login
              </Link>
            </>
          )}
          <Link
            href="/department"
            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Department Info
          </Link>
        </div>
      </section>

      {tickerItems.length ? (
        <section className="overflow-hidden rounded-2xl border border-white/60 bg-white/70 py-3 shadow-sm backdrop-blur">
          <div className="flex w-max animate-marquee">
            {tickerItems.concat(tickerItems).map((item, i) => (
              <span key={i} className="mr-10 flex shrink-0 items-center gap-2 text-sm text-slate-700">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    item.kind === "event"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {item.label}
                </span>
                {item.text}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-3xl border border-white/60 bg-white/60 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-950">Upcoming Events</div>
            <div className="text-sm text-slate-600">Quick preview of upcoming department events.</div>
          </div>
          <Link href="/events" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold">
            View Events
          </Link>
        </div>

        <div className="mt-5 divide-y divide-slate-200">
          {upcomingEvents.length ? (
            upcomingEvents.map((e) => (
              <Link
                key={e.id}
                href="/events"
                className="flex flex-wrap items-center justify-between gap-2 py-3"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-950">{e.title}</div>
                  {e.location ? (
                    <div className="mt-0.5 text-xs text-slate-500">{e.location}</div>
                  ) : null}
                </div>
                <div className="shrink-0 text-xs text-slate-500">{formatDate(e.eventDate)}</div>
              </Link>
            ))
          ) : (
            <div className="py-3 text-sm text-slate-600">No upcoming events yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
