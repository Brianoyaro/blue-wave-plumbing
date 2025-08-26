import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import components
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import ItemDetail from "./components/itemDetail";
import ItemList from "./components/itemList";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<ItemList />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/item/:id" element={<ItemDetail />} />
          </Routes>   
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
