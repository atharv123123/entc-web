import Link from "next/link";
import { db } from "@/db";
import { announcements, complaints, permissionRequests } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { and, desc, eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-slate-950">{value}</div>
    </div>
  );
}

function LinkCard({ title, href, description }: { title: string; href: string; description: string }) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
    >
      <div className="text-base font-semibold text-slate-950">{title}</div>
      <div className="mt-2 text-sm text-slate-600">{description}</div>
    </Link>
  );
}

export default async function DashboardPage() {
  const user = await requireUser();

  const complaintCounts = await db
    .select({
      submitted: sql<number>`cast(count(*) filter (where ${complaints.status} = 'submitted') as int)`,
      inProgress: sql<number>`cast(count(*) filter (where ${complaints.status} = 'in_progress') as int)`,
      resolved: sql<number>`cast(count(*) filter (where ${complaints.status} = 'resolved') as int)`,
    })
    .from(complaints)
    .where(eq(complaints.userId, user.id));

  const permissionPending = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(permissionRequests)
    .where(and(eq(permissionRequests.userId, user.id), eq(permissionRequests.status, "pending")));

  const latestAnnouncements = await db
    .select()
    .from(announcements)
    .orderBy(desc(announcements.createdAt))
    .limit(4);

  const stats = complaintCounts[0] ?? { submitted: 0, inProgress: 0, resolved: 0 };
  const pending = permissionPending[0]?.count ?? 0;

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] border border-white/60 bg-white/60 p-8 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">Welcome, {user.name}</h1>
            <p className="mt-2 text-sm text-slate-600">
              Role: <span className="font-semibold text-slate-900">{user.role}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/complaints/new"
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              New Complaint
            </Link>
            <Link
              href="/feedback"
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Give Feedback
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Submitted" value={stats.submitted ?? 0} />
        <StatCard label="In Progress" value={stats.inProgress ?? 0} />
        <StatCard label="Resolved" value={stats.resolved ?? 0} />
        <StatCard label="Pending Permissions" value={pending} />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <LinkCard title="Complaint Box" href="/complaints" description="View or submit complaints." />
        <LinkCard title="Announcements" href="/announcements" description="See latest department notices." />
        <LinkCard title="Event Calendar" href="/events" description="Upcoming events & seminars." />
        <LinkCard title="Incoming Company" href="/companies" description="Placement visit updates." />
        <LinkCard title="Permissions" href="/permissions" description="Request and track permissions." />
        {user.role === "admin" ? (
          <LinkCard title="Admin Panel" href="/admin" description="Manage content and requests." />
        ) : (
          <LinkCard title="Department" href="/department" description="HOD, professors and council." />
        )}
      </section>

      <section className="rounded-3xl border border-white/60 bg-white/60 p-6 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-950">Latest Announcements</div>
            <div className="text-sm text-slate-600">Quick updates from the department.</div>
          </div>
          <Link href="/announcements" className="text-sm font-semibold text-indigo-700">
            View all →
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
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
      </section>
    </div>
  );
}
