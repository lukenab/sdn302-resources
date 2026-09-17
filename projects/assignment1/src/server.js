import { createApp } from "./app.js";
import { env } from "./config/env.js";

import { connectDatabase } from "./database/mongodb.js";

async function bootstrap() {
  const { client, database } = await connectDatabase({
    uri: env.mongoUri,
    databaseName: env.databaseName,
  });

  const app = createApp({ database });
  const server = app.listen(env.port, () => {
    console.log(`Server is running at http://localhost:${env.port}`);
  });
}
bootstrap().catch((error) => {
  console.error("Application failed to start", error);
  process.exit(1);
});
