import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://blue-wave-plumbing.onrender.com/api/items";

// ------------------ Pagination Component ------------------
function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const pagesArr = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <div className="flex justify-center gap-2 mt-6">
      {pagesArr.map(p => (
        <button key={p} onClick={() => onChange(p)} className={`px-3 py-1 rounded ${p === page ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
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
      setPages(res.data.pages);
    } catch {
      console.error("Failed to load items");
    }
  };

  useEffect(() => { fetchItems(); }, [search, category, page]);

  return (
    <div className="p-6 md:flex gap-6">
      {/* Sidebar */}
      <aside className="w-64 border rounded p-4 mb-6 md:mb-0">
        <h2 className="font-bold mb-2 text-lg">Categories</h2>
        <ul className="space-y-1">
          <li><button onClick={() => { setCategory(""); setPage(1); }} className="hover:underline">All</button></li>
          {categories.map(c => (
            <li key={c}>
              <button onClick={() => { setCategory(c); setPage(1); }} className="hover:underline">{c}</button>
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
            className="w-full border p-2 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(item => (
            <Link key={item._id} to={`/items/${item._id}`} className="border rounded-xl shadow-md p-4 bg-white hover:shadow-lg">
              {item.images[0] && <img src={item.images[0]} alt={item.name} className="w-full h-48 object-cover rounded-lg mb-2" />}
              <h2 className="text-xl font-bold">{item.name}</h2>
              <p className="text-gray-600">{item.category}</p>
              <p className="text-blue-600 font-semibold">${item.price}</p>
            </Link>
          ))}
        </div>

        <Pagination page={page} pages={pages} onChange={setPage} />
      </div>

      {/* Floating Buttons */}
      <Link to="/create" className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg">+ Add Item</Link>
      <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 left-6 bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center text-2xl">💬</a>
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

  const handleDelete = async () => { await axios.delete(`${API_URL}/${id}`); navigate("/"); };

  if (!item) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        {item.images.map((img, i) => <img key={i} src={img} alt={item.name} className="w-full h-64 object-cover rounded-lg" />)}
      </div>
      <div>
        <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
        <p className="text-gray-600 mb-2">{item.category}</p>
        <p className="text-blue-600 font-semibold mb-4">${item.price}</p>
        <p className="mb-4">{item.description}</p>
        <p className="text-sm text-gray-500 mb-4">Pieces available: {item.piecesAvailable}</p>
        <div className="flex gap-2">
          <Link to={`/update/${item._id}`} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</Link>
          <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ------------------ Item Form (Create & Update) ------------------
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
        <input type="text" placeholder="Item Name" className="w-full border p-2 rounded" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <textarea placeholder="Description" className="w-full border p-2 rounded" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input type="number" placeholder="Price" className="w-full border p-2 rounded" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
        <input type="text" placeholder="Category" className="w-full border p-2 rounded" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        <input type="number" placeholder="Pieces Available" className="w-full border p-2 rounded" value={form.piecesAvailable} onChange={e => setForm({ ...form, piecesAvailable: e.target.value })} />
        <input type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} className="w-full" />
        <button type="submit" className={`px-4 py-2 rounded ${mode==="create"?"bg-blue-600":"bg-yellow-500"} text-white`}>{mode==="create"?"Create":"Update"}</button>
      </form>
    </div>
  );
}

// ------------------ App Router ------------------
function App() {
  return (
    <Router>
      <nav className="bg-blue-600 text-white p-4 font-bold text-xl">Bluewave Store</nav>
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

