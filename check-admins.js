import User from "./models/user.model.js";
import { connectToDatabase } from "./config/db.config.js";
import { configDotenv } from "dotenv";

configDotenv();

const checkAdmins = async () => {
  try {
    await connectToDatabase();
    console.log("Connected to database");

    // Find all admin users
    const admins = await User.find({ role: "ADMIN", isVerified: true });
    
    console.log("=== AVAILABLE ADMIN ACCOUNTS ===");
    console.log(`Found ${admins.length} verified admin accounts:`);
    
    admins.forEach((admin, index) => {
      console.log(`\n${index + 1}. Admin Account:`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Username: ${admin.username}`);
      console.log(`   Full Name: ${admin.fullname}`);
      console.log(`   Phone: ${admin.phone_number}`);
      console.log(`   Verified: ${admin.isVerified ? 'Yes' : 'No'}`);
    });

    console.log("\n=== RECOMMENDED CREDENTIALS ===");
    console.log("Try logging in with one of these emails:");
    console.log("Email: admin@gmail.com");
    console.log("Password: [You need to know this password]");
    console.log("\nOR");
    console.log("Email: iradianah5@gmail.com");
    console.log("Password: [You need to know this password]");
    
    process.exit(0);
  } catch (error) {
    console.error("Error checking admins:", error);
    process.exit(1);
  }
};

checkAdmins();
