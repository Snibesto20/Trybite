// External package imports
const mongoose = require("mongoose");

export async function dbConnect(): Promise<void> {
  try {
    await mongoose.connect("mongodb://localhost:27017/Trybite");
    console.log(`✅ Successfully connected to the MongoDb database!`);
  } catch (error) {
    console.log(`❌ Error connecting to the database! Error: ${error}`);
  }
}
