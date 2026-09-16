const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

export default {
  dialect: "postgresql" as const,
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: databaseUrl,
  },
};
