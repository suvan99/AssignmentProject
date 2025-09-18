require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const storeRoutes = require("./routes/stores");

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);

app.use((req, res) => {
  console.log(` 404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(` Backend running on http://localhost:${PORT}`)
);
