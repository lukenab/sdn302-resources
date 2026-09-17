import "dotenv/config";

const requiredVariables = ["MONGODB_URI", "DB_NAME"];

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing environment variable: ${variable}`);
  }
}

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3000),
  mongoUri: process.env.MONGODB_URI,
  databaseName: process.env.DB_NAME,
});