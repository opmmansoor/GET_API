import express from "express";


const router = express.Router();

//get Route
router.get("/", (req,res) => {
    res.send("Get All users")
});

export default router;