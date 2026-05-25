const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// ================= STATES =================
router.get("/states", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, "state_name" FROM public.state ORDER BY "state_name"`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("States Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= DISTRICTS =================
router.get("/districts/:stateId", async (req, res) => {
  try {
    const { stateId } = req.params;

    const result = await pool.query(
      `SELECT id, district_name
       FROM district
       WHERE state_id = $1
       ORDER BY district_name`,
      [stateId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("District Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= SUBDISTRICTS =================
router.get("/subdistricts/:districtId", async (req, res) => {
  try {
    const { districtId } = req.params;

    const result = await pool.query(
      `SELECT id, subdistrict_name
       FROM subdistrict
       WHERE district_id = $1
       ORDER BY subdistrict_name`,
      [districtId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Subdistrict Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= VILLAGES =================
router.get("/villages/:subdistrictId", async (req, res) => {
  try {
    const { subdistrictId } = req.params;

    const result = await pool.query(
      `SELECT id, village_name
       FROM village
       WHERE subdistrict_id = $1
       ORDER BY village_name`,
      [subdistrictId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Village Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;