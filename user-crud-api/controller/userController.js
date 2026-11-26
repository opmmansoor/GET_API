import fs from "fs/promises";

// GET all users
export const getUsers = async (req, res) => {
  try {
    // Read db.json
    const data = await fs.readFile("./db.json", "utf-8");

    // Convert JSON string into JavaScript object
    const db = JSON.parse(data);

    // Get users from db.json
    res.status(200).json(db.users)

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
