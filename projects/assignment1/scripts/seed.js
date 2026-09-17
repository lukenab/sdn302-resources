import { readFile } from "node:fs/promises";
import { BSON } from "mongodb";

import { env } from "../src/config/env.js";
import { connectDatabase } from "../src/database/mongodb.js";

async function seed() {
  const dataUrl = new URL(
    "../data/ticket_data_ass1_normalized.json",
    import.meta.url,
  );

  const fileContent = await readFile(dataUrl, "utf8");
  const data = BSON.EJSON.parse(fileContent);

  const { client, database } = await connectDatabase({
    uri: env.mongoUri,
    databaseName: env.databaseName,
  });

  try {
    const users = database.collection("users");
    const tickets = database.collection("tickets");

    await tickets.deleteMany({});
    await users.deleteMany({});

    await users.insertMany(data.users);
    await tickets.insertMany(data.tickets);

    await users.createIndex({ email: 1 }, { unique: true });
    await tickets.createIndex({ userId: 1 });

    console.log(
      `Seeded ${data.users.length} users and ${data.tickets.length} tickets into ${env.databaseName}.`,
    );
  } finally {
    await client.close();
  }
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
