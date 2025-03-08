const pool = require("./neon");

module.exports = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Users");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
