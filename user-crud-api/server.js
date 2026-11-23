import express from "express";
import userRoutes from "./routes/userRoutes.js"

const app = express();

// Middleware to read JSON data
app.use(express.json);

// User routes
app.use("/api/users", userRoutes)

app.get("/", (req,res) => {
    res.send("Welcom to Express API")
});

app.listen(6000, () => {
    console.log("Server Running at http://localhost:6000");
    
})