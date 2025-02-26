import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import io from "socket.io-client";
import axios from "axios";
import './Dashboard.css';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,  
  LinearScale,    
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const socket = io("http://127.0.0.1:5000/api");

const Dashboard = ({
  setDashboard,
  dashboard,
  setIsDashboard,
  setIsSearchFilter,
  setIsScraped,
  setScrapeTypeBtn,
  setMainScrape,
  setIsScrapeData,
}) => {
  const [progress, setProgress] = useState(0);
  const [logMessages, setLogMessages] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    socket.on("/usage", (data) => {
      setProgress(data.progress);
      setLogMessages((prevLogs) => [...prevLogs, data.message]);
    });

    axios
      .get("http://127.0.0.1:5000/api/summary")
      .then((response) => setSummary(response.data))
      .catch((error) => console.error("Error fetching summary:", error));

    axios
      .get("http://127.0.0.1:5000/api/analytics")
      .then((response) => {
        setChartData({
          labels: response.data.labels,
          datasets: [
            {
              label: "Profiles by Location",
              data: response.data.values,
              backgroundColor: ["#4caf50", "#2196f3", "#ff9800", "#e91e63"],
            },
          ],
        });
      })
      .catch((error) => console.error("Error fetching analytics:", error));

    return () => socket.off("scraping-update");
  }, []);

  return (
    <>
      {dashboard ? (
        <div className="dashboard-container">
          <h1 className="dashboard-title">Dashboard</h1>

          <div className="progress-section">
            <h2 className="section-title">Scraping Progress</h2>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-text">{progress}% completed</p>
          </div>

          <div className="logs-section">
            <h2 className="section-title">Logs</h2>
            <div className="logs-container">
              {logMessages.map((log, index) => (
                <p key={index} className="log-message">
                  {log}
                </p>
              ))}
            </div>
          </div>

          <div className="data-insights-section">
            <h2 className="section-title">Data Insights</h2>
            {chartData ? (
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                      labels: {
                        color: "#f5f5f5",
                      },
                    },
                  },
                  scales: {
                    x: {
                      ticks: { color: "#f5f5f5" },
                    },
                    y: {
                      ticks: { color: "#f5f5f5" },
                    },
                  },
                }}
              />
            ) : (
              <p className="loading-text">Loading chart...</p>
            )}
          </div>

          <div className="summary-section">
            <h2 className="section-title">Summary Report</h2>
            <ul className="summary-list">
              <li className="summary-item">
                <strong>Total Profiles Scraped:</strong> {summary.totalProfiles || 0}
              </li>
              <li className="summary-item">
                <strong>Most Common Location:</strong> {summary.commonLocation || "N/A"}
              </li>
            </ul>
          </div>

          <button
            onClick={() => {
              setDashboard(false);
              setIsSearchFilter(true);
              setScrapeTypeBtn(true);
              setIsDashboard(true);
              setMainScrape(true);
              setIsScrapeData(true);
            }}
            className="back-button"
          >
            Back
          </button>
        </div>
      ) : null}
    </>
  );
};

export default Dashboard;









