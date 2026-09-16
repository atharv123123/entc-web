import { db } from "@/db";
import {
  announcements,
  companies,
  complaints,
  events,
  feedback,
  permissionRequests,
  users,
} from "@/db/schema";
import {
  addFacultyAction,
  createAnnouncementAction,
  createCompanyAction,
  createEventAction,
  deleteAnnouncementAction,
  deleteCompanyAction,
  deleteEventAction,
  deleteFacultyAction,
  updateDepartmentInfoAction,
  updateStudentRoleAction,
} from "@/app/actions/admin";
import { updateComplaintStatusAction } from "@/app/actions/complaints";
import { updatePermissionStatusAction } from "@/app/actions/permissions";
import { requireAdmin } from "@/lib/auth";
import { getDepartmentSnapshot } from "@/lib/seed";
import type { ReactNode } from "react";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="text-sm font-semibold text-slate-950">{title}</div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function AdminPage() {
  await requireAdmin();

  const dept = await getDepartmentSnapshot();

  const [
    announcementRows,
    eventRows,
    companyRows,
    complaintRows,
    permissionRows,
    feedbackRows,
  ] = await Promise.all([
    db.select().from(announcements).orderBy(desc(announcements.createdAt)).limit(20),
    db.select().from(events).orderBy(desc(events.eventDate)).limit(20),
    db.select().from(companies).orderBy(desc(companies.createdAt)).limit(20),
    db
      .select({
        id: complaints.id,
        subject: complaints.subject,
        category: complaints.category,
        description: complaints.description,
        status: complaints.status,
        createdAt: complaints.createdAt,
        studentName: users.name,
        studentEmail: users.email,
      })
      .from(complaints)
      .innerJoin(users, eq(users.id, complaints.userId))
      .orderBy(desc(complaints.createdAt))
      .limit(30),
    db
      .select({
        id: permissionRequests.id,
        requestType: permissionRequests.requestType,
        reason: permissionRequests.reason,
        fromDate: permissionRequests.fromDate,
        toDate: permissionRequests.toDate,
        status: permissionRequests.status,
        createdAt: permissionRequests.createdAt,
        studentName: users.name,
        studentEmail: users.email,
      })
      .from(permissionRequests)
      .innerJoin(users, eq(users.id, permissionRequests.userId))
      .orderBy(desc(permissionRequests.createdAt))
      .limit(30),
    db
      .select({
        id: feedback.id,
        rating: feedback.rating,
        message: feedback.message,
        createdAt: feedback.createdAt,
        studentName: users.name,
        studentEmail: users.email,
      })
      .from(feedback)
      .innerJoin(users, eq(users.id, feedback.userId))
      .orderBy(desc(feedback.createdAt))
      .limit(30),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-950">Admin Panel</h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage department content, announcements, events, companies, complaints, permissions and feedback.
        </p>
      </div>

      <Section title="Department Information">
        <form action={updateDepartmentInfoAction} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Department motive</label>
            <textarea
              name="motive"
              rows={3}
              defaultValue={dept.info.motive}
              className="mt-1 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">HOD Name</label>
            <input
              name="hodName"
              defaultValue={dept.info.hodName}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Vice Principal Name</label>
            <input
              name="vicePrincipalName"
              defaultValue={dept.info.vicePrincipalName}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Department info</label>
            <textarea
              name="info"
              rows={4}
              defaultValue={dept.info.info}
              className="mt-1 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
            />
          </div>
          <div className="md:col-span-2">
            <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              Save
            </button>
          </div>
        </form>
      </Section>

      <Section title="Faculty">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-sm font-semibold text-slate-950">Current faculty</div>
            <div className="mt-3 space-y-2">
              {dept.faculty.map((f) => (
                <div
                  key={f.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-950">{f.name}</div>
                    <div className="text-xs text-slate-500">{f.designation}</div>
                  </div>
                  <form action={deleteFacultyAction}>
                    <input type="hidden" name="id" value={f.id} />
                    <button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">
                      Delete
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-950">Add faculty</div>
            <form action={addFacultyAction} className="mt-3 space-y-3">
              <input
                name="name"
                placeholder="Name"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
              />
              <input
                name="designation"
                placeholder="Designation (Assistant Professor etc)"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
              />
              <input
                name="sortOrder"
                placeholder="Sort order (number)"
                type="number"
                defaultValue={100}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
              />
              <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                Add
              </button>
            </form>
          </div>
        </div>
      </Section>

      <Section title="Student Council">
        <div className="space-y-2">
          {dept.roles.map((r) => (
            <form
              key={r.id}
              action={updateStudentRoleAction}
              className="grid items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 md:grid-cols-[220px_1fr_auto]"
            >
              <input type="hidden" name="id" value={r.id} />
              <div className="text-sm font-medium text-slate-700">{r.label}</div>
              <input
                name="name"
                defaultValue={r.name}
                placeholder="Student name"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none ring-indigo-600/20 focus:ring-4"
              />
              <button className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800">
                Save
              </button>
            </form>
          ))}
        </div>
      </Section>

      <Section title="Announcements">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="text-sm font-semibold text-slate-950">Create announcement</div>
            <form action={createAnnouncementAction} className="mt-3 space-y-3">
              <input
                name="title"
                placeholder="Title"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
              />
              <textarea
                name="body"
                rows={4}
                placeholder="Announcement details"
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
              />
              <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                Publish
              </button>
            </form>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-950">Recent announcements</div>
            <div className="mt-3 space-y-2">
              {announcementRows.map((a) => (
                <div key={a.id} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-slate-950">{a.title}</div>
                      <div className="mt-1 line-clamp-2 text-xs text-slate-600">{a.body}</div>
                    </div>
                    <form action={deleteAnnouncementAction}>
                      <input type="hidden" name="id" value={a.id} />
                      <button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
              {!announcementRows.length ? <div className="text-sm text-slate-600">No announcements.</div> : null}
            </div>
          </div>
        </div>
      </Section>

      <Section title="Events">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="text-sm font-semibold text-slate-950">Add event</div>
            <form action={createEventAction} className="mt-3 space-y-3">
              <input
                name="title"
                placeholder="Title"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
              />
              <input
                name="eventDate"
                type="date"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
              />
              <input
                name="location"
                placeholder="Location (optional)"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
              />
              <textarea
                name="description"
                rows={4}
                placeholder="Description (optional)"
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
              />
              <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                Add
              </button>
            </form>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-950">Recent events</div>
            <div className="mt-3 space-y-2">
              {eventRows.map((e) => (
                <div key={e.id} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-slate-950">{e.title}</div>
                      <div className="mt-1 text-xs text-slate-500">{e.eventDate}</div>
                    </div>
                    <form action={deleteEventAction}>
                      <input type="hidden" name="id" value={e.id} />
                      <button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
              {!eventRows.length ? <div className="text-sm text-slate-600">No events.</div> : null}
            </div>
          </div>
        </div>
      </Section>

      <Section title="Incoming Company">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="text-sm font-semibold text-slate-950">Add company</div>
            <form action={createCompanyAction} className="mt-3 space-y-3">
              <input
                name="name"
                placeholder="Company name"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
              />
              <input
                name="visitDate"
                type="date"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
              />
              <textarea
                name="details"
                rows={4}
                placeholder="Details / eligibility / rounds"
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
              />
              <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                Add
              </button>
            </form>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-950">Recent companies</div>
            <div className="mt-3 space-y-2">
              {companyRows.map((c) => (
                <div key={c.id} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-slate-950">{c.name}</div>
                      <div className="mt-1 text-xs text-slate-500">{c.visitDate ?? "TBA"}</div>
                    </div>
                    <form action={deleteCompanyAction}>
                      <input type="hidden" name="id" value={c.id} />
                      <button className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
              {!companyRows.length ? <div className="text-sm text-slate-600">No companies.</div> : null}
            </div>
          </div>
        </div>
      </Section>

      <Section title="Complaints (Manage)">
        <div className="space-y-3">
          {complaintRows.length ? (
            complaintRows.map((c) => (
              <div key={c.id} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-950">{c.subject}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {c.category} • {c.studentName} ({c.studentEmail})
                    </div>
                  </div>
                  <form action={updateComplaintStatusAction} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={c.id} />
                    <select
                      name="status"
                      defaultValue={c.status}
                      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold"
                    >
                      <option value="submitted">submitted</option>
                      <option value="in_progress">in_progress</option>
                      <option value="resolved">resolved</option>
                    </select>
                    <button className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800">
                      Update
                    </button>
                  </form>
                </div>
                <div className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{c.description}</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-600">No complaints yet.</div>
          )}
        </div>
      </Section>

      <Section title="Permissions (Manage)">
        <div className="space-y-3">
          {permissionRows.length ? (
            permissionRows.map((r) => (
              <div key={r.id} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-950">{r.requestType}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {r.fromDate} → {r.toDate} • {r.studentName} ({r.studentEmail})
                    </div>
                  </div>
                  <form action={updatePermissionStatusAction} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={r.id} />
                    <select
                      name="status"
                      defaultValue={r.status}
                      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold"
                    >
                      <option value="pending">pending</option>
                      <option value="approved">approved</option>
                      <option value="rejected">rejected</option>
                    </select>
                    <button className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800">
                      Update
                    </button>
                  </form>
                </div>
                <div className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{r.reason}</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-600">No permission requests yet.</div>
          )}
        </div>
      </Section>

      <Section title="Feedback (Read)">
        <div className="space-y-3">
          {feedbackRows.length ? (
            feedbackRows.map((f) => (
              <div key={f.id} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-slate-950">
                      {f.studentName} ({f.studentEmail})
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{new Date(f.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    Rating: {f.rating ?? "—"}
                  </div>
                </div>
                <div className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{f.message}</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-600">No feedback yet.</div>
          )}
        </div>
      </Section>
    </div>
  );
}
