const jwt = require("jsonwebtoken");
const User = require("../models/user");

const SECRET_KEY = "Dev@Tinder$790"; // Make sure it's the same key used in login

const userAuth = async (req, res, next) => {
  try {
    console.log("Incoming Headers:", req.headers);
    console.log("Incoming Cookies:", req.cookies);

    let token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, error: "Please log in!" });
    }

    // Debugging: Log received token
    console.log("Received Token:", token);

    // Verify JWT token
    const decodedObj = jwt.verify(token, SECRET_KEY);
    console.log("Decoded Token:", decodedObj);

    if (!decodedObj || !decodedObj._id) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    const { _id } = decodedObj;

    // Fetch user from DB
    const user = await User.findById(_id);
    console.log("Fetched User:", user);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    req.user = user; // Attach user object to req
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    res.status(400).json({ success: false, error: "Authentication failed: " + err.message });
  }
};

module.exports = { userAuth };
