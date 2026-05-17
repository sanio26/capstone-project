router.get(
    "/villages/:subdistrictId",
    async (req, res) => {

        const { subdistrictId } = req.params;

        const page = parseInt(req.query.page) || 1;
        const limit = 50;
        const offset = (page - 1) * limit;

        try {

            const result = await pool.query(
                `
                SELECT *
                FROM village
                WHERE subdistrict_id = $1
                LIMIT $2 OFFSET $3
                `,
                [subdistrictId, limit, offset]
            );

            res.json(result.rows);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                error: "Server Error"
            });
        }
    }
);