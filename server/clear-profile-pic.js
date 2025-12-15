import mongoose from "mongoose";
import User from "./model/User.js";
import "dotenv/config";

const clearMissingProfilePic = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find user with the missing profile picture
    const user = await User.findOne({ profile_picture: "1763266677344-jayank photo.jpg" });

    if (user) {
      // Clear the profile picture
      user.profile_picture = "";
      await user.save();
      console.log(`Cleared profile picture for user: ${user.email}`);
    } else {
      console.log("User with missing profile picture not found");
    }

    // Close connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error:", error);
  }
};

clearMissingProfilePic();
