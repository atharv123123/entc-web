"use server";

import { db } from "@/db";
import {
  announcements,
  companies,
  departmentInfo,
  events,
  faculty,
  studentRoles,
  users,
} from "@/db/schema";
import { requireAdmin, requireSuperAdmin } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function updateDepartmentInfoAction(formData: FormData) {
  await requireAdmin();

  const motive = String(formData.get("motive") ?? "").trim();
  const hodName = String(formData.get("hodName") ?? "").trim();
  const vicePrincipalName = String(formData.get("vicePrincipalName") ?? "").trim();
  const info = String(formData.get("info") ?? "").trim();

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

  const name = String(formData.get("name") ?? "").trim();
  const designation = String(formData.get("designation") ?? "").trim();
  const sortOrder = Number(String(formData.get("sortOrder") ?? "0"));

  if (!name || !designation) redirect("/admin");

  await db.insert(faculty).values({
    name,
    designation,
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
  });

  redirect("/admin");
}

export async function deleteFacultyAction(formData: FormData) {
  await requireAdmin();
  const id = Number(String(formData.get("id") ?? "0"));
  if (!id) redirect("/admin");
  await db.delete(faculty).where(eq(faculty.id, id));
  redirect("/admin");
}

export async function updateStudentRoleAction(formData: FormData) {
  await requireAdmin();

  const id = Number(String(formData.get("id") ?? "0"));
  const name = String(formData.get("name") ?? "");

  if (!id) redirect("/admin");

  await db.update(studentRoles).set({ name }).where(eq(studentRoles.id, id));
  redirect("/admin");
}

export async function createAnnouncementAction(formData: FormData) {
  const admin = await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!title || !body) redirect("/admin");

  await db.insert(announcements).values({ title, body, createdBy: admin.id });
  redirect("/admin");
}

export async function deleteAnnouncementAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin");
  await db.delete(announcements).where(eq(announcements.id, id));
  redirect("/admin");
}

export async function createEventAction(formData: FormData) {
  const admin = await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const eventDate = String(formData.get("eventDate") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();

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
  if (!id) redirect("/admin");
  await db.delete(events).where(eq(events.id, id));
  redirect("/admin");
}

export async function createCompanyAction(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const visitDate = String(formData.get("visitDate") ?? "").trim();
  const details = String(formData.get("details") ?? "").trim();

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
  if (!id) redirect("/admin");
  await db.delete(companies).where(eq(companies.id, id));
  redirect("/admin");
}

export async function promoteToAdminAction(formData: FormData) {
  await requireSuperAdmin();
  const userId = String(formData.get("userId") ?? "");
  if (!userId) redirect("/admin/members");

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
  if (!userId) redirect("/admin/members");

  await db.update(users).set({ role: "user" }).where(eq(users.id, userId));
  redirect("/admin/members");
}
