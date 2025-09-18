const pool = require("../db");

exports.getStores = async (req, res) => {
  const [rows] = await pool.query(`
    SELECT s.id, s.name, s.address, IFNULL(AVG(r.rating), 0) as average_rating
    FROM stores s LEFT JOIN ratings r ON s.id = r.store_id
    GROUP BY s.id
  `);
  res.json(rows);
};

exports.rateStore = async (req, res) => {
  const { user_id, rating } = req.body;
  const storeId = req.params.id;

  await pool.query(`
    INSERT INTO ratings (user_id, store_id, rating)
    VALUES (?,?,?)
    ON DUPLICATE KEY UPDATE rating=?`,
    [user_id, storeId, rating, rating]);

  res.json({ message: "Rating saved" });
};
