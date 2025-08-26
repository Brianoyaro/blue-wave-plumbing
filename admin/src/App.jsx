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
