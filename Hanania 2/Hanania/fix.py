import sys

with open('frontend/src/App.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

replacement = """                                                </div>
                                            </div>
                                        </nav>
                                        );

            const EditHome = () => {
                const toggleFeature = async (id) => {
                    const target = products.find(p => p.id === id);
                    if(!target) return;
                    const newFeatured = !target.isFeatured;
                    if (newFeatured && products.filter(p => p.isFeatured).length >= 4) {
                        alert("Maksimal hanya 4 produk yang bisa ditampilkan di Beranda!");
                        return;
                    }
                    try {
                        const res = await fetch(`http://localhost:8000/api/products/${id}/featured`, {
                            method: 'PUT',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({isFeatured: newFeatured})
                        });
                        if(res.ok) {
                            setProducts(products.map(p => p.id === id ? {...p, isFeatured: newFeatured} : p));
                        }
                    } catch(e) { console.error(e); }
                };

                                        return (
                                        <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in">
                                            <div className="mb-8">
                                                <h2 className="text-2xl md:text-3xl font-serif text-hanania-admintxt font-bold">Pengaturan Beranda</h2>
                                                <p className="text-gray-500 text-xs md:text-sm font-medium mt-1">Pilih maksimal 4 produk untuk ditampilkan di bagian "Koleksi Terfavorit" pada halaman beranda web.</p>
                                            </div>

                                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                                <table className="w-full text-left border-collapse min-w-[600px]">
                                                    <thead>
                                                        <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-500 uppercase tracking-widest">
                                                            <th className="p-4 font-bold w-20 text-center">Tampil</th>
                                                            <th className="p-4 font-bold">Produk</th>
                                                            <th className="p-4 font-bold">Kategori</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="text-sm">
                                                        {products.map(p => (
                                                            <tr key={p.id} className={`border-b border-gray-100 transition-colors ${p.isFeatured ? 'bg-hanania-lightpink/30' : 'hover:bg-gray-50'}`}>
                                                                <td className="p-4 text-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={p.isFeatured || false}
                                                                        onChange={() => toggleFeature(p.id)}
                                                                        className="w-5 h-5 accent-hanania-pink cursor-pointer"
                                                                    />
                                                                </td>
                                                                <td className="p-4 flex items-center gap-4">
                                                                    <img src={p.image} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                                                                    <span className={`font-bold ${p.isFeatured ? 'text-hanania-pink' : 'text-gray-800'}`}>{p.name}</span>
                                                                </td>
                                                                <td className="p-4 text-gray-600 font-medium">{p.category}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            {/* Toggle Featured Reviews */}
                                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
                                                <div className="flex justify-between items-center mb-6">
                                                    <div>
                                                        <h2 className="font-bold text-gray-800 uppercase tracking-wider text-sm mb-1">Ulasan Ditampilkan</h2>
                                                        <p className="text-xs text-gray-500">Pilih maksimal 3 ulasan terbaik untuk ditampilkan di Beranda.</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {(reviews || []).map(r => (
                                                        <div key={r.id} className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex justify-between items-center ${r.isFeatured ? 'border-hanania-pink bg-hanania-lightpink/30' : 'border-gray-100 hover:border-gray-200'}`} onClick={() => {
                                                            fetch(`http://localhost:8000/api/reviews/${r.id}/featured`, {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({isFeatured: !r.isFeatured})})
                                                            .then(res => { if(res.ok) setReviews(reviews.map(rev => rev.id === r.id ? {...rev, isFeatured: !rev.isFeatured} : rev)); })
                                                            .catch(e => console.error(e));
                                                        }}>
                                                            <div>
                                                                <p className="font-bold text-gray-800 text-xs uppercase">{r.customer}</p>
                                                                <p className="text-xs text-gray-500 line-clamp-1 italic">"{r.text}"</p>
                                                            </div>
                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${r.isFeatured ? 'bg-hanania-pink text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                                <i className="fas fa-check text-xs"></i>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        );
            };

            const EditCatalog = () => {
                const [showForm, setShowForm] = React.useState(false);
                                        const [newName, setNewName] = React.useState("");
                                        const [newCat, setNewCat] = React.useState("Hand Bouquet");
                                        const [newPrice, setNewPrice] = React.useState("");
                                        const [newStatus, setNewStatus] = React.useState("Tersedia");
                                        const [newImg, setNewImg] = React.useState("");

                const handleSaveProduct = async () => {
                    if(!newName || !newPrice) return;
                    const newProd = {
                        name: newName, category: newCat,
                        price: parseInt(newPrice), status: newStatus, image: newImg || "https://placehold.co/800", isFeatured: false
                    };
                    try {
                        const res = await fetch('http://localhost:8000/api/products', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify(newProd)
                        });
                        if(res.ok) {
                            const createdProd = await res.json();
                            setProducts([...products, createdProd]);
                            setShowForm(false);
                            setNewName(""); setNewPrice(""); setNewImg("");
                        }
                    } catch(e) { console.error(e); }
                };

                                        return (
                                        <div className="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in">
                                            <div className="flex justify-between items-center mb-8">
                                                <div>
                                                    <h2 className="text-2xl md:text-3xl font-serif text-hanania-admintxt font-bold">Katalog Produk</h2>
                                                    <p className="text-gray-500 text-xs md:text-sm font-medium mt-1">Kelola data produk yang muncul di halaman pengguna.</p>
                                                </div>
                                                <button onClick={() => setShowForm(!showForm)} className="bg-hanania-darkgreen hover:bg-hanania-green text-white px-5 py-3 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 uppercase tracking-wider shadow-sm">
                                                    <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i> {showForm ? 'Batal' : 'Tambah Produk'}
                                                </button>
                                            </div>

                                            {showForm && (
                                                <div className="bg-white p-8 rounded-2xl border border-hanania-darkgreen/20 shadow-sm mb-8 animate-fade-in">
                                                    <h3 className="font-bold text-hanania-darkgreen mb-5 border-b border-gray-100 pb-3 uppercase tracking-wider text-sm">Informasi Produk Baru</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Nama Produk</label>
                                                            <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-hanania-darkgreen focus:outline-none bg-gray-50" placeholder="Contoh: Premium Rose Box" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Kategori</label>
                                                            <select value={newCat} onChange={e => setNewCat(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-hanania-darkgreen focus:outline-none bg-gray-50">
                                                                <option>Hand Bouquet</option><option>Flower Box</option><option>Vase Arrangement</option><option>Wedding / Event</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Harga (Rp)</label>
                                                            <input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-hanania-darkgreen focus:outline-none bg-gray-50" placeholder="Contoh: 250000" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Status</label>
                                                            <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-hanania-darkgreen focus:outline-none bg-gray-50">
                                                                <option>Tersedia</option><option>Pre-Order (PO)</option><option>Kosong</option>
                                                            </select>
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">URL Gambar</label>
                                                            <input type="text" value={newImg} onChange={e => setNewImg(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-hanania-darkgreen focus:outline-none bg-gray-50" placeholder="https://..." />
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <button onClick={handleSaveProduct} className="bg-hanania-pink hover:bg-[#b04f6d] text-white px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest shadow-sm transition-colors">Simpan Produk</button>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-left border-collapse min-w-[800px]">
                                                        <thead>
                                                            <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-500 uppercase tracking-widest">
                                                                <th className="p-4 font-bold">Produk</th>
                                                                <th className="p-4 font-bold">Kategori</th>
                                                                <th className="p-4 font-bold">Harga</th>
                                                                <th className="p-4 font-bold">Status</th>
                                                                <th className="p-4 font-bold text-right">Aksi</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-sm">
                                                            {products.map(p => (
                                                                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                                    <td className="p-4 flex items-center gap-4">
                                                                        <img src={p.image} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                                                                        <span className="font-bold text-gray-800">{p.name}</span>
                                                                    </td>
                                                                    <td className="p-4 text-gray-600 font-medium">{p.category}</td>
                                                                    <td className="p-4 text-hanania-pink font-bold">Rp {p.price.toLocaleString('id-ID')}</td>
                                                                    <td className="p-4">
                                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.status === 'Tersedia' ? 'bg-green-100 text-green-700' : p.status === 'Pre-Order (PO)' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>{p.status}</span>
                                                                    </td>
                                                                    <td className="p-4 text-right">
                                                                        <div className="flex gap-2 justify-end">
                                                                            <button className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center" onClick={async () => {
                                                                                if(confirm('Hapus produk ini?')) {
                                                                                    try {
                                                                                        const res = await fetch(`http://localhost:8000/api/products/${p.id}`, { method: 'DELETE' });
                                                                                        if(res.ok) setProducts(products.filter(prod => prod.id !== p.id));
                                                                                    } catch (e) { console.error(e); }
                                                                                }
                                                                            }}><i className="fas fa-trash text-xs"></i></button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        );
            };\n"""

# lines is 0-indexed, so line 540 is index 539
# line 894 is index 893 (inclusive) -> slice up to 894
new_lines = lines[:539] + [replacement] + lines[894:]

with open('frontend/src/App.jsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Fix applied successfully")
