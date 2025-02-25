

// import { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import { Line } from "react-chartjs-2";
// import "chart.js/auto";
// import { FixedSizeList as List } from "react-window";
// const cache = {};

// export default function App() {
//   const [indices, setIndices] = useState([]);
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const [chartData, setChartData] = useState(null);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     setError(null);

//     axios
//       .get(`http://localhost:5000/indices?page=${page}&limit=50`)
//       .then((res) => {
//         setIndices((prev) => [...prev, ...res.data]);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch indices:", err.message);
//         setError("Failed to load indices.");
//         setLoading(false);
//       });
//   }, [page]);

//   const fetchIndexData = useCallback((name) => {
//     if (cache[name]) {
//       setSelectedIndex(cache[name]);
//       setChartData(createChartData(cache[name]));
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     axios
//       .get(`http://localhost:5000/index/${name}`)
//       .then((res) => {
//         cache[name] = res.data;
//         setSelectedIndex(res.data);
//         setChartData(createChartData(res.data));
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch index data:", err.message);
//         setError("Failed to load index data.");
//         setLoading(false);
//       });
//   }, []);

//   const createChartData = (data) => {
//     const gradientConfig = {
//       id: 'chartGradient',
//       beforeRender: (chart) => {
//         const ctx = chart.canvas.getContext('2d');
//         const gradient = ctx.createLinearGradient(0, 0, 0, 400);
//         gradient.addColorStop(0, 'rgba(75, 192, 192, 0.8)');
//         gradient.addColorStop(1, 'rgba(75, 192, 192, 0.1)');
        
//         // Apply to chart
//         chart.data.datasets[0].backgroundColor = gradient;
//       }
//     };
    
