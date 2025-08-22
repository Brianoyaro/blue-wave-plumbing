import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://blue-wave-plumbing.onrender.com/api/items";

// ------------------ Item List ------------------
function ItemList() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    axios
      .get(API_URL, { params: { search, category } })
      .then((res) => {
        setItems(res.data.items);
        setCategories(res.data.categories);
      })
      .catch(() => setError("Failed to load items."));
  }, [search, category]);

  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <Link
            key={item._id}
            to={`/items/${item._id}`}
            className="border rounded-xl shadow-md p-4 bg-white hover:shadow-lg"
          >
            {item.images.length > 0 && (
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
            )}
            <h2 className="text-xl font-bold">{item.name}</h2>
            <p className="text-gray-600">{item.category}</p>
            <p className="text-blue-600 font-semibold">${item.price}</p>
          </Link>
        ))}
      </div>

      {/* Floating Add Button */}
      <Link
        to="/create"
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
      >
        + Add Item
      </Link>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/254700000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
      >
        <span className="text-2xl">💬</span>
      </a>
    </div>
  );
}


// ------------------ Item Detail ------------------
function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/${id}`)
      .then((res) => setItem(res.data))
      .catch(() => setError("Failed to load item."));
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      navigate("/");
    } catch {
      setError("Failed to delete item.");
    }
  };

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!item) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Images */}
        <div className="space-y-2">
          {item.images.map((img, i) => (
            <img key={i} src={img} alt={item.name} className="w-full h-64 object-cover rounded-lg" />
          ))}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
          <p className="text-gray-600 mb-2">{item.category}</p>
          <p className="text-blue-600 font-semibold mb-4">${item.price}</p>
          <p className="mb-4">{item.description}</p>
          <p className="text-sm text-gray-500">Pieces available: {item.piecesAvailable}</p>

          <div className="mt-4">
            <Link to={`/update/${item._id}`} className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">Edit</Link>
            <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------ Item Create ------------------
function ItemCreate() {
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", piecesAvailable: "" });
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    for (let i = 0; i < images.length; i++) formData.append("images", images[i]);

    try {
      await axios.post(API_URL, formData, { headers: { "Content-Type": "multipart/form-data" } });
      setMessage({ type: "success", text: "Item created successfully!" });
      setTimeout(() => navigate("/"), 2000);
    } catch {
      setMessage({ type: "error", text: "Failed to create item." });
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Item</h1>
      {message && (
        <div className={`p-3 mb-4 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Item Name" className="w-full border p-2 rounded" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <textarea placeholder="Description" className="w-full border p-2 rounded" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input type="number" placeholder="Price" className="w-full border p-2 rounded" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input type="text" placeholder="Category" className="w-full border p-2 rounded" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input type="number" placeholder="Pieces Available" className="w-full border p-2 rounded" value={form.piecesAvailable} onChange={(e) => setForm({ ...form, piecesAvailable: e.target.value })} />
        <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
      </form>
    </div>
  );
}

// ------------------ Item Update ------------------
function ItemUpdate() {
  const { id } = useParams();
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", piecesAvailable: "" });
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/${id}`)
      .then((res) => setForm({
        name: res.data.name,
        description: res.data.description,
        price: res.data.price,
        category: res.data.category,
        piecesAvailable: res.data.piecesAvailable,
      }))
      .catch(() => setMessage({ type: "error", text: "Failed to load item." }));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    for (let i = 0; i < images.length; i++) formData.append("images", images[i]);

    try {
      await axios.put(`${API_URL}/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      setMessage({ type: "success", text: "Item updated successfully!" });
      setTimeout(() => navigate(`/items/${id}`), 2000);
    } catch {
      setMessage({ type: "error", text: "Failed to update item." });
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Item</h1>
      {message && (
        <div className={`p-3 mb-4 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Item Name" className="w-full border p-2 rounded" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <textarea placeholder="Description" className="w-full border p-2 rounded" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input type="number" placeholder="Price" className="w-full border p-2 rounded" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input type="text" placeholder="Category" className="w-full border p-2 rounded" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input type="number" placeholder="Pieces Available" className="w-full border p-2 rounded" value={form.piecesAvailable} onChange={(e) => setForm({ ...form, piecesAvailable: e.target.value })} />
        <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="w-full" />
        <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">Update</button>
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
        <Route path="/create" element={<ItemCreate />} />
        <Route path="/update/:id" element={<ItemUpdate />} />
      </Routes>
    </Router>
  );
}

export default App;

