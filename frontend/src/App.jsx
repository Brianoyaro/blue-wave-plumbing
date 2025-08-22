import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://blue-wave-plumbing.onrender.com/api/items/"; // backend base URL

// ------------------ Item List ------------------
function ItemList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get(API_URL).then((res) => setItems(res.data));
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item) => (
        <Link key={item._id} to={`/items/${item._id}`} className="border rounded-xl shadow-md p-4 bg-white hover:shadow-lg">
          <h2 className="text-xl font-bold mb-2">{item.name}</h2>
          {item.images.length > 0 && <img src={item.images[0]} alt={item.name} className="w-full h-48 object-cover rounded-lg" />}
        </Link>
      ))}
      <Link to="/create" className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg">+ Add Item</Link>
    </div>
  );
}

// ------------------ Item Detail ------------------
function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/${id}`).then((res) => setItem(res.data));
  }, [id]);

  const handleDelete = async () => {
    await axios.delete(`${API_URL}/${id}`);
    navigate("/");
  };

  if (!item) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
      <p className="mb-4">{item.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {item.images.map((img, i) => (
          <img key={i} src={img} alt={item.name} className="w-full h-48 object-cover rounded-lg" />
        ))}
      </div>
      <Link to={`/update/${item._id}`} className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">Edit</Link>
      <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
    </div>
  );
}

// ------------------ Item Create ------------------
function ItemCreate() {
  const [form, setForm] = useState({ name: "", description: "" });
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }
    await axios.post(API_URL, formData, { headers: { "Content-Type": "multipart/form-data" } });
    setTimeout(() => {
      navigate("/")
    }, 3000);
    //navigate("/");
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Item Name" className="w-full border p-2 rounded" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <textarea placeholder="Description" className="w-full border p-2 rounded" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
      </form>
    </div>
  );
}

// ------------------ Item Update ------------------
function ItemUpdate() {
  const { id } = useParams();
  const [form, setForm] = useState({ name: "", description: "" });
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/${id}`).then((res) => setForm({ name: res.data.name, description: res.data.description }));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }
    await axios.put(`${API_URL}/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
    navigate(`/items/${id}`);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Item Name" className="w-full border p-2 rounded" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <textarea placeholder="Description" className="w-full border p-2 rounded" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
      <nav className="bg-blue-600 text-white p-4 font-bold text-xl">Bluewave</nav>
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