//     return {
//       labels: ["Open", "High", "Low", "Close"],
//       datasets: [
//         {
//           label: `${data.index_name || 'Unknown'} Values`,
//           data: [
//             data.open_index_value !== null ? data.open_index_value : 0,
//             data.high_index_value !== null ? data.high_index_value : 0,
//             data.low_index_value !== null ? data.low_index_value : 0,
//             data.closing_index_value !== null ? data.closing_index_value : 0
//           ],
//           borderColor: "rgba(75, 192, 192, 1)",
//           borderWidth: 3,
//           pointBackgroundColor: "rgba(75, 192, 192, 1)",
//           pointBorderColor: "#fff",
//           pointHoverBackgroundColor: "#fff",
//           pointHoverBorderColor: "rgba(75, 192, 192, 1)",
//           pointRadius: 6,
//           pointHoverRadius: 8,
//           tension: 0.4,
//           fill: true,
//           backgroundColor: "rgba(75, 192, 192, 0.2)",
//           plugins: [gradientConfig]
//         },
//       ],
//     };
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         labels: {
//           font: {
//             family: "'Poppins', sans-serif",
//             size: 14
//           }
//         }
//       },
//       tooltip: {
//         backgroundColor: 'rgba(0, 0, 0, 0.8)',
//         titleFont: {
//           family: "'Poppins', sans-serif",
//           size: 16,
//           weight: 'bold'
//         },
//         bodyFont: {
//           family: "'Poppins', sans-serif",
//           size: 14
//         },
//         padding: 12,
//         cornerRadius: 6,
//         displayColors: false
//       }
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false
//         },
//         ticks: {
//           font: {
//             family: "'Poppins', sans-serif",
//             size: 12
//           }
//         }
//       },
//       y: {
//         grid: {
//           color: 'rgba(200, 200, 200, 0.2)',
//           borderDash: [5, 5]
//         },
//         ticks: {
//           font: {
//             family: "'Poppins', sans-serif",
//             size: 12
//           },
//           callback: function(value) {
//             return '$' + value.toLocaleString();
//           }
//         }
//       }
//     }
//   };

//   const formatValue = (value) => {
//     if (value === null || value === undefined) {
//       return "null";
//     }
//     return value.toLocaleString();
//   };

//   const getValueClass = (value1, value2) => {
//     if (value1 === null || value2 === null) return "";
//     return value1 > value2 ? 'positive' : value1 < value2 ? 'negative' : '';
//   };

//   return (
//     <div className="dashboard-container">
//       <div className="sidebar">
//         <div className="sidebar-header">
//           <h2>Market Indices</h2>
//         </div>
        
//         <div className="indices-container">
//           <List
//             height={600}
//             width={250}
//             itemSize={50}
//             itemCount={indices.length}
//             className="indices-list"
//           >
//             {({ index, style }) => (
//               <div
//                 className={`index-item ${selectedIndex && indices[index] === selectedIndex.index_name ? 'selected' : ''}`}
//                 style={style}
//                 onClick={() => fetchIndexData(indices[index])}
//               >
//                 {indices[index]}
//               </div>
//             )}
//           </List>
//         </div>
        
//         <div className="sidebar-footer">
//           {loading && <div className="loading-indicator"><div className="spinner"></div> Loading...</div>}
//           {error && <div className="error-message">{error}</div>}
//           <button className="load-more-btn" onClick={() => setPage((prev) => prev + 1)}>
//             Load More
//           </button>
//         </div>
//       </div>

//       <div className="main-content">
//         {selectedIndex ? (
//           <>
//             <div className="chart-header">
//               <h1>{selectedIndex.index_name || "Unknown Index"}</h1>
//               <div className="chart-meta">
//                 <div className="meta-item">
//                   <span className="label">Date:</span>
//                   <span className="value">{new Date().toLocaleDateString()}</span>
//                 </div>
//                 <div className="meta-item">
//                   <span className="label">Close:</span>
//                   <span className={`value ${getValueClass(
//                     selectedIndex.closing_index_value, 
//                     selectedIndex.open_index_value
//                   )}`}>
//                     {selectedIndex.closing_index_value !== null ? (
//                       <>
//                         ${formatValue(selectedIndex.closing_index_value)}
//                         {selectedIndex.open_index_value !== null && (
//                           <span className="change-indicator">
//                             {selectedIndex.closing_index_value > selectedIndex.open_index_value ? '↑' : 
//                              selectedIndex.closing_index_value < selectedIndex.open_index_value ? '↓' : ''}
//                           </span>
//                         )}
//                       </>
//                     ) : (
//                       "null"
//                     )}
//                   </span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="chart-container">
//               {chartData && <Line data={chartData} options={chartOptions} />}
//             </div>
            
//             <div className="index-details">
//               <div className="detail-card">
//                 <h3>Open</h3>
//                 <p>{selectedIndex.open_index_value !== null ? `$${formatValue(selectedIndex.open_index_value)}` : "null"}</p>
//               </div>
//               <div className="detail-card">
//                 <h3>High</h3>
//                 <p>{selectedIndex.high_index_value !== null ? `$${formatValue(selectedIndex.high_index_value)}` : "null"}</p>
//               </div>
//               <div className="detail-card">
//                 <h3>Low</h3>
//                 <p>{selectedIndex.low_index_value !== null ? `$${formatValue(selectedIndex.low_index_value)}` : "null"}</p>
//               </div>
//               <div className="detail-card">
//                 <h3>Close</h3>
//                 <p>{selectedIndex.closing_index_value !== null ? `$${formatValue(selectedIndex.closing_index_value)}` : "null"}</p>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="empty-state">
//             <h2>Select an index to view data</h2>
//             <p>Choose from the list on the left to display market information</p>
//           </div>
//         )}
//       </div>
      
//       <style jsx global>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//         }
        
//         body {
//           font-family: 'Poppins', sans-serif;
//           background-color: #f8fafc;
//           color: #334155;
//         }
        
//         .dashboard-container {
//           display: flex;
//           height: 100vh;
//           background-color: #f8fafc;
//           overflow: hidden;
//         }
        
//         /* Sidebar Styles */
//         .sidebar {
//           width: 280px;
//           background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
//           color: #f8fafc;
//           display: flex;
//           flex-direction: column;
//           box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
//           z-index: 10;
//         }
        
//         .sidebar-header {
//           padding: 24px 20px;
//           border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//         }
        
//         .sidebar-header h2 {
//           font-size: 20px;
//           font-weight: 600;
//           letter-spacing: 0.5px;
//         }
        
//         .indices-container {
//           flex-grow: 1;
//           overflow: hidden;
//         }
        
//         .indices-list {
//           scrollbar-width: thin;
//           scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
//         }
        
//         .indices-list::-webkit-scrollbar {
//           width: 6px;
//         }
        
//         .indices-list::-webkit-scrollbar-track {
//           background: transparent;
//         }
        
//         .indices-list::-webkit-scrollbar-thumb {
//           background-color: rgba(255, 255, 255, 0.3);
//           border-radius: 3px;
//         }
        
//         .index-item {
//           cursor: pointer;
//           padding: 15px 20px;
//           font-size: 14px;
//           font-weight: 500;
//           border-bottom: 1px solid rgba(255, 255, 255, 0.05);
//           transition: all 0.2s ease;
//           display: flex;
//           align-items: center;
//         }
        
//         .index-item:hover {
//           background: rgba(255, 255, 255, 0.1);
//           padding-left: 24px;
//         }
        
//         .index-item.selected {
//           background: linear-gradient(90deg, rgba(14, 165, 233, 0.2), transparent);
//           border-left: 4px solid #0ea5e9;
//           padding-left: 16px;
//         }
        
//         .sidebar-footer {
//           padding: 20px;
//           border-top: 1px solid rgba(255, 255, 255, 0.1);
//         }
        
//         .load-more-btn {
//           width: 100%;
//           padding: 12px;
//           background: linear-gradient(90deg, #0ea5e9, #38bdf8);
//           color: white;
//           border: none;
//           border-radius: 6px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           font-family: 'Poppins', sans-serif;
//           font-size: 14px;
//           box-shadow: 0 4px 6px rgba(14, 165, 233, 0.2);
//         }
        
//         .load-more-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 6px 12px rgba(14, 165, 233, 0.3);
//         }
        
//         .load-more-btn:active {
//           transform: translateY(1px);
//         }
        
//         .loading-indicator {
//           display: flex;
//           align-items: center;
//           margin-bottom: 15px;
//           font-size: 14px;
//           color: rgba(255, 255, 255, 0.7);
//         }
        
//         .spinner {
//           height: 20px;
//           width: 20px;
//           margin-right: 10px;
//           border: 3px solid rgba(255, 255, 255, 0.3);
//           border-radius: 50%;
//           border-top-color: #0ea5e9;
//           animation: spin 1s linear infinite;
//         }
        
//         @keyframes spin {
//           to {
//             transform: rotate(360deg);
//           }
//         }
        
//         .error-message {
//           color: #ef4444;
//           margin-bottom: 15px;
//           padding: 10px;
//           background: rgba(239, 68, 68, 0.1);
//           border-radius: 4px;
//           font-size: 14px;
//         }
        
//         /* Main Content Styles */
//         .main-content {
//           flex-grow: 1;
//           padding: 30px;
//           overflow: auto;
//           background: white;
//         }
        
//         .chart-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 30px;
//           padding-bottom: 15px;
//           border-bottom: 1px solid #e2e8f0;
//         }
        
//         .chart-header h1 {
//           font-size: 28px;
//           font-weight: 700;
//           color: #0f172a;
//         }
        
//         .chart-meta {
//           display: flex;
//           gap: 24px;
//         }
        
//         .meta-item {
//           display: flex;
//           flex-direction: column;
//         }
        
//         .meta-item .label {
//           font-size: 12px;
//           color: #64748b;
//           margin-bottom: 4px;
//         }
        
//         .meta-item .value {
//           font-size: 16px;
//           font-weight: 600;
//         }
        
//         .positive {
//           color: #10b981;
//         }
        
//         .negative {
//           color: #ef4444;
//         }
        
//         .change-indicator {
//           margin-left: 5px;
//         }
        
//         .chart-container {
//           height: 400px;
//           margin-bottom: 30px;
//           background: white;
//           padding: 20px;
//           border-radius: 12px;
//           box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
//         }
        
//         .index-details {
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           gap: 20px;
//         }
        
//         .detail-card {
//           background: white;
//           padding: 20px;
//           border-radius: 10px;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           text-align: center;
//           transition: all 0.2s ease;
//         }
        
//         .detail-card:hover {
//           transform: translateY(-5px);
//           box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
//         }
        
//         .detail-card:nth-child(1) {
//           background: linear-gradient(135deg, #ebf5ff 0%, #fff 100%);
//         }
        
//         .detail-card:nth-child(2) {
//           background: linear-gradient(135deg, #e6fffa 0%, #fff 100%);
//         }
        
//         .detail-card:nth-child(3) {
//           background: linear-gradient(135deg, #fff7ed 0%, #fff 100%);
//         }
        
//         .detail-card:nth-child(4) {
//           background: linear-gradient(135deg, #fef2f2 0%, #fff 100%);
//         }
        
//         .detail-card h3 {
//           font-size: 16px;
//           font-weight: 500;
//           color: #64748b;
//           margin-bottom: 10px;
//         }
        
//         .detail-card p {
//           font-size: 20px;
//           font-weight: 700;
//           color: #0f172a;
//         }
        
//         .empty-state {
//           height: 100%;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           text-align: center;
//           color: #94a3b8;
//         }
        
//         .empty-state h2 {
//           font-size: 24px;
//           margin-bottom: 10px;
//         }
        
//         .empty-state p {
//           font-size: 16px;
//         }
//       `}</style>
//     </div>
//   );
// }


import { useEffect, useState, useCallback } from "react";
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

  const fetchIndexData = useCallback((name) => {
    if (cache[name]) {
      setSelectedIndex(cache[name]);
      setChartData(createChartData(cache[name]));
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
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Market Indices</h2>
        </div>
        
        <div className="indices-container">
          <List
            height={600}
            width={250}
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
          <button className="load-more-btn" onClick={() => setPage((prev) => prev + 1)}>
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