import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";   // ✅ ADD THIS
import User from "./models/User.js";

dotenv.config({ path: ".env.local" });

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas (RafasInventory DB)"))
  .catch((err) => console.log("❌ MongoDB Atlas Error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("Backend connected to MongoDB Atlas!");
});

// SIGNUP route
app.post("/signup", async (req, res) => {
  console.log("Signup request received:", req.body);

  if (!req.body) {
    console.log("❌ req.body is undefined");
  }

  try {
    const { firstName, lastName, email, password } = req.body;
    console.log("Extracted:", { firstName, lastName, email, password });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    console.log("Existing user:", existingUser);

    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ firstName, lastName, email, password: hashedPassword });

    const savedUser = await newUser.save();
    console.log("Saved user:", savedUser);

    res.json({ success: true, message: "Signup successful!" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Signup failed." });
  }
});

// LOGIN route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Compare password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect password" });
    }

    // Login successful
    res.json({  // Send user info to frontend (without password)
      success: true,
      message: "Login successful!",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });

    
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
