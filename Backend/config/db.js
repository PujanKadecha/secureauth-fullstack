const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.error("  DATABASE_URL is missing in .env file");
      process.exit(1);
    }

    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Database Connected Successfully");
  } catch (err) {
    console.error("Database Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;