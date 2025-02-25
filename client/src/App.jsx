import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { FixedSizeList as List } from "react-window";
import "./App.css";

const cache = {};

export default function App() {
  const [indices, setIndices] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/indices?page=${page}&limit=50`)
      .then((res) => {
        setIndices((prev) => [...prev, ...res.data]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch indices:", err.message);
        setError("Failed to load indices.");
        setLoading(false);
      });
  }, [page]);

  // Handle clicks outside the sidebar to close it on mobile
  useEffect(() => {
    function handleClickOutside(event) {
      if (window.innerWidth <= 600 && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target) &&
          !event.target.classList.contains('menu-toggle')) {
        setSidebarVisible(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle window resize to manage sidebar visibility
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 600) {
        setSidebarVisible(true);
      } else {
        setSidebarVisible(false);
      }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on load
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchIndexData = useCallback((name) => {
    if (cache[name]) {
      setSelectedIndex(cache[name]);
      setChartData(createChartData(cache[name]));
      // Close sidebar on mobile after selection
      if (window.innerWidth <= 600) {
        setSidebarVisible(false);
      }
      return;
    }

    setLoading(true);
    setError(null);

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/index/${name}`)
      .then((res) => {
        cache[name] = res.data;
        setSelectedIndex(res.data);
        setChartData(createChartData(res.data));
        setLoading(false);
        // Close sidebar on mobile after selection
        if (window.innerWidth <= 600) {
          setSidebarVisible(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch index data:", err.message);
        setError("Failed to load index data.");
        setLoading(false);
      });
  }, []);

  const createChartData = (data) => {
    const gradientConfig = {
      id: 'chartGradient',
      beforeRender: (chart) => {
        const ctx = chart.canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(75, 192, 192, 0.8)');
        gradient.addColorStop(1, 'rgba(75, 192, 192, 0.1)');
        
        // Apply to chart
        chart.data.datasets[0].backgroundColor = gradient;
      }
    };
    
    return {
      labels: ["Open", "High", "Low", "Close"],
      datasets: [
        {
          label: `${data.index_name || 'Unknown'} Values`,
          data: [
            data.open_index_value !== null ? data.open_index_value : 0,
            data.high_index_value !== null ? data.high_index_value : 0,
            data.low_index_value !== null ? data.low_index_value : 0,
            data.closing_index_value !== null ? data.closing_index_value : 0
          ],
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 3,
          pointBackgroundColor: "rgba(75, 192, 192, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(75, 192, 192, 1)",
          pointRadius: 6,
          pointHoverRadius: 8,
          tension: 0.4,
          fill: true,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          plugins: [gradientConfig]
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: {
            family: "'Poppins', sans-serif",
            size: 14
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: "'Poppins', sans-serif",
          size: 16,
          weight: 'bold'
        },
        bodyFont: {
          family: "'Poppins', sans-serif",
          size: 14
        },
        padding: 12,
        cornerRadius: 6,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Poppins', sans-serif",
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
          borderDash: [5, 5]
        },
        ticks: {
          font: {
            family: "'Poppins', sans-serif",
            size: 12
          },
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return "null";
    }
    return value.toLocaleString();
  };

  const getValueClass = (value1, value2) => {
    if (value1 === null || value2 === null) return "";
    return value1 > value2 ? 'positive' : value1 < value2 ? 'negative' : '';
  };

  return (
    <div className="dashboard-container">
      {/* Mobile menu toggle button */}
      <button 
        className="menu-toggle" 
        onClick={() => setSidebarVisible(!sidebarVisible)}
      >
        {sidebarVisible ? '✕' : '☰'}
      </button>
      
      <div 
        ref={sidebarRef}
        className={`sidebar ${sidebarVisible ? 'show-sidebar' : ''}`}
      >
        <div className="sidebar-header">
          <h2>Market Indices</h2>
        </div>
        
        <div className="indices-container">
          <List
            height={window.innerWidth <= 768 ? 300 : 600}
            width={window.innerWidth <= 600 ? 250 : 280}
            itemSize={50}
            itemCount={indices.length}
            className="indices-list"
          >
            {({ index, style }) => (
              <div
                className={`index-item ${selectedIndex && indices[index] === selectedIndex.index_name ? 'selected' : ''}`}
                style={style}
                onClick={() => fetchIndexData(indices[index])}
              >
                {indices[index]}
              </div>
            )}
          </List>
        </div>
        
        <div className="sidebar-footer">
          {loading && <div className="loading-indicator"><div className="spinner"></div> Loading...</div>}
          {error && <div className="error-message">{error}</div>}
          <button 
            className="load-more-btn" 
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
          >
            Load More
          </button>
        </div>
      </div>

      <div className="main-content">
        {selectedIndex ? (
          <>
            <div className="chart-header">
              <h1>{selectedIndex.index_name || "Unknown Index"}</h1>
              <div className="chart-meta">
                <div className="meta-item">
                  <span className="label">Date:</span>
                  <span className="value">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="meta-item">
                  <span className="label">Close:</span>
                  <span className={`value ${getValueClass(
                    selectedIndex.closing_index_value, 
                    selectedIndex.open_index_value
                  )}`}>
                    {selectedIndex.closing_index_value !== null ? (
                      <>
                        ${formatValue(selectedIndex.closing_index_value)}
                        {selectedIndex.open_index_value !== null && (
                          <span className="change-indicator">
                            {selectedIndex.closing_index_value > selectedIndex.open_index_value ? '↑' : 
                             selectedIndex.closing_index_value < selectedIndex.open_index_value ? '↓' : ''}
                          </span>
                        )}
                      </>
                    ) : (
                      "null"
                    )}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="chart-container">
              {chartData && <Line data={chartData} options={chartOptions} />}
            </div>
            
            <div className="index-details">
              <div className="detail-card">
                <h3>Open</h3>
                <p>{selectedIndex.open_index_value !== null ? `$${formatValue(selectedIndex.open_index_value)}` : "null"}</p>
              </div>
              <div className="detail-card">
                <h3>High</h3>
                <p>{selectedIndex.high_index_value !== null ? `$${formatValue(selectedIndex.high_index_value)}` : "null"}</p>
              </div>
              <div className="detail-card">
                <h3>Low</h3>
                <p>{selectedIndex.low_index_value !== null ? `$${formatValue(selectedIndex.low_index_value)}` : "null"}</p>
              </div>
              <div className="detail-card">
                <h3>Close</h3>
                <p>{selectedIndex.closing_index_value !== null ? `$${formatValue(selectedIndex.closing_index_value)}` : "null"}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <h2>Select an index to view data</h2>
            <p>Choose from the list on the left to display market information</p>
          </div>
        )}
      </div>
    </div>
  );
}
