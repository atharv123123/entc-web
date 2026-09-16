"use server";

import { db } from "@/db";
import { passwordResets, sessions, users } from "@/db/schema";
import { createSession, logout } from "@/lib/auth";
import { sha256Base64Url, randomTokenBase64Url } from "@/lib/crypto";
import { sendMail } from "@/lib/email";
import { and, eq, gt, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import {
  sanitizeInput,
  validateEmail,
  validateName,
  validatePassword,
} from "@/lib/validation";
import { rateLimitLogin, rateLimitPasswordReset, rateLimitRegister } from "@/lib/rate-limit";

export type AuthActionState = { error?: string; success?: string };

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getClientIp(): string {
  return "global";
}

export async function registerAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const ip = getClientIp();
  const rl = rateLimitRegister(ip);
  if (!rl.allowed) {
    return { error: `Too many attempts. Try again in ${Math.ceil(rl.retryAfterMs / 60000)} minutes.` };
  }

  const name = sanitizeInput(String(formData.get("name") ?? ""), 200);
  const emailRaw = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const email = normalizeEmail(emailRaw);

  if (!name || !email || !password) {
    return { error: "Please fill all fields." };
  }

  if (!validateName(name)) {
    return { error: "Name must be 1-200 characters." };
  }

  if (!validateEmail(email)) {
    return { error: "Invalid email format." };
  }

  const pwResult = validatePassword(password);
  if (!pwResult.valid) {
    return { error: pwResult.error };
  }

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length) {
    return { error: "Email already registered." };
  }

  const adminCountRows = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(users)
    .where(eq(users.role, "admin"));
  const adminCount = adminCountRows[0]?.count ?? 0;
  const canBeAdmin = adminCount < 2;

  const passwordHash = await bcrypt.hash(password, 12);

  const inserted = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash,
      role: canBeAdmin ? "admin" : "user",
    })
    .returning({ id: users.id });

  const userId = inserted[0]?.id;
  if (!userId) return { error: "Registration failed." };

  await createSession(userId);
  redirect("/dashboard");
}

export async function loginAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const ip = getClientIp();
  const rl = rateLimitLogin(ip);
  if (!rl.allowed) {
    return { error: `Too many attempts. Try again in ${Math.ceil(rl.retryAfterMs / 60000)} minutes.` };
  }

  const emailRaw = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const email = normalizeEmail(emailRaw);

  if (!email || !password) {
    return { error: "Please enter email and password." };
  }

  if (!validateEmail(email)) {
    return { error: "Invalid email format." };
  }

  const row = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const user = row[0];
  if (!user) return { error: "Invalid email or password." };

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { error: "Invalid email or password." };

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction() {
  await logout();
  redirect("/");
}

export async function forgotPasswordAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const ip = getClientIp();
  const rl = rateLimitPasswordReset(ip);
  if (!rl.allowed) {
    return { error: `Too many attempts. Try again in ${Math.ceil(rl.retryAfterMs / 60000)} minutes.` };
  }

  const emailRaw = String(formData.get("email") ?? "");
  const email = normalizeEmail(emailRaw);

  if (!email) {
    return { error: "Please enter your email address." };
  }

  if (!validateEmail(email)) {
    return { error: "Invalid email format." };
  }

  const row = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!row.length) {
    return { success: "If that email exists, a reset link has been sent." };
  }

  const userId = row[0].id;

  const token = randomTokenBase64Url(32);
  const tokenHash = sha256Base64Url(token);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await db.insert(passwordResets).values({
    userId,
    tokenHash,
    expiresAt,
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

  await sendMail({
    to: email,
    subject: "Reset your ENTC Web password",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#1e293b">Password Reset</h2>
        <p style="color:#475569;font-size:14px">You requested a password reset. Click the button below to set a new password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#1e293b;color:#fff;text-decoration:none;border-radius:12px;font-weight:600">Reset Password</a>
        <p style="color:#94a3b8;font-size:12px">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });

  return { success: "If that email exists, a reset link has been sent." };
}

export async function resetPasswordAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!token || !password) {
    return { error: "Please fill all fields." };
  }

  const pwResult = validatePassword(password);
  if (!pwResult.valid) {
    return { error: pwResult.error };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const tokenHash = sha256Base64Url(token);
  const now = new Date();

  const resetRow = await db
    .select({ id: passwordResets.id, userId: passwordResets.userId })
    .from(passwordResets)
    .where(
      and(
        eq(passwordResets.tokenHash, tokenHash),
        gt(passwordResets.expiresAt, now),
        sql`${passwordResets.usedAt} IS NULL`,
      ),
    )
    .limit(1);

  if (!resetRow.length) {
    return { error: "Invalid or expired reset link." };
  }

  const { id: resetId, userId } = resetRow[0];

  const passwordHash = await bcrypt.hash(password, 12);

  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, userId));

    await tx
      .update(passwordResets)
      .set({ usedAt: now })
      .where(eq(passwordResets.id, resetId));

    await tx.delete(sessions).where(eq(sessions.userId, userId));
  });

  redirect("/auth/login?reset=success");
}
