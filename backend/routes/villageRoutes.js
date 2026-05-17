const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// ===============================
// Get all states
// ===============================
router.get("/states", async (req, res) => {
    try {

        const result = await pool.query(
            "SELECT * FROM state ORDER BY state_name"
        );

        res.json(result.rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Server Error"
        });
    }
});

// ===============================
// Get districts by state
// ===============================
router.get("/districts/:stateId", async (req, res) => {

    const { stateId } = req.params;

    try {

        const result = await pool.query(
            `
            SELECT *
            FROM district
            WHERE state_id = $1
            ORDER BY district_name
            `,
            [stateId]
        );

        res.json(result.rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Server Error"
        });
    }
});

// ===============================
// Get subdistricts
// ===============================
router.get(
    "/subdistricts/:districtId",
    async (req, res) => {

        const { districtId } =
            req.params;

        try {

            const result =
                await pool.query(
                    `
                    SELECT *
                    FROM subdistrict
                    WHERE district_id = $1
                    ORDER BY subdistrict_name
                    `,
                    [districtId]
                );

            res.json(
                result.rows
            );

        } catch (error) {

            console.log(error);

            res.status(500).json({
                error:
                    "Server Error"
            });
        }
    }
);

// ===============================
// Get villages
// ===============================
router.get(
    "/villages/:subdistrictId",
    async (req, res) => {

        const {
            subdistrictId
        } = req.params;

        try {

            const result =
                await pool.query(
                    `
                    SELECT *
                    FROM village
                    WHERE subdistrict_id = $1
                    LIMIT 100
                    `,
                    [subdistrictId]
                );

            res.json(
                result.rows
            );

        } catch (error) {

            console.log(error);

            res.status(500).json({
                error:
                    "Server Error"
            });
        }
    }
);

// ===============================
// Search villages
// ===============================
router.get(
    "/search",
    async (req, res) => {

        const {
            village
        } = req.query;

        try {

            const result =
                await pool.query(
                    `
                    SELECT *
                    FROM village
                    WHERE village_name
                    ILIKE $1
                    LIMIT 50
                    `,
                    [`%${village}%`]
                );

            res.json(
                result.rows
            );

        } catch (error) {

            console.log(error);

            res.status(500).json({
                error:
                    "Server Error"
            });
        }
    }
);
// ===============================
// Dashboard Stats
// ===============================
router.get("/stats", async (req, res) => {

    try {

        const states =
            await pool.query(
                "SELECT COUNT(*) FROM state"
            );

        const districts =
            await pool.query(
                "SELECT COUNT(*) FROM district"
            );

        const subdistricts =
            await pool.query(
                "SELECT COUNT(*) FROM subdistrict"
            );

        const villages =
            await pool.query(
                "SELECT COUNT(*) FROM village"
            );

        res.json({
            totalStates:
                states.rows[0].count,

            totalDistricts:
                districts.rows[0].count,

            totalSubDistricts:
                subdistricts.rows[0].count,

            totalVillages:
                villages.rows[0].count
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error:
                "Server Error"
        });
    }
});

module.exports = router;