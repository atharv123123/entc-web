import { db } from "@/db";
import { departmentInfo, faculty, studentRoles } from "@/db/schema";
import { asc, sql } from "drizzle-orm";

const DEFAULT_MOTIVE =
  "To provide quality technical education and practical skills that enable students to solve real-world engineering problems, innovate, and contribute to society and industry.";

export async function ensureSeedData() {
  const infoCount = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(departmentInfo);

  if ((infoCount[0]?.count ?? 0) === 0) {
    await db.insert(departmentInfo).values({
      motive: DEFAULT_MOTIVE,
      hodName: "Dr.P.S.Patil",
      vicePrincipalName: "Dr.U.R.More",
      info:
        "ENTC Department focuses on electronics, communication systems, embedded design, and industry-ready practical skills. Use this portal for announcements, events, complaints, feedback, and permission requests.",
    });
  }

  const facultyCount = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(faculty);

  if ((facultyCount[0]?.count ?? 0) === 0) {
    await db.insert(faculty).values([
      {
        name: "Dr. A.D. Jadhav",
        designation: "Principal",
        qualification: "Ph.D. (Electronics Engineering)",
        experience: 38,
        sortOrder: 10,
      },
      {
        name: "Dr. U.R. More",
        designation: "Vice Principal",
        qualification: "Ph.D. (E&TC Engineering)",
        experience: 25,
        sortOrder: 20,
      },
      {
        name: "Dr. P.S. Patil",
        designation: "Head of Department",
        qualification: "Ph.D. (E&TC Engineering)",
        experience: 28,
        sortOrder: 30,
      },
      {
        name: "Dr. S.S. Mulla",
        designation: "Associate Professor",
        qualification: "Ph.D. (Electronics Engineering)",
        experience: 29,
        sortOrder: 40,
      },
      {
        name: "Mrs. S.M. Pawar",
        designation: "Assistant Professor",
        qualification: "M.Tech (E&TC Engineering), Ph.D. (Pursuing)",
        experience: 16,
        sortOrder: 50,
      },
      {
        name: "Mr. S.M. Patil",
        designation: "Assistant Professor",
        qualification: "M.E. (Electronics Engineering), Ph.D. (Pursuing)",
        experience: 20,
        sortOrder: 60,
      },
      {
        name: "Mr. A.S. Jamdade",
        designation: "Assistant Professor",
        qualification: "M.E. (Electronics and Telecommunication Engineering)",
        experience: 16,
        sortOrder: 70,
      },
      {
        name: "Mr. S.D. Mali",
        designation: "Assistant Professor",
        qualification: "M.E. (Electronics Engineering)",
        experience: 23,
        sortOrder: 80,
      },
      {
        name: "Mrs. P.S. Jawale",
        designation: "Assistant Professor",
        qualification: "M.E. (Electronics and Telecommunication Engineering)",
        experience: 4,
        sortOrder: 90,
      },
    ]);
  }

  const rolesCount = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(studentRoles);

  if ((rolesCount[0]?.count ?? 0) === 0) {
    await db.insert(studentRoles).values([
      {
        roleKey: "president_boy",
        label: "President (Boy)",
        name: "",
        sortOrder: 10,
      },
      {
        roleKey: "president_girl",
        label: "President (Girl)",
        name: "",
        sortOrder: 20,
      },
      {
        roleKey: "vice_president_boy",
        label: "Vice President (Boy)",
        name: "",
        sortOrder: 30,
      },
      {
        roleKey: "vice_president_girl",
        label: "Vice President (Girl)",
        name: "",
        sortOrder: 40,
      },
      {
        roleKey: "treasurer_boy",
        label: "Treasurer (Boy)",
        name: "",
        sortOrder: 50,
      },
      {
        roleKey: "treasurer_girl",
        label: "Treasurer (Girl)",
        name: "",
        sortOrder: 60,
      },
    ]);
  }
}

export async function getDepartmentSnapshot() {
  await ensureSeedData();

  const info = await db.select().from(departmentInfo).limit(1);
  const profs = await db.select().from(faculty).orderBy(asc(faculty.sortOrder));
  const roles = await db
    .select()
    .from(studentRoles)
    .orderBy(asc(studentRoles.sortOrder));

  return {
    info: info[0]!,
    faculty: profs,
    roles,
  };
}
