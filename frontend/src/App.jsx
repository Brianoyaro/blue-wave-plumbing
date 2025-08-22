import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://blue-wave-plumbing.onrender.com/api/items";

// ------------------ Pagination Component ------------------
function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const pagesArr = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <div className="flex justify-center gap-2 mt-6 flex-wrap">
      {pagesArr.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1 rounded-md transition ${
            p === page ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

// ------------------ Item List ------------------
function ItemList() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchItems = async () => {
    try {
      const res = await axios.get(API_URL, { params: { search, category, page } });
      setItems(res.data.items);
      setCategories(res.data.categories);
      setPages(res.data.pages || 1);
    } catch {
      console.error("Failed to load items");
    }
  };

  useEffect(() => { fetchItems(); }, [search, category, page]);

  return (
    <div className="p-4 md:flex gap-6 max-w-7xl mx-auto">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border rounded-md p-4 mb-6 md:mb-0 bg-white shadow-sm">
        <h2 className="font-bold mb-3 text-lg">Categories</h2>
        <ul className="space-y-2">
          <li>
            <button onClick={() => { setCategory(""); setPage(1); }} className="hover:underline w-full text-left">All</button>
          </li>
          {categories.map(c => (
            <li key={c}>
              <button onClick={() => { setCategory(c); setPage(1); }} className="hover:underline w-full text-left">{c}</button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Items */}
      <div className="flex-1">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map(item => (
            <Link key={item._id} to={`/items/${item._id}`} className="border rounded-xl shadow hover:shadow-lg transition overflow-hidden bg-white">
              {item.images[0] && <img src={item.images[0]} alt={item.name} className="w-full h-48 object-cover transition-transform hover:scale-105" />}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-1">{item.name}</h2>
                <p className="text-gray-500 mb-2">{item.category}</p>
                <p className="text-blue-600 font-bold text-lg">${item.price}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <Pagination page={page} pages={pages} onChange={setPage} />
      </div>

      {/* Floating Buttons */}
      <Link
        to="/create"
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        + Add Item
      </Link>
      <a
        href="https://wa.me/254700000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-green-600 transition"
      >
        💬
      </a>
    </div>
  );
}

// ------------------ Item Detail ------------------
function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/${id}`).then(res => setItem(res.data)).catch(console.error);
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      navigate("/");
    } catch {
      console.error("Delete failed");
    }
  };

  if (!item) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        {item.images.map((img, i) => <img key={i} src={img} alt={item.name} className="w-full h-64 object-cover rounded-lg shadow" />)}
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
        <p className="text-gray-600 mb-2">{item.category}</p>
        <p className="text-blue-600 font-semibold text-xl mb-4">${item.price}</p>
        <p className="mb-4">{item.description}</p>
        <p className="text-gray-500 mb-4">Pieces available: {item.piecesAvailable}</p>
        <div className="flex gap-3 flex-wrap">
          <Link to={`/update/${item._id}`} className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-md transition">Edit</Link>
          <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ------------------ Item Form ------------------
function ItemForm({ mode = "create" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", piecesAvailable: "" });
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (mode === "update") {
      axios.get(`${API_URL}/${id}`).then(res => setForm(res.data)).catch(console.error);
    }
  }, [id, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    for (let i = 0; i < images.length; i++) formData.append("images", images[i]);

    try {
      if (mode === "create") await axios.post(API_URL, formData, { headers: { "Content-Type": "multipart/form-data" } });
      else await axios.put(`${API_URL}/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      setMessage({ type: "success", text: mode === "create" ? "Created!" : "Updated!" });
      setTimeout(() => navigate(mode === "create" ? "/" : `/items/${id}`), 1500);
    } catch {
      setMessage({ type: "error", text: "Operation failed" });
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">{mode === "create" ? "Add New Item" : "Update Item"}</h1>
      {message && <div className={`p-3 mb-4 rounded ${message.type==="success"?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>{message.text}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Item Name" className="w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <textarea placeholder="Description" className="w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input type="number" placeholder="Price" className="w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
        <input type="text" placeholder="Category" className="w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        <input type="number" placeholder="Pieces Available" className="w-full border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.piecesAvailable} onChange={e => setForm({ ...form, piecesAvailable: e.target.value })} />
        <input type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} className="w-full" />
        <button type="submit" className={`px-5 py-3 rounded-md text-white ${mode==="create"?"bg-blue-600 hover:bg-blue-700":"bg-yellow-500 hover:bg-yellow-600"} transition`}>{mode==="create"?"Create":"Update"}</button>
      </form>
    </div>
  );
}

// ------------------ Navigation Bar ------------------
function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex flex-wrap justify-between items-center shadow-md">
      <Link to="/" className="font-bold text-xl hover:underline">Bluewave Store</Link>
      <div className="flex gap-4 mt-2 md:mt-0">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/create" className="hover:underline">Add Item</Link>
      </div>
    </nav>
  );
}

// ------------------ App Router ------------------
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ItemList />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/create" element={<ItemForm mode="create" />} />
        <Route path="/update/:id" element={<ItemForm mode="update" />} />
      </Routes>
    </Router>
  );
}

export default App;

