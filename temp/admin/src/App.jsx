import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/nav";
import ItemList from "./components/itemList";
import ItemDetail from "./components/itemDetail";
import ItemUpdate from "./components/itemUpdate";
import ItemUpload from "./components/itemUpload";

function App() {
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
