const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

// CORS Middleware (Handles Preflight Requests)
authRouter.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Signup Route
authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    //   Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// Login Route
authRouter.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body);
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      console.log("Invalid email:", emailId);
      return res.status(401).json({ success: false, error: "Invalid email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password for:", emailId);
      return res.status(401).json({ success: false, error: "Invalid password" });
    }

    const token = await user.getJWT();
    console.log("Generated Token:", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Change to `true` in production
      sameSite: "Lax", // Change to "None" if using HTTPS with cross-origin requests
    });

    res.json({ success: true, message: "Login successful", data: user });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(400).json({ success: false, error: err.message });
  }
});

// Logout Route
authRouter.post("/logout", async (req, res) => {
  console.log("Logout request received");
  
  res.cookie("token", "", {
    expires: new Date(0), // Expire the cookie immediately
    httpOnly: true,
    secure: false, // Change to `true` in production
    sameSite: "Lax",
  });

  res.json({ success: true, message: "Logout successful" });
});

module.exports = authRouter;
