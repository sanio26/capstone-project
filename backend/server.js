const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const villageRoutes = require("./routes/villageRoutes");

// API routes
app.use("/api", villageRoutes);

// Server port
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Database connected");
});