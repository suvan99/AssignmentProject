const express = require("express");
const pool = require("../db");
const router = express.Router();

function isAdmin(req) {
  return req.body.role === "admin";
}
function isUser(req) {
  return req.body.role === "user";
}

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.id, s.name, s.address,
              ROUND(IFNULL(AVG(r.rating),0),1) as average_rating,
              COUNT(r.user_id) AS total_ratings,
              IF(COUNT(r.user_id)=0,'[]',JSON_ARRAYAGG(JSON_OBJECT('user_id', r.user_id, 'rating', r.rating))) AS ratings
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       GROUP BY s.id`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const { name, address, role } = req.body;
  if (!isAdmin(req)) return res.status(403).json({ message: "Only admins can add stores" });
  try {
    await pool.query("INSERT INTO stores (name, address) VALUES (?, ?)", [name, address]);
    res.json({ message: "Store added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!isAdmin(req)) return res.status(403).json({ message: "Only admins can delete stores" });
  try {
    await pool.query("DELETE FROM stores WHERE id = ?", [id]);
    res.json({ message: "Store deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/rate", async (req, res) => {
  const { id } = req.params;
  const { rating, user_id, role } = req.body;
  if (!isUser(req)) return res.status(403).json({ message: "Only users can rate stores" });
  try {
    await pool.query(
      "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?",
      [user_id, id, rating, rating]
    );
    res.json({ message: "Rating added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
