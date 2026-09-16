import Link from "next/link";
import { db } from "@/db";
import { announcements, events } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getDepartmentSnapshot } from "@/lib/seed";
import { desc, gte } from "drizzle-orm";

export const dynamic = "force-dynamic";

function FeatureCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-white/70 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
    >
      <div className="text-base font-semibold text-slate-950">{title}</div>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <div className="mt-4 text-sm font-semibold text-indigo-700 group-hover:text-indigo-800">
        Open →
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const [user, dept] = await Promise.all([getCurrentUser(), getDepartmentSnapshot()]);

  const latestAnnouncements = await db
    .select()
    .from(announcements)
    .orderBy(desc(announcements.createdAt))
    .limit(3);

  const today = new Date();
  const iso = today.toISOString().slice(0, 10);
  const upcomingEvents = await db
    .select()
    .from(events)
    .where(gte(events.eventDate, iso))
    .orderBy(desc(events.eventDate))
    .limit(3);

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/60 p-8 shadow-sm backdrop-blur md:p-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(600px_circle_at_20%_20%,rgba(99,102,241,0.18),transparent_60%),radial-gradient(700px_circle_at_90%_10%,rgba(236,72,153,0.16),transparent_60%)]" />
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
          Electronics & Telecommunication Engineering
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
          ENTC Department Portal — Complaints, Feedback, Announcements & Events
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

      <section className="grid gap-4 md:grid-cols-3">
        <FeatureCard
          title="Complaint Box"
          description="Submit and track department-related complaints." 
          href="/complaints"
        />
        <FeatureCard
          title="Feedback"
          description="Share suggestions and rate your experience." 
          href="/feedback"
        />
        <FeatureCard
          title="Permissions"
          description="Request permissions (gate-pass / leave) with status tracking." 
          href="/permissions"
        />
        <FeatureCard
          title="Announcements"
          description="Important notices from the department." 
          href="/announcements"
        />
        <FeatureCard
          title="Incoming Company"
          description="Placement / recruitment visit updates." 
          href="/companies"
        />
        <FeatureCard
          title="Event Calendar"
          description="Department events, seminars and deadlines." 
          href="/events"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/60 bg-white/60 p-6 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-slate-950">Department Leadership</div>
          <div className="mt-4 grid gap-3 text-sm text-slate-700">
            <div className="flex items-start justify-between gap-3">
              <span className="text-slate-600">HOD</span>
              <span className="font-semibold text-slate-950">{dept.info.hodName}</span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-slate-600">Vice Principal</span>
              <span className="font-semibold text-slate-950">{dept.info.vicePrincipalName}</span>
            </div>
          </div>
          <Link href="/department" className="mt-5 inline-block text-sm font-semibold text-indigo-700">
            View professors & student council →
          </Link>
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/60 p-6 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-slate-950">Latest Announcements</div>
          <div className="mt-4 space-y-3">
            {latestAnnouncements.length ? (
              latestAnnouncements.map((a) => (
                <div key={a.id} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <div className="text-sm font-semibold text-slate-950">{a.title}</div>
                  <div className="mt-1 line-clamp-2 text-sm text-slate-600">{a.body}</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-600">No announcements yet.</div>
            )}
          </div>
          <Link href="/announcements" className="mt-5 inline-block text-sm font-semibold text-indigo-700">
            View all →
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-white/60 bg-white/60 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-950">Upcoming Events</div>
            <div className="text-sm text-slate-600">Quick preview from the event calendar.</div>
          </div>
          <Link href="/events" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold">
            Open Calendar
          </Link>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {upcomingEvents.length ? (
            upcomingEvents.map((e) => (
              <div key={e.id} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                <div className="text-sm font-semibold text-slate-950">{e.title}</div>
                <div className="mt-1 text-sm text-slate-600">{e.eventDate}</div>
                {e.location ? <div className="mt-1 text-xs text-slate-500">{e.location}</div> : null}
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-600">No upcoming events yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}

