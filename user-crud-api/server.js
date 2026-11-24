import express from "express";
import userRoutes from "./routes/userRoutes.js";

const app = express();

const PORT = 5000;

// Middleware
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "User API is running"
    });
});

// User routes
app.use("/api/users", userRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});