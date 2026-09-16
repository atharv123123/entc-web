import {
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const complaintStatusEnum = pgEnum("complaint_status", [
  "submitted",
  "in_progress",
  "resolved",
]);
export const permissionStatusEnum = pgEnum("permission_status", [
  "pending",
  "approved",
  "rejected",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("user"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    emailUnique: uniqueIndex("users_email_unique").on(t.email),
    roleIdx: index("users_role_idx").on(t.role),
  }),
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    tokenHashUnique: uniqueIndex("sessions_token_hash_unique").on(t.tokenHash),
    userIdIdx: index("sessions_user_id_idx").on(t.userId),
    expiresAtIdx: index("sessions_expires_at_idx").on(t.expiresAt),
  }),
);

export const departmentInfo = pgTable("department_info", {
  id: serial("id").primaryKey(),
  motive: text("motive").notNull(),
  hodName: text("hod_name").notNull(),
  vicePrincipalName: text("vice_principal_name").notNull(),
  info: text("info").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const faculty = pgTable(
  "faculty",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    designation: text("designation").notNull(),
    qualification: text("qualification").notNull().default(""),
    experience: integer("experience").notNull().default(0),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => ({
    sortIdx: index("faculty_sort_idx").on(t.sortOrder),
  }),
);

export const studentRoles = pgTable(
  "student_roles",
  {
    id: serial("id").primaryKey(),
    roleKey: text("role_key").notNull(),
    label: text("label").notNull(),
    name: text("name").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => ({
    roleKeyUnique: uniqueIndex("student_roles_role_key_unique").on(t.roleKey),
    sortIdx: index("student_roles_sort_idx").on(t.sortOrder),
  }),
);

export const announcements = pgTable(
  "announcements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
  },
  (t) => ({
    createdAtIdx: index("announcements_created_at_idx").on(t.createdAt),
  }),
);

export const complaints = pgTable(
  "complaints",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    category: text("category").notNull(),
    subject: text("subject").notNull(),
    description: text("description").notNull(),
    status: complaintStatusEnum("status").notNull().default("submitted"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userIdIdx: index("complaints_user_id_idx").on(t.userId),
    statusIdx: index("complaints_status_idx").on(t.status),
    createdAtIdx: index("complaints_created_at_idx").on(t.createdAt),
  }),
);

export const feedback = pgTable(
  "feedback",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rating: integer("rating"),
    message: text("message").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userIdIdx: index("feedback_user_id_idx").on(t.userId),
    createdAtIdx: index("feedback_created_at_idx").on(t.createdAt),
  }),
);

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    eventDate: date("event_date").notNull(),
    location: text("location").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
  },
  (t) => ({
    eventDateIdx: index("events_event_date_idx").on(t.eventDate),
  }),
);

export const companies = pgTable(
  "companies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    details: text("details").notNull().default(""),
    visitDate: date("visit_date"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    visitDateIdx: index("companies_visit_date_idx").on(t.visitDate),
  }),
);

export const passwordResets = pgTable(
  "password_resets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    tokenHashUnique: uniqueIndex("password_resets_token_hash_unique").on(
      t.tokenHash,
    ),
    userIdIdx: index("password_resets_user_id_idx").on(t.userId),
  }),
);

export const permissionRequests = pgTable(
  "permission_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    requestType: text("request_type").notNull(),
    reason: text("reason").notNull(),
    fromDate: date("from_date").notNull(),
    toDate: date("to_date").notNull(),
    status: permissionStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userIdIdx: index("permission_requests_user_id_idx").on(t.userId),
    statusIdx: index("permission_requests_status_idx").on(t.status),
    createdAtIdx: index("permission_requests_created_at_idx").on(t.createdAt),
  }),
);

