# Stock Market Index Tracker

This project is a full-stack application that allows users to track and visualize stock market indices. It consists of a backend server built with Node.js and Express, a SQLite database for storing stock data, and a frontend built with React and Chart.js for data visualization.

## Features

- **Backend (Node.js + Express)**:
  - REST API to fetch stock indices and their details.
  - Pagination support for fetching indices.
  - SQLite database for storing stock data.
  - Efficient batch insertion of CSV data into the database.

- **Frontend (React)**:
  - Responsive design with a collapsible sidebar for mobile devices.
  - Interactive line charts using Chart.js to visualize stock data.
  - Infinite scrolling to load more indices.
  - Caching of fetched data to improve performance.
  - Error handling and loading states for a smooth user experience.

## Prerequisites

Before running the project, ensure you have the following installed:

- Node.js (v16 or higher)
- npm (v7 or higher)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AdityaKumar2408/Assignment.git
   cd Assignment
   ```

2. **Install dependencies**:
   - For the server:
     ```bash
     cd server
     npm install
     ```
   - For the client:
     ```bash
     cd ../client
     npm install
     ```

3. **Set up the database**:
   - Place your `dump.csv` file in the `server` directory.
   - Run the `create-db.js` script to create and populate the database:
     ```bash
     cd ../server
     node create-db.js
     ```

4. **Configure environment variables**:
   - Create a `.env` file in the `client` directory and add the following:
     ```env
     VITE_BACKEND_URL=http://localhost:5000
     ```

## Running the Application

1. **Start the server**:
   ```bash
   cd server
   node server.js
   ```

2. **Start the client**:
   ```bash
   cd ../client
   npm run dev
   ```

3. **Access the application**:
   Open your browser and navigate to `http://localhost:5173`.

## Project Structure

- **`server/`**:
  - `create-db.js`: Script to create and populate the SQLite database.
  - `server.js`: Backend server with REST API endpoints.
  - `stock-data.db`: SQLite database file (generated after running `create-db.js`).

- **`client/`**:
  - `src/App.jsx`: Main React component for the frontend.
  - `src/App.css`: Styles for the application.
  - `public/`: Static assets.

## API Endpoints

- **GET `/indices`**:
  - Fetches a paginated list of stock indices.
  - Query Parameters:
    - `page`: Page number (default: 1).
    - `limit`: Number of items per page (default: 50).

- **GET `/index/:name`**:
  - Fetches details of a specific stock index by its name.

## Frontend Features

- **Sidebar**:
  - Displays a list of stock indices.
  - Supports infinite scrolling to load more indices.
  - Collapsible for mobile devices.

- **Chart**:
  - Interactive line chart showing open, high, low, and close values.
  - Gradient background for better visualization.

- **Details Section**:
  - Displays key metrics like open, high, low, and close values.
  - Highlights positive/negative changes in values.

## Technologies Used

- **Backend**:
  - Node.js
  - Express
  - SQLite3

- **Frontend**:
  - React
  - Chart.js
  - React-Window (for efficient rendering of large lists)

- **Styling**:
  - CSS (with responsive design)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

Enjoy tracking stock market indices! 📈
