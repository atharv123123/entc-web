import { db } from "@/db";
import { users } from "@/db/schema";
import { requireSuperAdmin } from "@/lib/auth";
import { promoteToAdminAction, demoteAdminAction } from "@/app/actions/admin";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const currentUser = await requireSuperAdmin();

  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(asc(users.createdAt));

  const adminCount = allUsers.filter((u) => u.role === "admin").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-950">Members Management</h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage user roles. Maximum 2 admin accounts allowed.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Current admins: {adminCount}/2
        </p>
      </div>

      <section className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="text-sm font-semibold text-slate-950">All Members</div>
        <div className="mt-4 space-y-3">
          {allUsers.map((user) => (
            <div
              key={user.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4"
            >
              <div>
                <div className="text-sm font-semibold text-slate-950">
                  {user.name}
                  {user.id === currentUser.id && (
                    <span className="ml-2 text-xs text-slate-500">(you)</span>
                  )}
                </div>
                <div className="text-xs text-slate-500">{user.email}</div>
                <div className="mt-1 text-xs text-slate-400">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    user.role === "admin"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {user.role}
                </span>

                {user.id !== currentUser.id && (
                  <>
                    {user.role === "user" ? (
                      <form action={promoteToAdminAction}>
                        <input type="hidden" name="userId" value={user.id} />
                        <button
                          disabled={adminCount >= 2}
                          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Promote
                        </button>
                      </form>
                    ) : (
                      <form action={demoteAdminAction}>
                        <input type="hidden" name="userId" value={user.id} />
                        <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50">
                          Demote
                        </button>
                      </form>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          {!allUsers.length && (
            <div className="text-sm text-slate-600">No users found.</div>
          )}
        </div>
      </section>
    </div>
  );
}
