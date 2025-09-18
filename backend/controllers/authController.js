const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  console.log(" Signup attempt:", name, email, role);

  try {
    if (name.length < 20 || name.length > 60) {
      return res.status(400).json({ message: "Name must be 20–60 characters" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
    if (rows.length) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const userRole = role && ["admin", "user"].includes(role) ? role : "user";

    await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?,?,?,?,?)",
      [name, email, hashed, address, userRole]
    );

    res.json({ message: `User registered successfully as ${userRole}` });
  } catch (err) {
    console.error(" Signup error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
    if (!rows.length) return res.status(400).json({ message: "Invalid credentials" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(" Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};