import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/nav";
import ItemList from "./components/itemList";
import ItemDetail from "./components/itemDetail";
import ItemUpdate from "./components/itemUpdate";
import ItemUpload from "./components/itemUpload";
import CategoryPage from "./components/categoryPage";
import ServerStatusIndicator from "./components/ServerStatusIndicator";

// Import keep-alive service
import keepAliveService from "./services/keepAliveService";

function App() {
  // Start keep-alive service when app loads
  useEffect(() => {
    // Start the keep-alive service
    keepAliveService.start();

    // Cleanup function to stop service when component unmounts
    return () => {
      keepAliveService.stop();
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen">
        {/* Navbar appears on all pages */}
        <Navbar />

        <main id="main-content">
          <Routes>
            <Route path="/" element={<ItemList />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/item/update/:id" element={<ItemUpdate />} />
            <Route path="/upload" element={<ItemUpload />} />
            <Route path="/category/:category" element={<CategoryPage />} />
          </Routes>
        </main>

        {/* Server Status Indicator for development/monitoring */}
        <ServerStatusIndicator />
      </div>
    </Router>
  );
}

export default App;
