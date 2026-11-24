
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON file path
const filePath = path.join(__dirname, "../data/users.json");

// Read users
const readUsers = async () => {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
};

// Write users
const writeUsers = async (users) => {
    await fs.writeFile(
        filePath,
        JSON.stringify(users, null, 2)
    );
};


// 1. CREATE USER - POST
router.post("/", async (req, res) => {
    try {
        const users = await readUsers();

        const { name, email, age } = req.body;

        // Basic validation
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        // Check duplicate email
        const existingUser = users.find(
            user => user.email.toLowerCase() === email.toLowerCase()
        );

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            age,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        users.push(newUser);

        await writeUsers(users);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// 2. READ ALL USERS - GET
router.get("/", async (req, res) => {
    try {
        const users = await readUsers();

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// 3. READ SINGLE USER - GET BY ID
router.get("/:id", async (req, res) => {
    try {
        const users = await readUsers();

        const { id } = req.params;

        const user = users.find(
            user => user.id === id
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// 4. UPDATE USER - PUT
router.put("/:id", async (req, res) => {
    try {
        const users = await readUsers();

        const { id } = req.params;
        const { name, email, age } = req.body;

        const userIndex = users.findIndex(
            user => user.id === id
        );

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Validate provided fields
        if (
            name !== undefined &&
            (typeof name !== "string" || name.trim().length < 2)
        ) {
            return res.status(400).json({
                success: false,
                message: "Name must contain at least 2 characters"
            });
        }

        if (
            email !== undefined &&
            (typeof email !== "string" ||
             !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            });
        }

        if (
            age !== undefined &&
            (typeof age !== "number" || !Number.isFinite(age))
        ) {
            return res.status(400).json({
                success: false,
                message: "Age must be a number"
            });
        }

        // Check duplicate email
        if (email !== undefined) {
            const duplicate = users.some(
                user =>
                    user.id !== id &&
                    user.email.toLowerCase() === email.trim().toLowerCase()
            );

            if (duplicate) {
                return res.status(409).json({
                    success: false,
                    message: "Email already exists"
                });
            }
        }

        // Update user
        const updatedUser = {
            ...users[userIndex],
            ...(name !== undefined && { name: name.trim() }),
            ...(email !== undefined && { email: email.trim().toLowerCase() }),
            ...(age !== undefined && { age }),
            updatedAt: new Date().toISOString()
        };

        users[userIndex] = updatedUser;

        await writeUsers(users);

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


// 5. DELETE USER - DELETE
router.delete("/:id", async (req, res) => {
    try {
        const users = await readUsers();

        const { id } = req.params;

        const userIndex = users.findIndex(
            user => user.id === id
        );

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const deletedUser = users.splice(userIndex, 1)[0];

        await writeUsers(users);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: deletedUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
