import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const envPath = path.join(root, ".env");
const envExamplePath = path.join(root, ".env.example");

if (!fs.existsSync(envPath)) {
  if (!fs.existsSync(envExamplePath)) {
    throw new Error("Missing .env.example. Cannot create .env.");
  }

  fs.copyFileSync(envExamplePath, envPath);
  console.log("Created .env from .env.example.");
}

execSync("npx prisma generate", { stdio: "inherit" });
execSync("npx prisma migrate dev", { stdio: "inherit" });

console.log("Setup complete. Database is initialized and Prisma client is generated.");
