import Link from "next/link";
import { db } from "@/db";
import { events } from "@/db/schema";
import { and, asc, gte, lte } from "drizzle-orm";
import * as ical from "node-ical";

export const dynamic = "force-dynamic";

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  location?: string;
  description?: string;
  source: "db" | "google";
};

async function fetchGoogleCalendarEvents(
  start: string,
  end: string,
): Promise<CalendarEvent[]> {
  try {
    const email = process.env.GOOGLE_CALENDAR_EMAIL ?? "dietentc@gmail.com";
    const encodedEmail = encodeURIComponent(email);
    const url =
      process.env.GOOGLE_CALENDAR_ICS_URL ??
      `https://calendar.google.com/calendar/ical/${encodedEmail}/public/basic.ics`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];

    const text = await res.text();
    const data = ical.parseICS(text);
    const googleEvents: CalendarEvent[] = [];

    for (const [, event] of Object.entries(data)) {
      if (!event || event.type !== "VEVENT") continue;

      const dtStart = event.start;
      if (!dtStart) continue;

      const eventDate = isoDate(new Date(dtStart));
      if (eventDate < start || eventDate > end) continue;

      googleEvents.push({
        id: String(event.uid ?? `gcal-${eventDate}-${event.summary}`),
        title: String(event.summary ?? "Untitled"),
        date: eventDate,
        location: event.location ? String(event.location) : undefined,
        description: event.description ? String(event.description) : undefined,
        source: "google",
      });
    }

    return googleEvents;
  } catch {
    return [];
  }
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const now = new Date();
  const year = Number(params.year ?? now.getFullYear());
  const month = Number(params.month ?? now.getMonth() + 1);

  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);

  const startIso = isoDate(monthStart);
  const endIso = isoDate(monthEnd);

  const [dbEvents, googleEvents] = await Promise.all([
    db
      .select()
      .from(events)
      .where(and(gte(events.eventDate, startIso), lte(events.eventDate, endIso)))
      .orderBy(asc(events.eventDate)),
    fetchGoogleCalendarEvents(startIso, endIso),
  ]);

  const allEvents: CalendarEvent[] = [
    ...dbEvents.map((e) => ({
      id: e.id,
      title: e.title,
      date: e.eventDate,
      location: e.location || undefined,
      description: e.description || undefined,
      source: "db" as const,
    })),
    ...googleEvents,
  ];

  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const e of allEvents) {
    const existing = eventsByDate.get(e.date) ?? [];
    existing.push(e);
    eventsByDate.set(e.date, existing);
  }

  const firstDay = monthStart.getDay();
  const daysInMonth = monthEnd.getDate();
  const cells: Array<{ date: string | null; day: number | null }> = [];

  for (let i = 0; i < firstDay; i++) cells.push({ date: null, day: null });
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month - 1, day);
    cells.push({ date: isoDate(d), day });
  }

  const prev = new Date(year, month - 2, 1);
  const next = new Date(year, month, 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Event Calendar</h1>
          <p className="mt-2 text-sm text-slate-600">Department events, seminars and deadlines.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/events?year=${prev.getFullYear()}&month=${prev.getMonth() + 1}`}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            ← Prev
          </Link>
          <Link
            href={`/events?year=${next.getFullYear()}&month=${next.getMonth() + 1}`}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Next →
          </Link>
        </div>
      </div>

      <section className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-950">
            {monthStart.toLocaleString(undefined, { month: "long" })} {year}
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" /> Department
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> Google Calendar
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-2 text-xs">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="px-1 py-2 font-semibold text-slate-500">
              {d}
            </div>
          ))}

          {cells.map((c, idx) => {
            const list = c.date ? eventsByDate.get(c.date) ?? [] : [];
            return (
              <div
                key={idx}
                className="min-h-24 rounded-2xl border border-slate-200 bg-white/70 p-2"
              >
                <div className="text-xs font-semibold text-slate-700">{c.day ?? ""}</div>
                <div className="mt-1 space-y-1">
                  {list.slice(0, 3).map((e) => (
                    <div
                      key={e.id}
                      className={`truncate rounded-lg px-2 py-1 text-[11px] ${
                        e.source === "google"
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-indigo-50 text-indigo-800"
                      }`}
                    >
                      {e.title}
                    </div>
                  ))}
                  {list.length > 3 ? (
                    <div className="text-[11px] text-slate-500">+{list.length - 3} more</div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="text-sm font-semibold text-slate-950">Events this month</div>
        <div className="mt-4 space-y-3">
          {allEvents.length ? (
            allEvents.map((e) => (
              <div key={e.id} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="text-sm font-semibold text-slate-950">{e.title}</div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        e.source === "google"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {e.source === "google" ? "Google" : "Department"}
                    </span>
                    <div className="text-xs text-slate-500">{e.date}</div>
                  </div>
                </div>
                {e.location ? <div className="mt-1 text-xs text-slate-500">{e.location}</div> : null}
                {e.description ? (
                  <div className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{e.description}</div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-600">No events for this month.</div>
          )}
        </div>
      </section>
    </div>
  );
}
