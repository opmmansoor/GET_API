import express from "express";
import router from "./router/userRouter.js"

const app = express();

const PORT = 3001;

// Middleware
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Basic Server is Running"
    });
});

//User routes
app.use("/api", router);

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});