import React, { useEffect, useState } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const [selectedState, setSelectedState] =
    useState("");

  const [selectedDistrict, setSelectedDistrict] =
    useState("");

  const [
    selectedSubDistrict,
    setSelectedSubDistrict,
  ] = useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  // Fetch states
  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/states"
      );
      setStates(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch districts
  const handleStateChange = async (e) => {
    const stateId = e.target.value;

    setSelectedState(stateId);
    setDistricts([]);
    setSubDistricts([]);
    setVillages([]);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/districts/${stateId}`
      );

      setDistricts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch subdistricts
  const handleDistrictChange =
    async (e) => {
      const districtId =
        e.target.value;

      setSelectedDistrict(
        districtId
      );

      setSubDistricts([]);
      setVillages([]);

      try {
        const res = await axios.get(
          `http://localhost:5000/api/subdistricts/${districtId}`
        );

        setSubDistricts(res.data);
      } catch (error) {
        console.error(error);
      }
    };

  // Fetch villages
  const handleSubDistrictChange =
    async (e) => {
      const subDistrictId =
        e.target.value;

      setSelectedSubDistrict(
        subDistrictId
      );

      try {
        const res = await axios.get(
          `http://localhost:5000/api/villages/${subDistrictId}`
        );

        setVillages(res.data);
      } catch (error) {
        console.error(error);
      }
    };

  // Chart Data
  const analyticsData = [
    {
      name: "States",
      count: states.length,
    },
    {
      name: "Districts",
      count: districts.length,
    },
    {
      name: "SubDistricts",
      count: subDistricts.length,
    },
    {
      name: "Villages",
      count: villages.length,
    },
  ];

  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#ca8a04",
    "#dc2626",
  ];

  const filteredVillages =
    villages.filter((village) =>
      village.village_name
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
    );

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f1f5f9",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        India Village Analytics Dashboard
      </h1>

      {/* Analytics Cards */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        {[
          {
            title: "States",
            count: states.length,
            color: "#2563eb",
          },
          {
            title: "Districts",
            count: districts.length,
            color: "#16a34a",
          },
          {
            title:
              "SubDistricts",
            count:
              subDistricts.length,
            color:
              "#ca8a04",
          },
          {
            title:
              "Villages",
            count:
              villages.length,
            color:
              "#dc2626",
          },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              background:
                item.color,
              color:
                "white",
              padding:
                "20px",
              borderRadius:
                "12px",
              width:
                "220px",
              textAlign:
                "center",
            }}
          >
            <h2>{item.count}</h2>
            <p>{item.title}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <BarChart
          data={analyticsData}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>

      {/* Pie Chart */}
      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <PieChart>
          <Pie
            data={analyticsData}
            dataKey="count"
            outerRadius={100}
            label
          >
            {analyticsData.map(
              (
                entry,
                index
              ) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[index]
                  }
                />
              )
            )}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Dropdowns */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <select
          value={
            selectedState
          }
          onChange={
            handleStateChange
          }
        >
          <option value="">
            Select State
          </option>

          {states.map(
            (state) => (
              <option
                key={
                  state.id
                }
                value={
                  state.id
                }
              >
                {
                  state.state_name
                }
              </option>
            )
          )}
        </select>

        <select
          value={
            selectedDistrict
          }
          onChange={
            handleDistrictChange
          }
        >
          <option value="">
            Select District
          </option>

          {districts.map(
            (
              district
            ) => (
              <option
                key={
                  district.id
                }
                value={
                  district.id
                }
              >
                {
                  district.district_name
                }
              </option>
            )
          )}
        </select>

        <select
          value={
            selectedSubDistrict
          }
          onChange={
            handleSubDistrictChange
          }
        >
          <option value="">
            Select SubDistrict
          </option>

          {subDistricts.map(
            (sub) => (
              <option
                key={
                  sub.id
                }
                value={
                  sub.id
                }
              >
                {
                  sub.subdistrict_name
                }
              </option>
            )
          )}
        </select>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search Village..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(
            e.target.value
          )
        }
      />

      <h2>
        Villages Found:
        {" "}
        {filteredVillages.length}
      </h2>

      {/* Export CSV */}
      <CSVLink
        data={filteredVillages}
        filename="villages.csv"
        style={{
          background:
            "#16a34a",
          color: "white",
          padding:
            "10px 20px",
          textDecoration:
            "none",
          borderRadius:
            "8px",
          display:
            "inline-block",
          marginBottom:
            "20px",
        }}
      >
        Export Villages CSV
      </CSVLink>

      {/* Table */}
      <table
        border="1"
        cellPadding="10"
        width="100%"
      >
        <thead>
          <tr>
            <th>
              Village ID
            </th>
            <th>
              Village Name
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredVillages.map(
            (
              village,
              index
            ) => (
              <tr
                key={index}
              >
                <td>
                  {
                    village.id
                  }
                </td>
                <td>
                  {
                    village.village_name
                  }
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;