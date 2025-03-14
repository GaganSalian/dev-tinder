const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
// const http = require("http");

// CORS Configuration
app.use(cors({
    origin: "http://localhost:5173",
    // methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
    // allowedHeaders: ["Content-Type", "Authorization"],
}));

// app.options("*", cors());  
// Middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

// Import Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

// Use Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// Connect to Database and Start Server
connectDB()
    .then(() => {
        console.log("Database connection established");
        app.listen(3000, () => {
            console.log("Server is successfully running on http://localhost:3000");
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });
