import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import components
import About from "./components/about";
import Contact from "./components/contact";
import Footer from "./components/footer";
import Home from "./components/home";
import Navbar from "./components/nav";
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
            <Route path="/items/:id" element={<ItemDetail />} />
          </Routes>   
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
