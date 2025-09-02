import User from "./models/user.model.js";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "./config/db.config.js";
import { configDotenv } from "dotenv";

configDotenv();

const setupAdmin = async () => {
  try {
    await connectToDatabase();
    console.log("Connected to database");

    // Admin credentials
    const adminCredentials = {
      fullname: "System Administrator",
      username: "kfh_admin",
      email: "admin@kfh.com",
      phone_number: "+250788000000",
      password: "admin123",
      role: "ADMIN"
    };

    //  if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: adminCredentials.email },
        { username: adminCredentials.username }
      ]
    });

    if (existingAdmin) {
      console.log("Admin already exists!");
      console.log("Use these credentials to login:");
      console.log("Email:", adminCredentials.email);
      console.log("Password: admin123");
      console.log("Username:", adminCredentials.username);
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(adminCredentials.password, salt);

    // Create admin user
    const admin = new User({
      fullname: adminCredentials.fullname,
      username: adminCredentials.username,
      email: adminCredentials.email,
      password: hashedPassword,
      phone_number: adminCredentials.phone_number,
      role: adminCredentials.role,
      isVerified: true 
      
    });

    await admin.save();
    
    console.log(" Admin account created successfully!");
    console.log(" Email: admin@kfh.com");
    console.log(" Password: admin123");
    console.log(" Role: ADMIN");
    console.log("\nYou can now login with these credentials.");
    
    process.exit(0);
  } catch (error) {
    console.error("Error setting up admin:", error);
    process.exit(1);
  }
};

setupAdmin();
