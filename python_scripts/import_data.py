import pandas as pd
import psycopg2
import os

# ==============================
# DATABASE CONNECTION
# ==============================

conn = psycopg2.connect(
    host="localhost",
    database="capstone",
    user="postgres",
    password="sanio23",
    port="5432"
)

cursor = conn.cursor()

print("✅ Database Connected Successfully!")

# ==============================
# DATASET FOLDER PATH
# ==============================

folder_path = r"C:\Users\sanio\OneDrive\Desktop\capstone_project\backend\dataset\all-india-villages-master-list-excel (1)\dataset"

# get all spreadsheet files
files = [
    f for f in os.listdir(folder_path)
    if f.endswith((".xls", ".xlsx", ".ods"))
]

print(f"📁 Total files found: {len(files)}")

# ==============================
# INSERT COUNTRY
# ==============================

cursor.execute(
    "SELECT id FROM country WHERE name = %s",
    ("India",)
)

country = cursor.fetchone()

if country:
    country_id = country[0]
else:
    cursor.execute(
        """
        INSERT INTO country (name, code)
        VALUES (%s, %s)
        RETURNING id
        """,
        ("India", "IND")
    )

    country_id = cursor.fetchone()[0]
    conn.commit()

print("✅ Country Ready!")

# ==============================
# PROCESS ALL FILES
# ==============================

for file in files:

    current_file = os.path.join(folder_path, file)

    print(f"\n📄 Processing file: {file}")

    try:

        # READ FILE
        if current_file.endswith(".xls"):
            df = pd.read_excel(
                current_file,
                engine="xlrd"
            )

        elif current_file.endswith(".xlsx"):
            df = pd.read_excel(
                current_file,
                engine="openpyxl"
            )

        elif current_file.endswith(".ods"):
            df = pd.read_excel(
                current_file,
                engine="odf"
            )

        print(f"✅ Rows Found: {len(df)}")

        # PROCESS EACH ROW
        for _, row in df.iterrows():

            try:

                # ==================
                # VALIDATION
                # ==================

                if pd.isnull(row["STATE NAME"]):
                    continue

                if pd.isnull(row["DISTRICT NAME"]):
                    continue

                if pd.isnull(row["SUB-DISTRICT NAME"]):
                    continue

                if pd.isnull(row["Area Name"]):
                    continue

                # ==================
                # EXTRACT VALUES
                # ==================

                state_code = int(row["MDDS STC"])
                state_name = str(row["STATE NAME"])

                district_code = int(row["MDDS DTC"])
                district_name = str(row["DISTRICT NAME"])

                subdistrict_code = int(
                    row["MDDS Sub_DT"]
                )

                subdistrict_name = str(
                    row["SUB-DISTRICT NAME"]
                )

                village_code = int(row["MDDS PLCN"])
                village_name = str(row["Area Name"])

                # ==================
                # STATE
                # ==================

                cursor.execute(
                    """
                    SELECT id
                    FROM state
                    WHERE state_code=%s
                    """,
                    (state_code,)
                )

                state = cursor.fetchone()

                if state:
                    state_id = state[0]

                else:
                    cursor.execute(
                        """
                        INSERT INTO state
                        (
                            state_code,
                            state_name,
                            country_id
                        )
                        VALUES (%s,%s,%s)
                        RETURNING id
                        """,
                        (
                            state_code,
                            state_name,
                            country_id
                        )
                    )

                    state_id = cursor.fetchone()[0]
                    conn.commit()

                # ==================
                # DISTRICT
                # ==================

                cursor.execute(
                    """
                    SELECT id
                    FROM district
                    WHERE district_code=%s
                    """,
                    (district_code,)
                )

                district = cursor.fetchone()

                if district:
                    district_id = district[0]

                else:
                    cursor.execute(
                        """
                        INSERT INTO district
                        (
                            district_code,
                            district_name,
                            state_id
                        )
                        VALUES (%s,%s,%s)
                        RETURNING id
                        """,
                        (
                            district_code,
                            district_name,
                            state_id
                        )
                    )

                    district_id = cursor.fetchone()[0]
                    conn.commit()

                # ==================
                # SUBDISTRICT
                # ==================

                cursor.execute(
                    """
                    SELECT id
                    FROM subdistrict
                    WHERE subdistrict_code=%s
                    """,
                    (subdistrict_code,)
                )

                subdistrict = cursor.fetchone()

                if subdistrict:
                    subdistrict_id = subdistrict[0]

                else:
                    cursor.execute(
                        """
                        INSERT INTO subdistrict
                        (
                            subdistrict_code,
                            subdistrict_name,
                            district_id
                        )
                        VALUES (%s,%s,%s)
                        RETURNING id
                        """,
                        (
                            subdistrict_code,
                            subdistrict_name,
                            district_id
                        )
                    )

                    subdistrict_id = cursor.fetchone()[0]
                    conn.commit()

                # ==================
                # VILLAGE
                # ==================

                cursor.execute(
                    """
                    SELECT id
                    FROM village
                    WHERE village_code=%s
                    """,
                    (village_code,)
                )

                village = cursor.fetchone()

                if not village:

                    cursor.execute(
                        """
                        INSERT INTO village
                        (
                            village_code,
                            village_name,
                            subdistrict_id
                        )
                        VALUES (%s,%s,%s)
                        """,
                        (
                            village_code,
                            village_name,
                            subdistrict_id
                        )
                    )

                    conn.commit()

            except Exception as row_error:
                print(
                    f"❌ Row Error: {row_error}"
                )

    except Exception as file_error:
        print(
            f"❌ File Error in {file}: {file_error}"
        )

# ==============================
# CLOSE CONNECTION
# ==============================

cursor.close()
conn.close()

print("\n🎉 ALL INDIA DATA IMPORT COMPLETED!")