import React, { useState, useEffect } from "react";
import axios from "axios";

function VillageTable() {
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/all-villages")
      .then((response) => {
        console.log(response.data);
        setVillages(response.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Village Master Table</h2>

      <div
        style={{
          overflowX: "auto",
        }}
      >
        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th>Village Code</th>
              <th>Village Name</th>
              <th>SubDistrict</th>
              <th>District</th>
              <th>State</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(villages) &&
              villages.map((village, index) => (
                <tr key={index}>
                  <td>{village.village_code}</td>
                  <td>{village.village_name}</td>
                  <td>{village.subdistrict_name}</td>
                  <td>{village.district_name}</td>
                  <td>{village.state_name}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VillageTable;