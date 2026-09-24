"use server";

import { db } from "@/db";
import {
  announcements,
  companies,
  departmentInfo,
  events,
  faculty,
  news,
  studentRoles,
  users,
} from "@/db/schema";
import { requireAdmin, requireSuperAdmin } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { sanitizeInput, validateName, validateUUID } from "@/lib/validation";

export async function updateDepartmentInfoAction(formData: FormData) {
  await requireAdmin();

  const motive = sanitizeInput(String(formData.get("motive") ?? ""), 2000);
  const hodName = sanitizeInput(String(formData.get("hodName") ?? ""), 200);
  const vicePrincipalName = sanitizeInput(String(formData.get("vicePrincipalName") ?? ""), 200);
  const info = sanitizeInput(String(formData.get("info") ?? ""), 5000);

  if (!motive || !hodName || !vicePrincipalName || !info) redirect("/admin");

  const row = await db.select({ id: departmentInfo.id }).from(departmentInfo).limit(1);
  const id = row[0]?.id;
  if (!id) {
    await db.insert(departmentInfo).values({ motive, hodName, vicePrincipalName, info });
  } else {
    await db
      .update(departmentInfo)
      .set({ motive, hodName, vicePrincipalName, info, updatedAt: new Date() })
      .where(eq(departmentInfo.id, id));
  }

  redirect("/admin");
}

export async function addFacultyAction(formData: FormData) {
  await requireAdmin();

  const name = sanitizeInput(String(formData.get("name") ?? ""), 200);
  const designation = sanitizeInput(String(formData.get("designation") ?? ""), 200);
  const sortOrder = Number(String(formData.get("sortOrder") ?? "0"));

  if (!name || !designation) redirect("/admin");
  if (!validateName(name)) redirect("/admin");

  await db.insert(faculty).values({
    name,
    designation,
    sortOrder: Number.isFinite(sortOrder) ? Math.min(sortOrder, 9999) : 0,
  });

  redirect("/admin");
}

export async function deleteFacultyAction(formData: FormData) {
  await requireAdmin();
  const id = Number(String(formData.get("id") ?? "0"));
  if (!id || !Number.isFinite(id)) redirect("/admin");
  await db.delete(faculty).where(eq(faculty.id, id));
  redirect("/admin");
}

export async function updateStudentRoleAction(formData: FormData) {
  await requireAdmin();

  const id = Number(String(formData.get("id") ?? "0"));
  const name = sanitizeInput(String(formData.get("name") ?? ""), 200);

  if (!id || !Number.isFinite(id)) redirect("/admin");

  await db.update(studentRoles).set({ name }).where(eq(studentRoles.id, id));
  redirect("/admin");
}

export async function createAnnouncementAction(formData: FormData) {
  const admin = await requireAdmin();

  const title = sanitizeInput(String(formData.get("title") ?? ""), 200);
  const body = sanitizeInput(String(formData.get("body") ?? ""), 5000);
  if (!title || !body) redirect("/admin");

  await db.insert(announcements).values({ title, body, createdBy: admin.id });
  redirect("/admin");
}

export async function deleteAnnouncementAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id || !validateUUID(id)) redirect("/admin");
  await db.delete(announcements).where(eq(announcements.id, id));
  redirect("/admin");
}

export async function createNewsAction(formData: FormData) {
  const admin = await requireAdmin();

  const title = sanitizeInput(String(formData.get("title") ?? ""), 200);
  const body = sanitizeInput(String(formData.get("body") ?? ""), 5000);
  if (!title || !body) redirect("/admin");

  await db.insert(news).values({ title, body, createdBy: admin.id });
  redirect("/admin");
}

export async function deleteNewsAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id || !validateUUID(id)) redirect("/admin");
  await db.delete(news).where(eq(news.id, id));
  redirect("/admin");
}

export async function createEventAction(formData: FormData) {
  const admin = await requireAdmin();

  const title = sanitizeInput(String(formData.get("title") ?? ""), 200);
  const description = sanitizeInput(String(formData.get("description") ?? ""), 5000);
  const eventDate = String(formData.get("eventDate") ?? "").trim();
  const location = sanitizeInput(String(formData.get("location") ?? ""), 200);

  if (!title || !eventDate) redirect("/admin");

  await db.insert(events).values({
    title,
    description,
    eventDate,
    location,
    createdBy: admin.id,
  });

  redirect("/admin");
}

export async function deleteEventAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id || !validateUUID(id)) redirect("/admin");
  await db.delete(events).where(eq(events.id, id));
  redirect("/admin");
}

export async function createCompanyAction(formData: FormData) {
  await requireAdmin();

  const name = sanitizeInput(String(formData.get("name") ?? ""), 200);
  const visitDate = String(formData.get("visitDate") ?? "").trim();
  const details = sanitizeInput(String(formData.get("details") ?? ""), 5000);

  if (!name) redirect("/admin");

  await db.insert(companies).values({
    name,
    details,
    visitDate: visitDate ? visitDate : undefined,
  });

  redirect("/admin");
}

export async function deleteCompanyAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id || !validateUUID(id)) redirect("/admin");
  await db.delete(companies).where(eq(companies.id, id));
  redirect("/admin");
}

export async function promoteToAdminAction(formData: FormData) {
  await requireSuperAdmin();
  const userId = String(formData.get("userId") ?? "");
  if (!userId || !validateUUID(userId)) redirect("/admin/members");

  const adminCountRows = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(users)
    .where(eq(users.role, "admin"));

  if ((adminCountRows[0]?.count ?? 0) >= 2) {
    redirect("/admin/members");
  }

  await db.update(users).set({ role: "admin" }).where(eq(users.id, userId));
  redirect("/admin/members");
}

export async function demoteAdminAction(formData: FormData) {
  await requireSuperAdmin();
  const userId = String(formData.get("userId") ?? "");
  if (!userId || !validateUUID(userId)) redirect("/admin/members");

  await db.update(users).set({ role: "user" }).where(eq(users.id, userId));
  redirect("/admin/members");
}
