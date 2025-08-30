import User from "./models/user.model.js";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "./config/db.config.js";
import { configDotenv } from "dotenv";

configDotenv();

const resetAdminPassword = async () => {
  try {
    await connectToDatabase();
    console.log("Connected to database");

    // Find admin by email
    const admin = await User.findOne({ 
      email: "admin@gmail.com",
      role: "ADMIN"
    });

    if (!admin) {
      console.log("Admin not found with email: admin@gmail.com");
      process.exit(1);
    }

    // Hash new password
    const newPassword = "admin123";
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update admin password
    admin.password = hashedPassword;
    admin.isVerified = true;
    await admin.save();

    console.log(" Admin password reset successfully!");
    console.log(" Email: admin@gmail.com");
    console.log(" Password: admin123");
    console.log(" Role: ADMIN");
    console.log("\nYou can now login with these credentials.");
    
    process.exit(0);
  } catch (error) {
    console.error("Error resetting admin password:", error);
    process.exit(1);
  }
};

resetAdminPassword();
