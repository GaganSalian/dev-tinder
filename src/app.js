const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

const HOST = "51.21.3.185"; // Change from localhost to your server IP
const PORT = 3000;

// CORS Configuration
app.use(cors({
    origin: "http://51.21.3.185:5173", // Update frontend origin
    credentials: true,
}));

// Middleware
app.use(express.json());
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
        app.listen(PORT, HOST, () => {
            console.log(`Server is successfully running on http://${HOST}:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });
