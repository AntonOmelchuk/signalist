import dotenv from "dotenv";
dotenv.config({ path: process.env.ENV_PATH || ".env" });

import { connectToDatabase } from "../database/mongoose";

async function main() {
  console.log("Testing MongoDB connection...");

  try {
    await connectToDatabase();
    console.log("✅ MongoDB connection test succeeded.");
  } catch (error) {
    console.error("❌ MongoDB connection test failed:", error);
    process.exit(1);
  } finally {
    // close mongoose connection to avoid hanging process if this is used in CI
    const mongoose = await import("mongoose");
    await mongoose.disconnect();
  }
}

main();
