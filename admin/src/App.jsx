import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ItemList from "./components/ItemList";
import ItemDetail from "./components/ItemDetail";
import ItemUpdate from "./components/ItemUpdate";
import ItemUpload from "./components/ItemUpload";

function App() {
  return (
    <Router>
      {/* Navbar appears on all pages */}
      <Navbar />

      <Routes>
        <Route path="/" element={<ItemList />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/item/update/:id" element={<ItemUpdate />} />
        <Route path="/upload" element={<ItemUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
