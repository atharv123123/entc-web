import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { sha256Base64Url, randomTokenBase64Url } from "@/lib/crypto";
import { and, eq, gt, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE_NAME = "entc_session";
const SESSION_TTL_DAYS = 30;
const SESSION_ROTATE_AFTER_DAYS = 7;

export type CurrentUser = typeof users.$inferSelect;

async function getSessionCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

async function setSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    secure: process.env.NODE_ENV === "production",
  });
}

async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
  });
}

export async function createSession(userId: string) {
  const token = randomTokenBase64Url(32);
  const tokenHash = sha256Base64Url(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  await db.insert(sessions).values({
    userId,
    tokenHash,
    expiresAt,
  });

  await setSessionCookie(token, expiresAt);
}

export async function logout() {
  const token = await getSessionCookie();
  if (!token) {
    await clearSessionCookie();
    return;
  }

  const tokenHash = sha256Base64Url(token);
  await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
  await clearSessionCookie();
}

export async function logoutAllSessions(userId: string) {
  await db.delete(sessions).where(eq(sessions.userId, userId));
  await clearSessionCookie();
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = await getSessionCookie();
  if (!token) return null;

  const tokenHash = sha256Base64Url(token);
  const now = new Date();

  const sessionRow = await db
    .select({ userId: sessions.userId, createdAt: sessions.createdAt, expiresAt: sessions.expiresAt })
    .from(sessions)
    .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, now)))
    .limit(1);

  const session = sessionRow[0];
  if (!session) return null;

  const sessionAge = now.getTime() - new Date(session.createdAt).getTime();
  if (sessionAge > SESSION_ROTATE_AFTER_DAYS * 24 * 60 * 60 * 1000) {
    const newToken = randomTokenBase64Url(32);
    const newTokenHash = sha256Base64Url(newToken);
    const newExpiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

    await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
    await db.insert(sessions).values({
      userId: session.userId,
      tokenHash: newTokenHash,
      expiresAt: newExpiresAt,
    });
    await setSessionCookie(newToken, newExpiresAt);
  }

  const userRow = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  return userRow[0] ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}

export async function requireSuperAdmin() {
  const user = await requireAdmin();

  const countRows = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(users)
    .where(eq(users.role, "admin"));

  const adminCount = countRows[0]?.count ?? 0;

  if (adminCount > 2 && user.role !== "admin") {
    redirect("/admin");
  }

  return user;
}
