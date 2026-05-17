const express = require("express");
const cors = require("cors");

const villageRoutes = require("./routes/villageRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", villageRoutes);

app.get("/", (req, res) => {
    res.send("Capstone Backend Running");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});