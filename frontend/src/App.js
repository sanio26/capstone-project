import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

function App() {

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({});

  useEffect(() => {

    axios
      .get("http://localhost:5000/api/states")
      .then((res) => {
        setStates(res.data);
      });

    axios
      .get("http://localhost:5000/api/stats")
      .then((res) => {
        setStats(res.data);
      });

  }, []);

  // Districts
  const getDistricts =
    async (stateId) => {

    const res =
      await axios.get(
        `http://localhost:5000/api/districts/${stateId}`
      );

    setDistricts(
      res.data
    );

    setSubdistricts([]);
    setVillages([]);
  };

  // Subdistricts
  const getSubdistricts =
    async (districtId) => {

    const res =
      await axios.get(
        `http://localhost:5000/api/subdistricts/${districtId}`
      );

    setSubdistricts(
      res.data
    );

    setVillages([]);
  };

  // Villages
  const getVillages =
    async (subdistrictId) => {

    const res =
      await axios.get(
        `http://localhost:5000/api/villages/${subdistrictId}`
      );

    setVillages(
      res.data
    );
  };

  // Search village
  const searchVillage =
    async () => {

    const res =
      await axios.get(
        `http://localhost:5000/api/search?village=${search}`
      );

    setVillages(
      res.data
    );
  };

  // Chart data
  const chartData = [
    {
      name: "States",
      count:
        stats.totalStates
    },
    {
      name: "Districts",
      count:
        stats.totalDistricts
    },
    {
      name:
        "SubDistricts",
      count:
        stats
        .totalSubDistricts
    },
    {
      name:
        "Villages",
      count:
        stats.totalVillages
    }
  ];

  return (

    <div className="container mt-5">

      <div className="card shadow p-4">

        <h1 className="text-center mb-4">
          🇮🇳 India Village Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="row mb-4">

          <div className="col-md-3">
            <div className="card text-center shadow-sm p-3">
              <h3>
                {stats.totalStates}
              </h3>
              <p>States</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center shadow-sm p-3">
              <h3>
                {
                  stats
                  .totalDistricts
                }
              </h3>
              <p>
                Districts
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center shadow-sm p-3">
              <h3>
                {
                  stats
                  .totalSubDistricts
                }
              </h3>
              <p>
                SubDistricts
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center shadow-sm p-3">
              <h3>
                {
                  stats
                  .totalVillages
                }
              </h3>
              <p>
                Villages
              </p>
            </div>
          </div>

        </div>

        {/* Analytics Chart */}
        <div className="mb-5">

          <h3 className="mb-3">
            Analytics Overview
          </h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={chartData}
            >

              <CartesianGrid />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="count"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* Search */}
        <div className="mb-4">

          <h4>
            Search Village
          </h4>

          <div className="d-flex gap-2">

            <input
              type="text"
              className="form-control"
              placeholder="Search village..."
              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            <button
              className="btn btn-primary"
              onClick={
                searchVillage
              }
            >
              Search
            </button>

          </div>

        </div>

        {/* Dropdowns */}
        <div className="row">

          <div className="col-md-4">

            <h5>State</h5>

            <select
              className="form-select"

              onChange={(e) =>
                getDistricts(
                  e.target.value
                )
              }
            >

              <option>
                Select State
              </option>

              {states.map(
                (state) => (

                  <option
                    key={state.id}
                    value={state.id}
                  >
                    {
                      state.state_name
                    }
                  </option>
                )
              )}

            </select>

          </div>

          <div className="col-md-4">

            <h5>District</h5>

            <select
              className="form-select"

              onChange={(e) =>
                getSubdistricts(
                  e.target.value
                )
              }
            >

              <option>
                Select District
              </option>

              {districts.map(
                (district) => (

                  <option
                    key={
                      district.id
                    }

                    value={
                      district.id
                    }
                  >
                    {
                      district
                      .district_name
                    }
                  </option>
                )
              )}

            </select>

          </div>

          <div className="col-md-4">

            <h5>
              SubDistrict
            </h5>

            <select
              className="form-select"

              onChange={(e) =>
                getVillages(
                  e.target.value
                )
              }
            >

              <option>
                Select
                SubDistrict
              </option>

              {subdistricts.map(
                (
                  subdistrict
                ) => (

                  <option
                    key={
                      subdistrict.id
                    }

                    value={
                      subdistrict.id
                    }
                  >
                    {
                      subdistrict
                        .subdistrict_name
                    }
                  </option>
                )
              )}

            </select>

          </div>

        </div>

        {/* Villages */}
        <div className="mt-5">

          <h3>
            Villages Found:
            {" "}
            {
              villages.length
            }
          </h3>

          {villages.length ===
            0 && (
            <p>
              Please select
              State,
              District,
              and
              SubDistrict
            </p>
          )}

          <div className="row">

            {villages.map(
              (village) => (

                <div
                  className="col-md-4 mb-3"

                  key={
                    village.id
                  }
                >
                  <div className="card p-3 shadow-sm village-card">

                    <h5>
                      {
                        village
                          .village_name
                      }
                    </h5>

                    <small>
                      Code:
                      {" "}
                      {village.code ||
                        village.mdds_plcn ||
                        "N/A"}
                    </small>

                  </div>
                </div>
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;