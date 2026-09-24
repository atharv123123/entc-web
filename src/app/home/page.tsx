import Link from "next/link";

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

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">Quick Access</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Home</h1>
        <p className="mt-2 text-sm text-slate-600">
          Complaints, feedback, permissions, announcements, companies and events in one place.
        </p>
      </div>

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
    </div>
  );
}
