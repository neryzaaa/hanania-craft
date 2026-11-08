import React, { useState, useEffect } from 'react';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
    : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:8000' : '');

const getStorage = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        if (!item) return fallback;
        const parsed = JSON.parse(item);
        if (Array.isArray(fallback) && (!Array.isArray(parsed) || parsed.length === 0)) {
            return fallback;
        }
        return parsed;
    } catch (e) {
        return fallback;
    }
};

const setStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn("Could not save to localStorage", e);
    }
};

const initialProducts = [
    { id: 1, name: "Peony & Rose Blush Harmony", category: "Hand Bouquet", price: 375000, image: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", status: "Tersedia", isFeatured: true },
    { id: 2, name: "Rustic Pampas & Hydrangea", category: "Flower Arrangement", price: 450000, image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", status: "Pre-Order (PO)", isFeatured: true },
    { id: 3, name: "Sunflower Fields Crochet", category: "Rajutan/Crochet", price: 250000, image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", status: "Tersedia", isFeatured: true },
    { id: 4, name: "Classic Calla Lily Elegance", category: "Wedding Bouquet", price: 850000, image: "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", status: "Pre-Order (PO)", isFeatured: true },
    { id: 5, name: "Sweet Pink Carnation", category: "Hand Bouquet", price: 200000, image: "https://i.pinimg.com/736x/2e/18/93/2e1893f43e54d31867c9dd8b13624b9b.jpg", status: "Tersedia", isFeatured: false },
    { id: 6, name: "Luxury Red Roses Box", category: "Hampers", price: 650000, image: "https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", status: "Tersedia", isFeatured: false },
];

const categories = ["Semua Koleksi", "Hand Bouquet", "Bucket", "Hampers", "Wedding Bouquet", "Rajutan/Crochet", "Flower Arrangement", "Bunga Papan", "Backdrop Photo", "Gift Wrapping"];

const initialOrders = [
    { id: "HN-092", customer: "Neryza Yulinda", product: "Peony & Rose Blush Harmony", date: "12 Jul 2026", status: 4, price: 350000, address: "Jl. Sudirman No. 45, Jakarta Selatan" },
    { id: "HN-091", customer: "Audy Rizkia", product: "Rustic Pampas & Hydrangea", date: "11 Jul 2026", status: 4, price: 450000, address: "Kuningan, Jakarta" },
    { id: "HN-090", customer: "Febi Maulidiya", product: "Luxury Red Roses Box", date: "10 Jul 2026", status: 4, price: 650000, address: "Depok, Jawa Barat" },
    { id: "HN-089", customer: "Bapaknya Si Audy", product: "Classic Calla Lily Elegance", date: "09 Jul 2026", status: 4, price: 850000, address: "Bekasi, Jawa Barat" },
    { id: "HN-642", customer: "kiyo", product: "Peony & Rose Blush Harmony", date: "14 Jul 2026", status: 4, price: 375000, address: "mentas" },
    { id: "HN-548", customer: "luna", product: "Classic Calla Lily Elegance", date: "14 Jul 2026", status: 2, price: 850000, address: "pedurenan" },
    { id: "HN-335", customer: "ija", product: "Rustic Pampas & Hydrangea", date: "14 Jul 2026", status: 3, price: 450000, address: "Swiss" },
    { id: "HN-667", customer: "koir", product: "Sunflower Fields Crochet", date: "16 Jul 2026", status: 4, price: 250000, address: "kalibata" }
];

const initialStocks = [
    { id: 1, name: "Mawar Putih (Avalanche)", category: "Bunga Segar", qty: 8, unit: "Tangkai", status: "Aman", img: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&q=80&w=100" },
    { id: 2, name: "Kertas Cellophane Nude", category: "Kertas Wrapping", qty: 12, unit: "Roll", status: "Menipis", img: "" },
    { id: 3, name: "Pita Satin Sage Green", category: "Pita & Aksesoris", qty: 45, unit: "Roll", status: "Aman", img: "" },
    { id: 4, name: "Baby Breath", category: "Bunga Segar", qty: 2, unit: "Ikat", status: "Kritis", img: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=100" },
    { id: 5, name: "Oasis Floral Foam", category: "Perlengkapan", qty: 30, unit: "Pcs", status: "Aman", img: "" },
];

const initialReviews = [
    { id: 1, order_id: "HN-089", customer: "Bapaknya Si Audy", rating: 5, text: "Rangkaian bunganya sangat rapi dan bunganya fresh! Sangat memuaskan.", isFeatured: false, date: "10 Jul 2026" },
    { id: 2, order_id: "HN-088", customer: "Dina Lorenza", rating: 5, text: "Pelayanan sangat ramah dan pengiriman tepat waktu. Recomended banget!", isFeatured: true, date: "08 Jul 2026" },
    { id: 3, order_id: "HN-087", customer: "Siti Nurhaliza", rating: 4, text: "Bagus, tapi pengerjaannya agak lama sedikit.", isFeatured: true, date: "05 Jul 2026" },
    { id: 4, order_id: "HN-086", customer: "Rina Gunawan", rating: 5, text: "Sesuai ekspektasi! Kualitas premium, ga nyesel order disini.", isFeatured: true, date: "01 Jul 2026" }
];

const initialStockLogs = [
    { id: 1, stock_id: 1, name: "Mawar Putih (Avalanche)", type: "masuk", qty: 100, date: "10 Jul 2026", note: "Restock supplier rutin" },
    { id: 2, stock_id: 4, name: "Baby Breath", type: "keluar", qty: 5, date: "11 Jul 2026", note: "Dipakai untuk order HN-091" },
    { id: 3, stock_id: 1, name: "Mawar Putih (Avalanche)", type: "masuk", qty: 50, date: "13 Jul 2026", note: "Restock dari supplier B" },
    { id: 4, stock_id: 2, name: "Kertas Cellophane Nude", type: "masuk", qty: 12, date: "13 Jul 2026", note: "Stok Awal" },
    { id: 5, stock_id: 3, name: "Pita Satin Sage Green", type: "masuk", qty: 45, date: "13 Jul 2026", note: "Stok Awal" },
    { id: 6, stock_id: 4, name: "Baby Breath", type: "masuk", qty: 7, date: "13 Jul 2026", note: "Stok Awal" },
    { id: 7, stock_id: 5, name: "Oasis Floral Foam", type: "masuk", qty: 30, date: "13 Jul 2026", note: "Stok Awal" },
    { id: 8, stock_id: 1, name: "Mawar Putih (Avalanche)", type: "masuk", qty: 98, date: "14 Jul 2026", note: "-" },
    { id: 9, stock_id: 1, name: "Mawar Putih (Avalanche)", type: "keluar", qty: 100, date: "14 Jul 2026", note: "-" },
    { id: 10, stock_id: 1, name: "Mawar Putih (Avalanche)", type: "masuk", qty: 190, date: "14 Jul 2026", note: "-" },
    { id: 11, stock_id: 1, name: "Mawar Putih (Avalanche)", type: "keluar", qty: 370, date: "14 Jul 2026", note: "-" },
    { id: 12, stock_id: 1, name: "Mawar Putih (Avalanche)", type: "keluar", qty: 10, date: "14 Jul 2026", note: "-" }
];

                                        const statusSteps = ["Diproses", "Dalam Pembuatan", "Siap Kirim", "Dikirim", "Selesai"];

        const WhatsAppWidget = () => (
                                        <a href="https://wa.me/6281234567890" target="_blank" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 hover:bg-green-600 transition-all z-50 animate-fade-in">
                                            <i className="fab fa-whatsapp text-3xl"></i>
                                        </a>
                                        );

                                        const PublicView = ({activeView, setActiveView, setRole, products, orders, reviews, setReviews}) => {
            const [searchQuery, setSearchQuery] = React.useState("");

            const Navbar = () => {
                const [isSearchOpen, setIsSearchOpen] = React.useState(false);
                                        const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

                                        return (
                                        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-hanania-pink/10 shadow-sm">
                                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                                <div className="flex justify-between items-center h-20 md:h-24">
                                                    {/* Kiri: Logo */}
                                                    <div className="flex-1 flex items-center cursor-pointer gap-2 sm:gap-3" onClick={() => setActiveView('home')}>
                                                        <div className="h-10 sm:h-16 flex items-center justify-center flex-shrink-0">
                                                            <img src="/logo.png" alt="Hanania Logo" className="h-full w-auto object-contain drop-shadow-sm" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x50/ffffff/719663?text=Hanania+Craft' }} />
                                                        </div>
                                                        <div className="flex items-center pt-2">
                                                            <span style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2.5rem', lineHeight: '1' }} className="text-hanania-darkgreen">
                                                                Hanania
                                                            </span>
                                                            <span className="font-sans font-black text-[#e8b543] text-[11px] sm:text-[13px] uppercase tracking-[0.25em] ml-2 mt-3">
                                                                CRAFT
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Tengah: Menu */}
                                                    <div className="hidden md:flex flex-1 justify-center space-x-10">
                                                        {['home', 'catalog', 'track'].map(id => (
                                                            <button key={id} onClick={() => setActiveView(id)} className={`text-xs font-bold transition-all uppercase tracking-[0.2em] ${activeView === id ? 'text-hanania-pink border-b-2 border-hanania-pink pb-1.5' : 'text-gray-500 hover:text-hanania-pink hover:translate-y-[-2px]'}`}>
                                                                {id === 'home' ? 'Beranda' : id === 'catalog' ? 'Katalog' : 'Lacak Pesanan'}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {/* Kanan: Search & Hamburger */}
                                                    <div className="flex-1 flex justify-end items-center gap-4">
                                                        <div className="flex relative items-center">
                                                            <div className={`transition-all duration-300 flex items-center ${isSearchOpen ? 'w-32 sm:w-48 opacity-100 mr-2' : 'w-0 opacity-0 overflow-hidden'}`}>
                                                                <input type="text" placeholder="Cari bunga..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && searchQuery.trim()) { setActiveView('catalog'); } }} className="w-full border-b-2 border-gray-200 bg-transparent py-1 px-2 text-xs sm:text-sm focus:outline-none focus:border-hanania-pink font-medium" />
                                                            </div>
                                                            <button onClick={() => { if (isSearchOpen && searchQuery.trim()) { setActiveView('catalog'); } else if (isSearchOpen) { setSearchQuery(""); } setIsSearchOpen(!isSearchOpen); }} className="text-gray-600 hover:text-hanania-pink w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                                                                <i className={`fas ${isSearchOpen ? 'fa-times' : 'fa-search'} text-lg`}></i>
                                                            </button>
                                                        </div>

                                                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-600 hover:text-hanania-pink text-xl ml-2 w-10 h-10 flex items-center justify-center">
                                                            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mobile Menu Dropdown */}
                                            {isMobileMenuOpen && (
                                                <div className="md:hidden absolute top-[100%] left-0 w-full bg-white border-b border-gray-100 shadow-xl py-6 px-6 flex flex-col gap-5 z-40 animate-fade-in">
                                                    {['home', 'catalog', 'track'].map(id => (
                                                        <button key={id} onClick={() => { setActiveView(id); setIsMobileMenuOpen(false); }} className={`text-left text-xs font-bold uppercase tracking-[0.2em] pb-3 border-b border-gray-50 transition-colors ${activeView === id ? 'text-hanania-pink' : 'text-gray-500'}`}>
                                                            {id === 'home' ? 'Beranda' : id === 'catalog' ? 'Katalog' : 'Lacak Pesanan'}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </nav>
                                        );
            };

            const Footer = () => (
                                        <footer className="bg-hanania-lightpink pt-16 pb-8 border-t border-hanania-pink/10 mt-auto">
                                            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 text-sm">
                                                <div className="md:col-span-1">
                                                    <h3 className="font-serif text-3xl text-hanania-darkgreen mb-5 font-bold tracking-wide">Hanania House</h3>
                                                    <p className="text-hanania-darkgreen/80 mb-6 font-medium leading-relaxed">Karya tangan sepenuh hati. Merangkai bunga dan momen berharga Anda menjadi memori yang tak terlupakan.</p>
                                                    <div className="flex gap-4 text-hanania-darkgreen">
                                                        <a href="#" className="w-10 h-10 rounded-full border border-hanania-darkgreen/20 flex items-center justify-center hover:bg-hanania-darkgreen hover:text-white transition-all"><i className="fab fa-instagram text-lg"></i></a>
                                                        <a href="https://wa.me/6281234567890" target="_blank" className="w-10 h-10 rounded-full border border-hanania-darkgreen/20 flex items-center justify-center hover:bg-hanania-darkgreen hover:text-white transition-all"><i className="fab fa-whatsapp text-lg"></i></a>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-hanania-darkgreen mb-5 uppercase tracking-[0.2em] text-xs">Jelajahi</h4>
                                                    <ul className="space-y-4 text-hanania-darkgreen/80 font-medium text-xs">
                                                        <li><button onClick={() => setActiveView('catalog')} className="hover:text-hanania-pink transition-colors text-left w-full uppercase tracking-wider">Semua Koleksi</button></li>
                                                        <li><button onClick={() => setActiveView('catalog')} className="hover:text-hanania-pink transition-colors text-left w-full uppercase tracking-wider">Hand Bouquet</button></li>
                                                        <li><button onClick={() => setActiveView('catalog')} className="hover:text-hanania-pink transition-colors text-left w-full uppercase tracking-wider">Wedding Bouquet</button></li>
                                                        <li><button onClick={() => setActiveView('catalog')} className="hover:text-hanania-pink transition-colors text-left w-full uppercase tracking-wider">Crochet</button></li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-hanania-darkgreen mb-5 uppercase tracking-[0.2em] text-xs">Layanan Pelanggan</h4>
                                                    <ul className="space-y-4 text-hanania-darkgreen/80 font-medium text-xs">
                                                        <li><button onClick={() => setActiveView('track')} className="hover:text-hanania-pink transition-colors text-left w-full uppercase tracking-wider">Lacak Pesanan</button></li>
                                                        <li><a href="#" className="hover:text-hanania-pink transition-colors block uppercase tracking-wider">Cara Pemesanan</a></li>
                                                        <li><a href="#" className="hover:text-hanania-pink transition-colors block uppercase tracking-wider">FAQ</a></li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-hanania-darkgreen mb-5 uppercase tracking-[0.2em] text-xs">Bantuan?</h4>
                                                    <p className="text-hanania-darkgreen/80 mb-5 font-medium text-xs leading-relaxed">Kami siap membantu mewujudkan rangkaian impian Anda.</p>
                                                    <a href="https://wa.me/6281234567890" target="_blank" className="inline-block bg-hanania-darkgreen text-white px-6 py-3 rounded-lg hover:bg-hanania-green transition-colors font-bold uppercase tracking-wider text-xs shadow-lg"><i className="fab fa-whatsapp mr-2 text-lg align-middle"></i> Hubungi Kami</a>
                                                </div>
                                            </div>
                                            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-[10px] sm:text-xs text-hanania-darkgreen/60 pt-8 border-t border-hanania-darkgreen/10 font-bold tracking-[0.2em] uppercase gap-4">
                                                <p>&copy; 2026 Hanania House of Craft. All rights reserved.</p>
                                                <button onClick={() => setRole('login')} className="text-hanania-pink hover:text-hanania-darkgreen transition-colors flex items-center gap-2"><i className="fas fa-lock"></i> Admin</button>
                                            </div>
                                        </footer>
                                        );

            const HomeView = () => {
                                            // Mengambil produk yang di set isFeatured = true oleh admin
                                            let featuredProducts = products.filter(p => p.isFeatured);
                                        if(featuredProducts.length === 0) featuredProducts = products.slice(0, 4);

                                        return (
                                        <div className="animate-fade-in">
                                            {/* Hero Banner */}
                                            <div className="hero-gradient pt-16 pb-20 md:pt-24 md:pb-32 relative border-b border-hanania-pink/10">
                                                <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16 relative z-10">
                                                    <div className="flex-1 text-center md:text-left">
                                                        <div className="inline-block text-hanania-pink font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase mb-6 md:mb-8 bg-white px-5 py-2 rounded-full shadow-sm border border-hanania-pink/20"><i className="fas fa-leaf mr-2 text-hanania-green"></i>Artisanal Floristry</div>
                                                        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-bold text-hanania-darkgreen leading-tight mb-4 md:mb-6 uppercase tracking-widest">
                                                            Beautiful.<br />
                                                            <span className="font-script normal-case text-hanania-pink text-7xl sm:text-8xl md:text-[8rem] leading-none block my-2 md:my-4 drop-shadow-sm transform -rotate-2">Handcrafted.</span>
                                                            Heartfelt.
                                                        </h1>
                                                        <p className="text-hanania-darkgreen/80 font-medium text-sm md:text-base lg:text-lg mb-8 md:mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
                                                            Rangkaian bunga segar dan kerajinan tangan berkualitas untuk merayakan setiap momen penuh makna dalam hidup Anda.
                                                        </p>
                                                        <button onClick={() => setActiveView('catalog')} className="bg-hanania-pink hover:bg-[#b04f6d] text-white px-10 md:px-12 py-4 md:py-5 rounded-full font-bold transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 uppercase tracking-[0.2em] text-xs md:text-sm">
                                                            Lihat Koleksi <i className="fas fa-arrow-right ml-3"></i>
                                                        </button>
                                                    </div>
                                                    <div className="flex-1 relative w-full max-w-md md:max-w-none mx-auto">
                                                        <div className="absolute inset-0 bg-hanania-pink/15 rounded-full blur-3xl transform scale-110"></div>
                                                        <img src="https://images.unsplash.com/photo-1562690868-60bbe7293e94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Hero Bouquet" className="relative z-10 w-full h-72 sm:h-96 md:h-[550px] object-cover rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border-[6px] md:border-[8px] border-white" />
                                                        <div className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 bg-white p-4 md:p-5 rounded-3xl shadow-2xl z-20 flex items-center gap-4 border border-gray-50">
                                                            <div className="bg-hanania-lightpink w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-hanania-gold text-2xl md:text-3xl"><i className="fas fa-star"></i></div>
                                                            <div>
                                                                <p className="font-bold text-gray-800 text-[10px] md:text-xs uppercase tracking-[0.2em] mb-0.5">Premium Quality</p>
                                                                <p className="text-[10px] md:text-xs text-gray-500 font-medium">Handpicked with care</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Features Banner */}
                                            <div className="bg-white py-12 md:py-16 border-b border-gray-100">
                                                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x-0 md:divide-x divide-gray-100 text-center">
                                                    <div className="flex flex-col items-center group">
                                                        <div className="text-hanania-pink text-3xl md:text-4xl mb-4 md:mb-5 bg-hanania-lightpink w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform"><i className="fas fa-truck-fast"></i></div>
                                                        <h3 className="font-bold text-hanania-darkgreen text-xs md:text-sm mb-2 uppercase tracking-[0.1em]">Pengiriman Aman</h3>
                                                        <p className="text-[10px] md:text-xs text-gray-500 font-medium">Menjangkau JABODETABEK</p>
                                                    </div>
                                                    <div className="flex flex-col items-center group">
                                                        <div className="text-hanania-pink text-3xl md:text-4xl mb-4 md:mb-5 bg-hanania-lightpink w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform"><i className="fas fa-seedling"></i></div>
                                                        <h3 className="font-bold text-hanania-darkgreen text-xs md:text-sm mb-2 uppercase tracking-[0.1em]">Bunga Pilihan</h3>
                                                        <p className="text-[10px] md:text-xs text-gray-500 font-medium">Kualitas segar terbaik</p>
                                                    </div>
                                                    <div className="flex flex-col items-center group">
                                                        <div className="text-hanania-pink text-3xl md:text-4xl mb-4 md:mb-5 bg-hanania-lightpink w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform"><i className="fas fa-hand-sparkles"></i></div>
                                                        <h3 className="font-bold text-hanania-darkgreen text-xs md:text-sm mb-2 uppercase tracking-[0.1em]">100% Handmade</h3>
                                                        <p className="text-[10px] md:text-xs text-gray-500 font-medium">Dibuat oleh tangan ahli</p>
                                                    </div>
                                                    <div className="flex flex-col items-center group">
                                                        <div className="text-hanania-pink text-3xl md:text-4xl mb-4 md:mb-5 bg-hanania-lightpink w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform"><i className="fas fa-heart"></i></div>
                                                        <h3 className="font-bold text-hanania-darkgreen text-xs md:text-sm mb-2 uppercase tracking-[0.1em]">Kepuasan Pelanggan</h3>
                                                        <p className="text-[10px] md:text-xs text-gray-500 font-medium">Layanan ramah & personal</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Best Sellers Section */}
                                            <div className="py-20 md:py-28 max-w-7xl mx-auto px-6">
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-4">
                                                    <div>
                                                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-hanania-darkgreen mb-3">Koleksi Terfavorit <i className="fas fa-seedling text-hanania-gold ml-2"></i></h2>
                                                        <p className="text-gray-600 font-medium text-sm md:text-base">Pilihan terbaik yang dipilihkan langsung untuk momen spesial Anda.</p>
                                                    </div>
                                                    <button onClick={() => setActiveView('catalog')} className="text-hanania-pink font-bold hover:text-hanania-darkgreen transition text-xs md:text-sm uppercase tracking-[0.2em] whitespace-nowrap bg-hanania-lightpink px-6 py-3 rounded-full">Lihat Semua <i className="fas fa-arrow-right ml-1"></i></button>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                                                    {featuredProducts.map(p => (
                                                        <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col">
                                                            <div className="relative h-64 md:h-72 overflow-hidden">
                                                                <img src={p.image} alt={p.name} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700 ease-in-out" />
                                                                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur text-[9px] font-bold px-3 py-1.5 rounded-full text-hanania-darkgreen uppercase tracking-widest shadow-sm">{p.category}</div>
                                                            </div>
                                                            <div className="p-5 md:p-6 flex flex-col flex-1">
                                                                <h3 className="font-serif text-lg md:text-xl font-bold text-gray-800 mb-2 line-clamp-1">{p.name}</h3>
                                                                <p className="text-hanania-pink font-bold mb-5 text-sm md:text-base flex-1">Rp {p.price.toLocaleString('id-ID')}</p>
                                                                <button onClick={() => window.open(`https://wa.me/6281234567890?text=Halo%20Hanania,%20saya%20tertarik%20dengan%20${p.name}`)} className="w-full bg-hanania-surface text-hanania-pink py-3 rounded-lg font-bold hover:bg-hanania-pink hover:text-white transition-colors text-xs flex justify-center items-center gap-2 uppercase tracking-[0.2em]">
                                                                    <i className="fab fa-whatsapp text-lg"></i> Pesan
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Reviews Section (Interactive Overlapping Cards) */}
                                            <div className="py-20 md:py-28 bg-hanania-lightpink/30 overflow-hidden relative group/section">
                                                <div className="max-w-7xl mx-auto px-6 text-center mb-16 relative z-10">
                                                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-hanania-darkgreen mb-3">Apa Kata Mereka <i className="fas fa-heart text-hanania-pink ml-2"></i></h2>
                                                    <p className="text-gray-600 font-medium text-sm md:text-base">Kisah manis dari pelanggan yang memercayakan momennya kepada kami.</p>
                                                </div>
                                                
                                                <div className="relative h-80 sm:h-96 max-w-5xl mx-auto flex justify-center items-center">
                                                    {(reviews || []).filter(r => r.isFeatured).slice(0, 3).map((review, idx) => (
                                                        <div key={review.id} className={`absolute w-64 sm:w-80 md:w-96 p-6 md:p-8 rounded-3xl shadow-xl transition-all duration-500 ease-out hover:z-50 hover:scale-[1.15] hover:-translate-y-6 hover:shadow-2xl cursor-pointer ${idx === 0 ? 'bg-hanania-surface -rotate-12 -translate-x-20 sm:-translate-x-40 md:-translate-x-60 z-10 border border-hanania-pink/20' : idx === 1 ? 'bg-hanania-pink text-white z-30 scale-110 shadow-hanania-pink/40' : 'bg-white rotate-12 translate-x-20 sm:translate-x-40 md:translate-x-60 z-20 border border-gray-100'}`}>
                                                            <div className={`flex gap-1 mb-4 ${idx === 1 ? 'text-white' : 'text-hanania-gold'}`}>
                                                                {[...Array(review.rating)].map((_, i) => <i key={i} className="fas fa-star text-sm"></i>)}
                                                            </div>
                                                            <p className={`italic mb-6 text-xs sm:text-sm leading-relaxed font-medium ${idx === 1 ? 'text-white/90' : 'text-gray-700'}`}>"{review.text}"</p>
                                                            <div className={`flex items-center gap-3 border-t pt-4 ${idx === 1 ? 'border-white/20' : 'border-gray-100'}`}>
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${idx === 1 ? 'bg-white text-hanania-pink' : 'bg-hanania-pink/10 text-hanania-pink'}`}>{review.customer.charAt(0)}</div>
                                                                <div className="text-left">
                                                                    <p className={`font-bold text-xs uppercase tracking-wider ${idx === 1 ? 'text-white' : 'text-hanania-darkgreen'}`}>{review.customer}</p>
                                                                    <p className={`text-[10px] ${idx === 1 ? 'text-white/70' : 'text-gray-400'}`}>{review.date}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        );
            };
            const CatalogView = () => {
                const [activeCat, setActiveCat] = React.useState("Semua Koleksi");
                const [showTersedia, setShowTersedia] = React.useState(true);
                const [showPO, setShowPO] = React.useState(true);

                                        let filtered = activeCat === "Semua Koleksi" 
                    ? [...products].sort((a, b) => categories.indexOf(a.category) - categories.indexOf(b.category)) 
                    : products.filter(p => p.category === activeCat);
                
                filtered = filtered.filter(p => {
                    if (p.status === 'Tersedia' && !showTersedia) return false;
                    if (p.status === 'Pre-Order (PO)' && !showPO) return false;
                    return true;
                });

                // Filter berdasarkan search query dari navbar
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase();
                    filtered = filtered.filter(p => 
                        p.name.toLowerCase().includes(q) || 
                        p.category.toLowerCase().includes(q)
                    );
                }

                                        return (
                                        <div className="py-10 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-8 md:gap-12 animate-fade-in relative items-start">
                                            {/* Sidebar */}
                                            <div className="w-full md:w-64 flex-shrink-0 md:sticky md:top-24 md:h-[calc(100vh-7rem)] overflow-y-auto hide-scroll pb-4 md:pb-10 z-10">
                                                <h3 className="hidden md:block text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 pb-3 border-b border-gray-100">Kategori</h3>
                                                <ul className="flex overflow-x-auto hide-scroll md:flex-col space-x-3 md:space-x-0 md:space-y-2 pb-4 md:pb-0">
                                                    {categories.map(cat => (
                                                        <li key={cat} className="flex-shrink-0 md:flex-shrink-auto">
                                                            <button onClick={() => setActiveCat(cat)} className={`w-full text-left px-5 py-2.5 md:py-3 rounded-lg text-[10px] md:text-xs transition-all font-bold uppercase tracking-wider whitespace-nowrap md:whitespace-normal ${activeCat === cat ? 'bg-hanania-pink text-white shadow-md transform md:translate-x-2' : 'bg-gray-50 md:bg-transparent text-gray-600 hover:bg-hanania-lightpink hover:text-hanania-pink'}`}>
                                                                {cat}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <h3 className="hidden md:block text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-10 mb-6 pb-3 border-b border-gray-100">Status Stok</h3>
                                                <div className="hidden md:block space-y-4">
                                                    <label className="flex items-center gap-3 text-xs text-gray-600 font-bold uppercase tracking-wider cursor-pointer"><input type="checkbox" checked={showTersedia} onChange={e => setShowTersedia(e.target.checked)} className="accent-hanania-pink w-4 h-4 rounded" /> Tersedia</label>
                                                    <label className="flex items-center gap-3 text-xs text-gray-600 font-bold uppercase tracking-wider cursor-pointer"><input type="checkbox" checked={showPO} onChange={e => setShowPO(e.target.checked)} className="accent-hanania-pink w-4 h-4 rounded" /> Pre-Order (PO)</label>
                                                </div>
                                            </div>

                                            {/* Grid */}
                                            <div className="flex-1">
                                                <div className="mb-8 md:mb-10">
                                                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-hanania-darkgreen mb-3">Katalog Kurasi</h2>
                                                    <p className="text-gray-600 text-sm font-medium">Koleksi buket dan aransemen bunga artisanal kami, dirangkai dengan sepenuh hati.</p>
                                                    {searchQuery.trim() && (
                                                        <div className="mt-4 flex items-center gap-3 bg-hanania-lightpink px-4 py-2.5 rounded-lg">
                                                            <span className="text-xs font-bold text-hanania-pink">Hasil pencarian: "{searchQuery}" ({filtered.length} produk)</span>
                                                            <button onClick={() => setSearchQuery("")} className="text-hanania-pink hover:text-hanania-darkgreen transition-colors text-xs font-bold ml-auto"><i className="fas fa-times mr-1"></i>Hapus</button>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                                                    {filtered.map(p => (
                                                        <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col">
                                                            <div className="relative h-48 sm:h-56 md:h-72">
                                                                <img src={p.image} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700 ease-in-out" />
                                                                <div className={`absolute top-3 left-3 md:top-4 md:left-4 text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-sm backdrop-blur ${p.status === 'Tersedia' ? 'bg-[#E4EACD]/95 text-[#4A5D3F]' : 'bg-[#E6D5D9]/95 text-[#705C72]'}`}>
                                                                    {p.status}
                                                                </div>
                                                            </div>
                                                            <div className="p-4 md:p-6 flex-1 flex flex-col">
                                                                <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">{p.category}</p>
                                                                <h3 className="font-serif text-base md:text-lg font-bold text-gray-800 mb-2 line-clamp-2 md:line-clamp-1">{p.name}</h3>
                                                                <p className="text-hanania-pink font-bold text-xs md:text-sm mb-4 md:mb-6 flex-1">Rp {p.price.toLocaleString('id-ID')}</p>
                                                                <button onClick={() => window.open(`https://wa.me/6281234567890?text=Halo%20Hanania,%20saya%20tertarik%20dengan%20${p.name}`)} className="w-full border-2 border-gray-100 text-gray-700 py-2.5 rounded-lg font-bold hover:border-hanania-pink hover:text-hanania-pink hover:bg-hanania-lightpink transition-all text-[10px] md:text-xs flex justify-center items-center gap-2 uppercase tracking-[0.2em]">
                                                                    <i className="fab fa-whatsapp text-lg"></i> <span className="hidden sm:inline">Pesan via WhatsApp</span><span className="sm:hidden">Pesan</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        );
            };

            const TrackView = () => {
                const [searchId, setSearchId] = React.useState("");
                                        const [foundOrder, setFoundOrder] = React.useState(null);
                                        const [hasSearched, setHasSearched] = React.useState(false);

                                        const [showReviewForm, setShowReviewForm] = React.useState(false);
                                        const [reviewText, setReviewText] = React.useState("");
                                        const [reviewRating, setReviewRating] = React.useState(5);

                const handleSearch = () => {
                    const order = orders.find(o => o.id.toLowerCase() === searchId.toLowerCase());
                                        setFoundOrder(order || null);
                                        setHasSearched(true);

                                        setShowReviewForm(false);
                                        setReviewText("");
                                        setReviewRating(5);
                };

                                        return (
                                        <div className="py-12 md:py-16 max-w-4xl mx-auto px-4 sm:px-6 animate-fade-in text-center">
                                            <h2 className="font-serif text-3xl md:text-4xl font-bold text-hanania-darkgreen mb-4">Lacak Pesanan</h2>
                                            <p className="text-gray-600 font-medium text-sm md:text-base mb-10 max-w-lg mx-auto">Masukkan kode pesanan Anda untuk melihat status pengerjaan dan pengiriman rangkaian bunga Anda.</p>

                                            <div className="max-w-xl mx-auto relative mb-12">
                                                <input
                                                    type="text"
                                                    value={searchId}
                                                    onChange={e => setSearchId(e.target.value)}
                                                    onKeyPress={e => e.key === 'Enter' && handleSearch()}
                                                    placeholder="Contoh: HN-092"
                                                    className="w-full py-4 pl-6 pr-16 rounded-full border-2 border-gray-100 shadow-sm text-center font-bold focus:outline-none focus:border-hanania-pink focus:ring-4 focus:ring-hanania-pink/10 text-sm md:text-base transition-all"
                                                />
                                                <button onClick={handleSearch} className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-hanania-lightpink rounded-full text-hanania-pink hover:bg-hanania-pink hover:text-white transition-colors flex items-center justify-center">
                                                    <i className="fas fa-search"></i>
                                                </button>
                                            </div>

                                            {hasSearched && !foundOrder && (
                                                <div className="bg-red-50 text-red-600 p-5 rounded-xl max-w-md mx-auto font-bold border border-red-100 text-xs shadow-sm">Pesanan dengan ID "{searchId}" tidak ditemukan. Pastikan kode diketik dengan benar.</div>
                                            )}

                                            {hasSearched && foundOrder && (
                                                <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100 text-left animate-fade-in overflow-hidden">
                                                    {/* Stepper Progress */}
                                                    <div className="relative mb-12 mt-6 px-2 sm:px-4">
                                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-gray-100 z-0 rounded-full"></div>
                                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-hanania-pink z-0 rounded-full transition-all duration-700 ease-in-out" style={{ width: `${(foundOrder.status / 4) * 100}%` }}></div>

                                                        <div className="relative z-10 flex justify-between">
                                                            {[
                                                                { icon: 'fa-box-open', label: 'Diproses' },
                                                                { icon: 'fa-paint-brush', label: 'Dibuat' },
                                                                { icon: 'fa-box', label: 'Siap Kirim' },
                                                                { icon: 'fa-truck', label: 'Dikirim' },
                                                                { icon: 'fa-check-double', label: 'Selesai' }
                                                            ].map((step, idx) => (
                                                                <div key={idx} className="flex flex-col items-center bg-white px-1 sm:px-3">
                                                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 shadow-sm transition-all duration-500 ${idx <= foundOrder.status ? 'bg-hanania-pink text-white scale-110' : 'bg-white text-gray-300 border-2 border-gray-100'}`}>
                                                                        <i className={`fas ${step.icon} text-sm sm:text-base`}></i>
                                                                    </div>
                                                                    <span className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.1em] text-center ${idx <= foundOrder.status ? 'text-hanania-pink' : 'text-gray-400'}`}>{step.label}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Order Detail Card */}
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                                                        <div className="lg:col-span-2 bg-hanania-lightpink/40 p-5 md:p-8 rounded-xl border border-hanania-pink/10 relative overflow-hidden">
                                                            <div className="absolute -right-10 -top-10 text-9xl text-hanania-pink/5 opacity-20 transform rotate-12"><i className="fas fa-leaf"></i></div>
                                                            <h3 className="font-serif text-xl md:text-2xl font-bold text-hanania-darkgreen mb-5 border-b border-gray-200/50 pb-3 relative z-10">Detail Pesanan: {foundOrder.id}</h3>
                                                            <div className="flex flex-col sm:flex-row gap-5 items-start mb-8 relative z-10">
                                                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden border-2 border-white shadow-md">
                                                                    <img src={products.find(p => p.name === foundOrder.product)?.image || "https://placehold.co/200"} className="w-full h-full object-cover" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-gray-800 text-sm md:text-lg mb-1">{foundOrder.product}</h4>
                                                                    <p className="text-xs md:text-sm text-gray-500 mb-2 font-medium">Pemesan: {foundOrder.customer}</p>
                                                                    <p className="text-hanania-pink font-bold text-sm md:text-base bg-white px-3 py-1 inline-block rounded-lg shadow-sm mt-1">Rp {foundOrder.price.toLocaleString('id-ID')}</p>
                                                                </div>
                                                            </div>
                                                            <div className="border-t border-gray-200/50 pt-4 flex justify-between font-bold text-gray-800 relative z-10 text-xs md:text-sm">
                                                                <span>Total Pembayaran (Termasuk Ongkir)</span>
                                                                <span className="text-hanania-darkgreen">Rp {(foundOrder.price + 50000).toLocaleString('id-ID')}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col gap-4 md:gap-6">
                                                            {/* Box 1: Alamat */}
                                                            <div className="order-1 border border-gray-200 p-4 md:p-5 rounded-xl bg-white shadow-sm">
                                                                <h4 className="font-bold text-xs md:text-sm text-gray-800 mb-2 flex items-center gap-2"><i className="fas fa-map-marker-alt text-hanania-pink"></i> Pengiriman</h4>
                                                                <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed">{foundOrder.address}</p>
                                                                <p className="text-xs md:text-sm font-bold text-gray-800 mt-3">Est. Tanggal: {foundOrder.date}</p>
                                                            </div>

                                                            {/* Box 2: Ulasan (Muncul di atas "Butuh Bantuan" jika status selesai) */}
                                                            {foundOrder.status === 4 && (
                                                                <div className="order-2 w-full animate-fade-in">
                                                                    {!reviews.some(r => r.orderId === foundOrder.id) && !showReviewForm && (
                                                                        <div className="text-center bg-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm">
                                                                            <div className="w-10 h-10 bg-hanania-lightpink text-hanania-pink rounded-full flex items-center justify-center mx-auto mb-3 text-lg"><i className="fas fa-star"></i></div>
                                                                            <h4 className="font-serif font-bold text-base md:text-lg text-hanania-darkgreen mb-1">Pesanan Selesai</h4>
                                                                            <p className="text-[10px] md:text-xs text-gray-600 mb-4 font-medium">Bagaimana pendapat Anda?</p>
                                                                            <button onClick={() => setShowReviewForm(true)} className="w-full bg-hanania-pink text-white px-4 py-2.5 rounded-lg font-bold hover:bg-[#b04f6d] transition text-[10px] md:text-xs shadow-sm uppercase tracking-wider">
                                                                                Beri Ulasan
                                                                            </button>
                                                                        </div>
                                                                    )}

                                                                    {!reviews.some(r => r.orderId === foundOrder.id) && showReviewForm && (
                                                                        <div className="bg-hanania-lightpink/30 p-4 md:p-5 rounded-xl border border-hanania-pink/20 text-left shadow-sm animate-fade-in w-full">
                                                                            <h4 className="font-serif font-bold text-hanania-darkgreen mb-3 text-sm border-b border-gray-200 pb-2">Tulis Ulasan</h4>
                                                                            <div className="mb-3">
                                                                                <div className="flex justify-center gap-2">
                                                                                    {[1, 2, 3, 4, 5].map(star => (
                                                                                        <button key={star} onClick={() => setReviewRating(star)} className={`text-2xl transition-transform hover:scale-110 ${star <= reviewRating ? 'text-hanania-gold' : 'text-gray-300'}`}>
                                                                                            <i className="fas fa-star"></i>
                                                                                        </button>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                            <div className="mb-4">
                                                                                <textarea
                                                                                    value={reviewText}
                                                                                    onChange={(e) => setReviewText(e.target.value)}
                                                                                    placeholder="Kesan Anda..."
                                                                                    className="w-full border border-gray-200 rounded-lg p-3 text-xs md:text-sm focus:border-hanania-pink focus:ring-1 focus:ring-hanania-pink focus:outline-none min-h-[80px] font-medium"
                                                                                ></textarea>
                                                                            </div>
                                                                            <div className="flex gap-2 justify-end">
                                                                                <button onClick={() => setShowReviewForm(false)} className="px-4 py-2 text-gray-500 font-bold text-[10px] md:text-xs hover:bg-gray-100 rounded-lg transition uppercase tracking-wider flex-1">Batal</button>
                                                                                <button
                                                                                    disabled={!reviewText.trim()}
                                                                                    onClick={() => {
                                                                                        if (reviewText.trim() === '') return;
                                                                                        setReviews([...reviews, {
                                                                                            id: Date.now(),
                                                                                            orderId: foundOrder.id,
                                                                                            product: foundOrder.product,
                                                                                            customer: foundOrder.customer,
                                                                                            rating: reviewRating,
                                                                                            text: reviewText,
                                                                                            status: 'menunggu'
                                                                                        }]);
                                                                                        setShowReviewForm(false);
                                                                                    }}
                                                                                    className={`px-4 py-2 rounded-lg font-bold transition text-[10px] md:text-xs shadow-sm uppercase tracking-wider flex-1 ${reviewText.trim() ? 'bg-hanania-darkgreen text-white hover:bg-hanania-green' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                                                                                    Kirim
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {reviews.some(r => r.orderId === foundOrder.id) && (
                                                                        <div className="bg-[#E8EEDF] p-4 rounded-xl border border-[#d1dec0] text-center flex items-center justify-center gap-3 shadow-sm animate-fade-in w-full">
                                                                            <div className="w-8 h-8 bg-hanania-darkgreen text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm shadow-sm"><i className="fas fa-check"></i></div>
                                                                            <h4 className="font-bold text-hanania-darkgreen text-xs md:text-sm">Ulasan Diterima!</h4>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Box 3: Butuh Bantuan */}
                                                            <div className="order-3 bg-hanania-surface p-4 md:p-5 rounded-xl text-center border border-hanania-pink/20 shadow-sm mt-auto">
                                                                <p className="text-[10px] md:text-xs font-bold text-hanania-darkgreen uppercase tracking-wider mb-2 md:mb-3"><i className="fas fa-headset"></i> Butuh Bantuan?</p>
                                                                <a href="https://wa.me/6281234567890" target="_blank" className="block w-full bg-hanania-darkgreen text-white py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-bold hover:bg-hanania-green transition uppercase tracking-wide">Hubungi Kami</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        );
            };

                                        return (
                                        <div className="min-h-screen flex flex-col">
                                            <Navbar />
                                            <main className="flex-grow">
                                                {activeView === 'home' && <HomeView />}
                                                {activeView === 'catalog' && <CatalogView />}
                                                {activeView === 'track' && <TrackView />}
                                            </main>
                                            <Footer />
                                            <WhatsAppWidget />
                                        </div>
                                        );
        };

                                        const AdminView = ({setRole, products, setProducts, orders, setOrders, stocks, setStocks, reviews, setReviews, stockLogs, setStockLogs}) => {
            const enrichedStocks = React.useMemo(() => {
                return stocks.map(s => {
                    const calculatedQty = (stockLogs || []).filter(l => l.stock_id === s.id).reduce((acc, l) => l.type === 'masuk' ? acc + l.qty : acc - l.qty, 0);
                    let status = 'Aman';
                    if (calculatedQty <= 5) status = 'Kritis';
                    else if (calculatedQty <= 15) status = 'Menipis';
                    
                    return { ...s, qty: calculatedQty, status };
                });
            }, [stocks, stockLogs]);

            const [adminNav, setAdminNav] = React.useState('internal'); // internal, orders, catalog_edit, home_edit
            
            const AdminTopNav = () => (
                                        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
                                            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                                                <div className="flex justify-between items-center h-16 md:h-20">
                                                    <div className="flex items-center gap-2 text-hanania-pink font-serif text-xl md:text-2xl font-bold cursor-pointer" onClick={() => setAdminNav('internal')}>
                                                        <i className="fas fa-leaf"></i> Admin
                                                    </div>
                                                    <div className="hidden md:flex gap-1 lg:gap-2">
                                                        <button onClick={() => setAdminNav('internal')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${adminNav === 'internal' ? 'bg-hanania-surface text-hanania-pink' : 'text-gray-500 hover:bg-gray-50'}`}>Internal Data</button>
                                                        <button onClick={() => setAdminNav('orders')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${adminNav === 'orders' ? 'bg-hanania-surface text-hanania-pink' : 'text-gray-500 hover:bg-gray-50'}`}>Pesanan Aktif</button>
                                                        <button onClick={() => setAdminNav('catalog_edit')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${adminNav === 'catalog_edit' ? 'bg-hanania-surface text-hanania-pink' : 'text-gray-500 hover:bg-gray-50'}`}>Katalog (Web)</button>
                                                        <button onClick={() => setAdminNav('home_edit')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${adminNav === 'home_edit' ? 'bg-hanania-surface text-hanania-pink' : 'text-gray-500 hover:bg-gray-50'}`}>Beranda (Web)</button>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative cursor-pointer text-gray-500 hover:text-hanania-pink transition">
                                                            <i className="far fa-bell text-lg md:text-xl"></i>
                                                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                                                        </div>
                                                        <div className="w-px h-6 bg-gray-200 mx-2"></div>
                                                        <button onClick={() => setRole('public')} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors uppercase tracking-widest"><i className="fas fa-sign-out-alt"></i> Keluar</button>
                                                    </div>
                                                </div>
                                                {/* Mobile Nav */}
                                                <div className="flex md:hidden overflow-x-auto gap-2 pb-3 hide-scroll">
                                                    <button onClick={() => setAdminNav('internal')} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${adminNav === 'internal' ? 'bg-hanania-surface text-hanania-pink' : 'text-gray-500 bg-gray-50'}`}>Internal Data</button>
                                                    <button onClick={() => setAdminNav('orders')} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${adminNav === 'orders' ? 'bg-hanania-surface text-hanania-pink' : 'text-gray-500 bg-gray-50'}`}>Pesanan Aktif</button>
                                                    <button onClick={() => setAdminNav('catalog_edit')} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${adminNav === 'catalog_edit' ? 'bg-hanania-surface text-hanania-pink' : 'text-gray-500 bg-gray-50'}`}>Katalog (Web)</button>
                                                    <button onClick={() => setAdminNav('home_edit')} className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${adminNav === 'home_edit' ? 'bg-hanania-surface text-hanania-pink' : 'text-gray-500 bg-gray-50'}`}>Beranda (Web)</button>
                                                </div>
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
                    setProducts(products.map(p => p.id === id ? {...p, isFeatured: newFeatured} : p));
                    if (API_BASE) {
                        try {
                            await fetch(`${API_BASE}/api/products/${id}/featured`, {
                                method: 'PUT',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({isFeatured: newFeatured})
                            });
                        } catch(e) { console.warn("Saved locally, backend offline:", e); }
                    }
                };

                const toggleFeaturedReview = async (id) => {
                    const target = reviews.find(r => r.id === id);
                    if (!target) return;
                    const newFeatured = !target.isFeatured;
                    if (newFeatured && reviews.filter(r => r.isFeatured).length >= 3) {
                        alert("Maksimal hanya 3 ulasan yang bisa ditampilkan di Beranda!");
                        return;
                    }
                    setReviews(reviews.map(r => r.id === id ? {...r, isFeatured: newFeatured} : r));
                    if (API_BASE) {
                        try {
                            await fetch(`${API_BASE}/api/reviews/${id}/featured`, {
                                method: 'PUT',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({isFeatured: newFeatured})
                            });
                        } catch(e) { console.warn("Saved locally, backend offline:", e); }
                    }
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
                                                        <div key={r.id} className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex justify-between items-center ${r.isFeatured ? 'border-hanania-pink bg-hanania-lightpink/30' : 'border-gray-100 hover:border-gray-200'}`} onClick={() => toggleFeaturedReview(r.id)}>
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

                                        const [selectedProduct, setSelectedProduct] = React.useState(null);
                                        const [editName, setEditName] = React.useState("");
                                        const [editCat, setEditCat] = React.useState("");
                                        const [editPrice, setEditPrice] = React.useState("");
                                        const [editStatus, setEditStatus] = React.useState("");
                                        const [editImg, setEditImg] = React.useState("");

                const openEditModal = (p) => {
                    setSelectedProduct(p);
                    setEditName(p.name);
                    setEditCat(p.category);
                    setEditPrice(p.price);
                    setEditStatus(p.status);
                    setEditImg(p.image);
                };

                const handleSaveProduct = async () => {
                    if(!newName || !newPrice) return;
                    const newProd = {
                        id: Date.now(),
                        name: newName, category: newCat,
                        price: parseInt(newPrice), status: newStatus, image: newImg || "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&w=800&q=80", isFeatured: false
                    };
                    setProducts([...products, newProd]);
                    setShowForm(false);
                    setNewName(""); setNewPrice(""); setNewImg("");
                    if (API_BASE) {
                        try {
                            const res = await fetch(`${API_BASE}/api/products`, {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify(newProd)
                            });
                            if (res.ok) {
                                const data = await res.json();
                                if (data && data.product) {
                                    setProducts(prev => prev.map(p => p.id === newProd.id ? data.product : p));
                                }
                            }
                        } catch(e) { console.warn("Saved locally, backend offline:", e); }
                    }
                };

                const handleUpdateProduct = async () => {
                    if (!selectedProduct || !editName || !editPrice) return;
                    const updatedProd = {
                        name: editName, category: editCat,
                        price: parseInt(editPrice), status: editStatus, image: editImg || selectedProduct.image
                    };
                    setProducts(products.map(p => p.id === selectedProduct.id ? {...p, ...updatedProd} : p));
                    setSelectedProduct(null);
                    if (API_BASE) {
                        try {
                            await fetch(`${API_BASE}/api/products/${selectedProduct.id}`, {
                                method: 'PUT',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify(updatedProd)
                            });
                        } catch(e) { console.warn("Saved locally, backend offline:", e); }
                    }
                };

                const handleDeleteProduct = async (id) => {
                    if(confirm('Hapus produk ini secara permanen?')) {
                        setProducts(products.filter(prod => prod.id !== id));
                        setSelectedProduct(null);
                        if (API_BASE) {
                            try {
                                await fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE' });
                            } catch (e) { console.warn("Deleted locally, backend offline:", e); }
                        }
                    }
                };

                                        return (
                                        <div className="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in relative">
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
                                                                            <button className="text-gray-400 hover:text-hanania-darkgreen transition-colors" onClick={() => openEditModal(p)}>
                                                                                <i className="fas fa-pen"></i>
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {selectedProduct && (
                                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                                                    <div className="bg-white p-6 md:p-8 rounded-2xl w-full max-w-md shadow-xl relative animate-fade-in">
                                                        <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><i className="fas fa-times"></i></button>
                                                        <h3 className="font-serif text-xl font-bold text-hanania-darkgreen mb-5">Update Produk</h3>
                                                        
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Nama Produk</label>
                                                                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-hanania-darkgreen focus:outline-none bg-gray-50" />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Kategori</label>
                                                                <select value={editCat} onChange={e => setEditCat(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-hanania-darkgreen focus:outline-none bg-gray-50">
                                                                    <option>Hand Bouquet</option><option>Flower Box</option><option>Vase Arrangement</option><option>Wedding / Event</option><option>Hampers</option><option>Rajutan/Crochet</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Harga (Rp)</label>
                                                                <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-hanania-darkgreen focus:outline-none bg-gray-50" />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Status</label>
                                                                <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-hanania-darkgreen focus:outline-none bg-gray-50">
                                                                    <option>Tersedia</option><option>Pre-Order (PO)</option><option>Kosong</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">URL Gambar</label>
                                                                <input type="text" value={editImg} onChange={e => setEditImg(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-hanania-darkgreen focus:outline-none bg-gray-50" />
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="mt-8 flex justify-between items-center pt-5 border-t border-gray-100">
                                                            <button onClick={() => handleDeleteProduct(selectedProduct.id)} className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-2"><i className="fas fa-trash"></i> Hapus</button>
                                                            <div className="flex gap-2">
                                                                <button onClick={() => setSelectedProduct(null)} className="px-5 py-2.5 rounded-lg text-xs font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors uppercase tracking-wider">Batal</button>
                                                                <button onClick={handleUpdateProduct} className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-hanania-darkgreen hover:bg-hanania-green transition-colors uppercase tracking-wider shadow-sm">Simpan</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        );
            };

            const ActiveOrders = () => {
                const [showForm, setShowForm] = React.useState(false);
                                        const [custName, setCustName] = React.useState("");
                                        const [custAddress, setCustAddress] = React.useState("");
                                        const [prodName, setProdName] = React.useState("");

                const updateStatus = async (id, newStatus) => {
                    setOrders(orders.map(o => o.id === id ? { ...o, status: parseInt(newStatus) } : o));
                    if (API_BASE) {
                        try {
                            await fetch(`${API_BASE}/api/orders/${id}/status`, {
                                method: 'PUT',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({status: parseInt(newStatus)})
                            });
                        } catch(e) { console.warn("Updated locally, backend offline:", e); }
                    }
                };

                const handleAddOrder = async () => {
                    if(!custName || !prodName) return;

                    const newId = `HN-${Math.floor(Math.random() * 900) + 100}`;
                    const selProd = products.find(p => p.name === prodName);
                    const price = selProd ? selProd.price : 0;
                    const dateStr = new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'});

                    const newOrder = {
                        id: newId, customer: custName, product: prodName, date: dateStr, status: 0, price: price, address: custAddress || "Alamat tidak diisi"
                    };

                    setOrders([...orders, newOrder]);
                    setShowForm(false);
                    setCustName(""); setCustAddress(""); setProdName("");

                    if (API_BASE) {
                        try {
                            await fetch(`${API_BASE}/api/orders`, {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify(newOrder)
                            });
                        } catch(e) { console.warn("Saved locally, backend offline:", e); }
                    }
                };

                                        return (
                                        <div className="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in">
                                            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                                                <div>
                                                    <h2 className="text-2xl md:text-3xl font-serif text-hanania-admintxt mb-2 font-bold">Pesanan Berjalan</h2>
                                                    <p className="text-xs md:text-sm text-gray-500 font-medium">Pantau pesanan atau buat pesanan baru hasil deal via WhatsApp.</p>
                                                </div>
                                                <button onClick={() => setShowForm(!showForm)} className="bg-hanania-darkgreen text-white px-5 py-2.5 rounded-lg text-xs md:text-sm font-bold shadow-md hover:bg-hanania-green transition-all uppercase tracking-wider whitespace-nowrap w-max">
                                                    <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'} mr-2`}></i> {showForm ? 'Batal' : 'Buat Pesanan Manual'}
                                                </button>
                                            </div>

                                            {showForm && (
                                                <div className="bg-white p-6 md:p-8 rounded-2xl border border-hanania-darkgreen/20 shadow-sm mb-8 animate-fade-in">
                                                    <h3 className="font-bold text-hanania-darkgreen mb-6 border-b border-gray-100 pb-3 uppercase tracking-wider text-sm"><i className="fas fa-file-invoice mr-2"></i> Pendaftaran Pesanan Baru</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                                                        <div><label className="block text-xs font-bold text-gray-600 mb-2">Nama Pelanggan</label><input type="text" value={custName} onChange={e => setCustName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-hanania-darkgreen focus:outline-none" placeholder="Cth: Ibu Anisa" /></div>
                                                        <div><label className="block text-xs font-bold text-gray-600 mb-2">Produk yang dipesan</label>
                                                            <select value={prodName} onChange={e => setProdName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-hanania-darkgreen focus:outline-none">
                                                                <option value="">-- Pilih Produk --</option>
                                                                {products.map(p => <option key={p.id} value={p.name}>{p.name} - Rp {p.price.toLocaleString('id-ID')}</option>)}
                                                            </select>
                                                        </div>
                                                        <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-600 mb-2">Alamat Pengiriman</label><textarea value={custAddress} onChange={e => setCustAddress(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-hanania-darkgreen focus:outline-none min-h-[80px]" placeholder="Alamat lengkap tujuan..."></textarea></div>
                                                    </div>
                                                    <button onClick={handleAddOrder} className="bg-hanania-darkgreen text-white px-8 py-2.5 rounded-lg text-xs font-bold hover:bg-hanania-green transition uppercase tracking-wider w-full md:w-auto shadow-sm">Generate Pesanan & ID</button>
                                                </div>
                                            )}

                                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-left border-collapse min-w-[900px]">
                                                        <thead>
                                                            <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-500 uppercase tracking-widest">
                                                                <th className="p-4 md:p-5 font-bold">ID Pesanan</th>
                                                                <th className="p-4 md:p-5 font-bold">Pelanggan</th>
                                                                <th className="p-4 md:p-5 font-bold">Produk</th>
                                                                <th className="p-4 md:p-5 font-bold">Tgl Buat</th>
                                                                <th className="p-4 md:p-5 font-bold">Ubah Status Workflow</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-sm">
                                                            {orders.filter(o => o.status < 4).reverse().map(o => (
                                                                <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                                    <td className="p-4 md:p-5 font-bold text-hanania-pink">{o.id}</td>
                                                                    <td className="p-4 md:p-5 font-medium text-gray-800">{o.customer}</td>
                                                                    <td className="p-4 md:p-5 text-gray-600">{o.product}</td>
                                                                    <td className="p-4 md:p-5 text-gray-600">{o.date}</td>
                                                                    <td className="p-4 md:p-5">
                                                                        <select
                                                                            value={o.status}
                                                                            onChange={(e) => updateStatus(o.id, e.target.value)}
                                                                            className="border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-hanania-pink bg-white"
                                                                        >
                                                                            {statusSteps.map((step, idx) => (
                                                                                <option key={idx} value={idx}>{step}</option>
                                                                            ))}
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    {orders.filter(o => o.status < 4).length === 0 && (
                                                        <div className="p-10 text-center text-gray-400 font-medium text-sm">Tidak ada pesanan aktif saat ini.</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        );
            };

            const InternalArea = () => {
                const [internalTab, setInternalTab] = React.useState('dashboard');
                                        const [reportTab, setReportTab] = React.useState('penjualan');
                                        const [showAddStock, setShowAddStock] = React.useState(false);

                                        const [stockName, setStockName] = React.useState("");
                                        const [stockCat, setStockCat] = React.useState("Bunga Segar");
                                        const [stockQty, setStockQty] = React.useState("");
                                        const [stockUnit, setStockUnit] = React.useState("");
                                        const [stockStatus, setStockStatus] = React.useState("Aman");

                                        const [selectedStock, setSelectedStock] = React.useState(null);
                                        const [stockActionType, setStockActionType] = React.useState('masuk');
                                        const [stockActionQty, setStockActionQty] = React.useState("");
                                        const [stockActionNote, setStockActionNote] = React.useState("");

                const handleSaveStock = async () => {
                    if(!stockName || !stockQty) return;
                    const qtyVal = parseInt(stockQty);
                    const newStock = {
                        id: Date.now(),
                        name: stockName,
                        category: stockCat || "Bunga Segar",
                        qty: qtyVal,
                        unit: stockUnit || "Pcs",
                        status: qtyVal > 10 ? "Aman" : qtyVal > 0 ? "Menipis" : "Kritis"
                    };
                    setStocks([...stocks, newStock]);
                    setShowAddStock(false);
                    setStockName(""); setStockQty(""); setStockUnit("");

                    if (API_BASE) {
                        try {
                            const res = await fetch(`${API_BASE}/api/stocks`, {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify(newStock)
                            });
                            if (res.ok) {
                                const data = await res.json();
                                if (data && data.stock) {
                                    setStocks(prev => prev.map(s => s.id === newStock.id ? data.stock : s));
                                }
                            }
                        } catch(e) { console.warn("Saved locally, backend offline:", e); }
                    }
                };

                const handleUpdateStock = async () => {
                    if (!selectedStock || !stockActionQty || parseInt(stockActionQty) <= 0) return;
                    const amount = parseInt(stockActionQty);
                    const newQty = stockActionType === 'masuk' ? selectedStock.qty + amount : selectedStock.qty - amount;
                    if (newQty < 0) { alert('Stok tidak mencukupi!'); return; }

                    const newStatus = newQty > 10 ? "Aman" : newQty > 0 ? "Menipis" : "Kritis";
                    setStocks(stocks.map(s => s.id === selectedStock.id ? {...s, qty: newQty, status: newStatus} : s));

                    const dateStr = new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'});
                    const logEntry = {
                        id: Date.now(),
                        stock_id: selectedStock.id,
                        name: selectedStock.name,
                        type: stockActionType,
                        qty: amount,
                        date: dateStr,
                        note: stockActionNote || '-'
                    };
                    setStockLogs([...stockLogs, logEntry]);

                    setSelectedStock(null);
                    setStockActionQty("");
                    setStockActionNote("");

                    if (API_BASE) {
                        try {
                            await fetch(`${API_BASE}/api/stocks/${selectedStock.id}`, {
                                method: 'PUT',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({qty: newQty, status: newStatus})
                            });
                            await fetch(`${API_BASE}/api/stock_logs`, {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify(logEntry)
                            });
                        } catch(e) { console.warn("Saved locally, backend offline:", e); }
                    }
                };

                const handleDeleteStock = async (id) => {
                    if (confirm("Yakin ingin menghapus item stok ini?")) {
                        setStocks(stocks.filter(s => s.id !== id));
                        setSelectedStock(null);
                        if (API_BASE) {
                            try {
                                await fetch(`${API_BASE}/api/stocks/${id}`, { method: 'DELETE' });
                            } catch(e) { console.warn("Deleted locally, backend offline:", e); }
                        }
                    }
                };

                const DashboardChart = () => {
                    const canvasRef = React.useRef(null);
                    React.useEffect(() => {
                        if(canvasRef.current) {
                            const ctx = canvasRef.current.getContext('2d');
                            const dataMap = [0, 0, 0, 0, 0, 0, 0];
                            orders.forEach(o => {
                                // e.g. "10 Jul 2026"
                                const d = new Date(o.date);
                                if (!isNaN(d.getTime())) {
                                    dataMap[d.getDay()]++;
                                } else {
                                    // Fallback for simple date parsing if needed, but new Date() usually handles "10 Jul 2026"
                                }
                            });
                            const mappedData = [ dataMap[1], dataMap[2], dataMap[3], dataMap[4], dataMap[5], dataMap[6], dataMap[0] ];

                            const chartInstance = new window.Chart(ctx, {
                                type: 'bar',
                                data: {
                                    labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
                                    datasets: [{
                                        label: 'Pesanan Masuk',
                                        data: mappedData,
                                        backgroundColor: '#cd6184',
                                        borderRadius: 4
                                    }]
                                },
                                options: {
                                    responsive: true, maintainAspectRatio: false,
                                    plugins: {legend: {display: false } },
                                    scales: {y: {beginAtZero: true, ticks: {stepSize: 1 } } }
                                }
                            });
                            return () => chartInstance.destroy();
                        }
                    }, [orders]);
                                        return <div className="h-64 mt-4 w-full"><canvas ref={canvasRef}></canvas></div>;
                };

                                        return (
                                        <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)] bg-hanania-adminbg items-start">
                                            {/* Sidebar Internal (Menempel) */}
                                            <div className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 flex md:flex-col overflow-x-auto md:overflow-visible hide-scroll md:sticky md:top-20 md:h-[calc(100vh-5rem)]">
                                                <div className="p-4 md:p-6 pb-2 hidden md:block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Menu Operasional</div>
                                                <div className="flex md:flex-col p-2 md:p-4 gap-1 min-w-max md:min-w-0">
                                                    <button onClick={() => setInternalTab('dashboard')} className={`text-left px-4 py-3 rounded-xl text-xs font-bold transition-colors uppercase tracking-wider flex items-center gap-3 ${internalTab === 'dashboard' ? 'bg-hanania-lightpink text-hanania-pink' : 'text-gray-600 hover:bg-gray-50'}`}><i className="fas fa-chart-pie w-4"></i> Dashboard</button>
                                                    <button onClick={() => setInternalTab('stock')} className={`text-left px-4 py-3 rounded-xl text-xs font-bold transition-colors uppercase tracking-wider flex items-center gap-3 ${internalTab === 'stock' ? 'bg-hanania-lightpink text-hanania-pink' : 'text-gray-600 hover:bg-gray-50'}`}><i className="fas fa-box w-4"></i> Manajemen Stok</button>
                                                    <button onClick={() => setInternalTab('reports')} className={`text-left px-4 py-3 rounded-xl text-xs font-bold transition-colors uppercase tracking-wider flex items-center gap-3 ${internalTab === 'reports' ? 'bg-hanania-lightpink text-hanania-pink' : 'text-gray-600 hover:bg-gray-50'}`}><i className="fas fa-file-invoice w-4"></i> Laporan</button>
                                                </div>
                                            </div>

                                            {/* Konten Internal Utama */}
                                            <div className="flex-1 p-4 sm:p-6 md:p-10 w-full overflow-hidden">
                                                {/* TAB: DASHBOARD (Ringkasan & Statistik) */}
                                                {internalTab === 'dashboard' && (
                                                    <div className="animate-fade-in max-w-5xl mx-auto">
                                                        <h2 className="text-2xl md:text-3xl font-serif text-hanania-admintxt mb-6 md:mb-8 font-bold">Ringkasan & Statistik</h2>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
                                                            <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                                                                <div className="flex justify-between items-start mb-4">
                                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Pesanan Aktif</span>
                                                                    <div className="w-10 h-10 bg-[#e0cdad] rounded-xl flex items-center justify-center text-[#7e6034] text-lg"><i className="fas fa-shopping-bag"></i></div>
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-serif text-4xl text-[#7e6034] font-bold mb-2">{orders.filter(o => o.status < 4).length}</h3>
                                                                    <p className="text-[10px] text-gray-500 font-medium">Dalam berbagai tahap pengerjaan</p>
                                                                </div>
                                                            </div>
                                                            <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                                                                <div className="flex justify-between items-start mb-4">
                                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Estimasi Pendapatan Selesai</span>
                                                                    <div className="w-10 h-10 bg-hanania-lightpink rounded-xl flex items-center justify-center text-hanania-pink text-lg"><i className="fas fa-wallet"></i></div>
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-sans text-xl md:text-2xl text-hanania-pink font-bold mb-2">
                                                                        Rp {orders.filter(o => o.status === 4).reduce((sum, o) => sum + o.price, 0).toLocaleString('id-ID')}
                                                                    </h3>
                                                                    <p className="text-[10px] text-gray-500 font-medium">Dari {orders.filter(o => o.status === 4).length} pesanan selesai</p>
                                                                </div>
                                                            </div>
                                                            <div className="bg-red-100 p-5 md:p-6 rounded-2xl border border-red-200 shadow-sm flex flex-col justify-between sm:col-span-2 lg:col-span-1">
                                                                <div className="flex justify-between items-start mb-4">
                                                                    <span className="text-[10px] font-bold text-red-700 uppercase tracking-widest">Peringatan Stok</span>
                                                                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white text-lg"><i className="fas fa-exclamation-triangle"></i></div>
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-serif text-4xl text-red-700 font-bold mb-3">{enrichedStocks.filter(s => s.status === 'Kritis' || s.status === 'Menipis').length}</h3>
                                                                    <ul className="text-[10px] text-red-700 font-bold space-y-1">
                                                                        {enrichedStocks.filter(s => s.status === 'Kritis' || s.status === 'Menipis').slice(0, 2).map(s => (
                                                                            <li key={s.id}>&bull; {s.name} (Sisa: {s.qty})</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Chart.js Container */}
                                                        <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-10">
                                                            <h3 className="font-serif text-lg md:text-xl font-bold text-gray-800">Statistik Pesanan (7 Hari Terakhir)</h3>
                                                            <DashboardChart />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* TAB: MANAJEMEN STOK */}
                                                {internalTab === 'stock' && (
                                                    <div className="animate-fade-in max-w-5xl mx-auto">
                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                                                            <div>
                                                                <h2 className="text-2xl md:text-3xl font-serif text-hanania-admintxt mb-1 font-bold">Manajemen Stok</h2>
                                                                <p className="text-xs md:text-sm text-gray-500 font-medium">Pantau ketersediaan bahan baku dan perlengkapan florist.</p>
                                                            </div>
                                                            <button onClick={() => setShowAddStock(!showAddStock)} className="bg-hanania-darkgreen hover:bg-hanania-green text-white px-4 md:px-5 py-2.5 md:py-3 rounded-lg text-[10px] md:text-xs font-bold transition-colors flex items-center gap-2 uppercase tracking-wider shadow-sm flex-shrink-0">
                                                                <i className={`fas ${showAddStock ? 'fa-times' : 'fa-plus'}`}></i> {showAddStock ? 'Batal' : 'Tambah Stok'}
                                                            </button>
                                                        </div>

                                                        {showAddStock && (
                                                            <div className="bg-white p-5 md:p-8 rounded-2xl border border-hanania-darkgreen/20 shadow-sm mb-8 animate-fade-in">
                                                                <h3 className="font-bold text-hanania-darkgreen mb-5 border-b border-gray-100 pb-3 uppercase tracking-wider text-sm">Pencatatan Bahan Baku Baru</h3>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-5">
                                                                    <div className="sm:col-span-2">
                                                                        <label className="block text-[10px] md:text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Nama Bahan / Item</label>
                                                                        <input type="text" value={stockName} onChange={e => setStockName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-xs focus:border-hanania-darkgreen focus:outline-none bg-gray-50" placeholder="Cth: Pita Satin Maroon" />
                                                                    </div>
                                                                    <div className="sm:col-span-2">
                                                                        <label className="block text-[10px] md:text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Kategori</label>
                                                                        <select value={stockCat} onChange={e => setStockCat(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-xs focus:border-hanania-darkgreen focus:outline-none bg-gray-50">
                                                                            <option>Bunga Segar</option><option>Kertas Wrapping</option><option>Pita & Aksesoris</option><option>Perlengkapan</option>
                                                                        </select>
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[10px] md:text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Jumlah (Qty)</label>
                                                                        <input type="number" value={stockQty} onChange={e => setStockQty(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-xs focus:border-hanania-darkgreen focus:outline-none bg-gray-50" placeholder="0" />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-[10px] md:text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Satuan</label>
                                                                        <input type="text" value={stockUnit} onChange={e => setStockUnit(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-xs focus:border-hanania-darkgreen focus:outline-none bg-gray-50" placeholder="Cth: Roll, Ikat" />
                                                                    </div>
                                                                    <div className="sm:col-span-2">
                                                                        <label className="block text-[10px] md:text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Status Awal</label>
                                                                        <select value={stockStatus} onChange={e => setStockStatus(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-xs focus:border-hanania-darkgreen focus:outline-none bg-gray-50">
                                                                            <option>Aman</option><option>Menipis</option><option>Kritis</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-end">
                                                                    <button onClick={handleSaveStock} className="bg-hanania-darkgreen text-white px-6 py-2.5 rounded-lg text-xs font-bold hover:bg-hanania-green transition-colors uppercase tracking-wider shadow-sm">Simpan Data</button>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                                            <div className="overflow-x-auto">
                                                                <table className="w-full text-left border-collapse min-w-[700px]">
                                                                    <thead>
                                                                        <tr className="bg-gray-50 border-b border-gray-100 text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                                                            <th className="p-4 md:p-5">Nama Bahan</th><th className="p-4 md:p-5">Kategori</th><th className="p-4 md:p-5">Sisa Stok</th><th className="p-4 md:p-5">Status</th><th className="p-4 md:p-5 text-right">Aksi</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="text-xs md:text-sm">
                                                                        {enrichedStocks.map(s => (
                                                                            <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                                                <td className="p-4 md:p-5 flex items-center gap-4">
                                                                                    <span className="font-bold text-gray-800">{s.name}</span>
                                                                                </td>
                                                                                <td className="p-4 md:p-5 text-gray-500 font-medium">{s.category}</td>
                                                                                <td className="p-4 md:p-5"><span className="font-bold text-gray-800 text-base">{s.qty}</span> <span className="text-[10px] text-gray-400">{s.unit}</span></td>
                                                                                <td className="p-4 md:p-5">
                                                                                    <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center w-max gap-1.5 ${s.status === 'Aman' ? 'bg-[#E4EACD] text-[#4A5D3F]' : s.status === 'Menipis' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-red-100 text-red-700'}`}>
                                                                                        <div className={`w-1.5 h-1.5 rounded-full ${s.status === 'Aman' ? 'bg-[#4A5D3F]' : 'bg-red-600'}`}></div> {s.status}
                                                                                    </span>
                                                                                </td>
                                                                                <td className="p-4 md:p-5 text-right"><button onClick={() => setSelectedStock(s)} className="text-gray-400 hover:text-[#8d6a3b] transition"><i className="fas fa-pen"></i></button></td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>

                                                        {selectedStock && (
                                                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                                                                <div className="bg-white p-6 md:p-8 rounded-2xl w-full max-w-md shadow-xl relative animate-fade-in">
                                                                    <button onClick={() => setSelectedStock(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><i className="fas fa-times"></i></button>
                                                                    <h3 className="font-serif text-xl font-bold text-hanania-darkgreen mb-2">Update Stok: {selectedStock.name}</h3>
                                                                    <p className="text-xs text-gray-500 mb-6">Sisa stok saat ini: <span className="font-bold text-gray-800">{selectedStock.qty} {selectedStock.unit}</span></p>
                                                                    
                                                                    <div className="space-y-4">
                                                                        <div>
                                                                            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Jenis Transaksi</label>
                                                                            <div className="flex gap-2">
                                                                                <button onClick={() => setStockActionType('masuk')} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all border ${stockActionType === 'masuk' ? 'bg-hanania-darkgreen text-white border-hanania-darkgreen' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}><i className="fas fa-arrow-down mr-1"></i> Masuk</button>
                                                                                <button onClick={() => setStockActionType('keluar')} className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all border ${stockActionType === 'keluar' ? 'bg-red-500 text-white border-red-500' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}><i className="fas fa-arrow-up mr-1"></i> Keluar</button>
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Jumlah</label>
                                                                            <input type="number" min="1" value={stockActionQty} onChange={(e) => setStockActionQty(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-hanania-darkgreen focus:outline-none bg-gray-50" placeholder="Cth: 10" />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Keterangan (Opsional)</label>
                                                                            <textarea value={stockActionNote} onChange={(e) => setStockActionNote(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-hanania-darkgreen focus:outline-none bg-gray-50" placeholder="Cth: Dipakai untuk pesanan HN-xxx" rows="2"></textarea>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="mt-8 flex justify-between items-center pt-5 border-t border-gray-100">
                                                                        <button onClick={() => handleDeleteStock(selectedStock.id)} className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-2"><i className="fas fa-trash"></i> Hapus Item</button>
                                                                        <div className="flex gap-2">
                                                                            <button onClick={() => setSelectedStock(null)} className="px-5 py-2.5 rounded-lg text-xs font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors uppercase tracking-wider">Batal</button>
                                                                            <button onClick={handleUpdateStock} className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-hanania-darkgreen hover:bg-hanania-green transition-colors uppercase tracking-wider shadow-sm">Simpan</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                { }
                                                {internalTab === 'reports' && (
                                                    <div className="animate-fade-in max-w-full mx-auto">
                                                        <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-6 md:mb-8 gap-4">
                                                            <div>
                                                                <h2 className="text-2xl md:text-3xl font-serif text-hanania-admintxt mb-1 font-bold">Laporan Terkategori</h2>
                                                                <p className="text-xs md:text-sm text-gray-500 font-medium">Laporan Penjualan, Log Stok, dan Ulasan Pelanggan.</p>
                                                            </div>
                                                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                                                <button onClick={() => setReportTab('penjualan')} className={`px-4 py-2 text-xs font-bold uppercase rounded-md transition-all ${reportTab==='penjualan'?'bg-white text-hanania-darkgreen shadow-sm':'text-gray-500'}`}>Penjualan</button>
                                                                <button onClick={() => setReportTab('stok')} className={`px-4 py-2 text-xs font-bold uppercase rounded-md transition-all ${reportTab==='stok'?'bg-white text-hanania-darkgreen shadow-sm':'text-gray-500'}`}>Log Stok</button>
                                                                <button onClick={() => setReportTab('ulasan')} className={`px-4 py-2 text-xs font-bold uppercase rounded-md transition-all ${reportTab==='ulasan'?'bg-white text-hanania-darkgreen shadow-sm':'text-gray-500'}`}>Ulasan</button>
                                                            </div>
                                                        </div>

                                                        {reportTab === 'penjualan' && (
                                                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-10 overflow-hidden animate-fade-in">
                                                                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                                                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider"><i className="fas fa-history mr-2 text-hanania-pink"></i>Data Transaksi Pesanan (Semua Status)</h3>
                                                                    <span className="text-[10px] font-bold bg-white border border-gray-200 px-3 py-1 rounded-full text-gray-500">Total: {orders.length} Data</span>
                                                                </div>
                                                                <div className="overflow-x-auto max-h-96 hide-scroll">
                                                                    <table className="w-full text-left border-collapse min-w-[900px] relative">
                                                                        <thead className="sticky top-0 bg-gray-100/90 backdrop-blur">
                                                                            <tr className="border-b border-gray-200 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
                                                                                <th className="p-4">Tgl Buat</th>
                                                                                <th className="p-4">ID Pesanan</th>
                                                                                <th className="p-4">Pelanggan</th>
                                                                                <th className="p-4">Produk</th>
                                                                                <th className="p-4">Nilai Rp</th>
                                                                                <th className="p-4">Status Akhir</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="text-xs md:text-sm">
                                                                            {orders.map(o => (
                                                                                <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                                                    <td className="p-4 font-medium text-gray-500 whitespace-nowrap">{o.date}</td>
                                                                                    <td className="p-4 font-bold text-gray-800">{o.id}</td>
                                                                                    <td className="p-4 font-bold text-gray-700">{o.customer}</td>
                                                                                    <td className="p-4 text-gray-600">{o.product}</td>
                                                                                    <td className="p-4 font-bold text-hanania-pink whitespace-nowrap">Rp {o.price.toLocaleString('id-ID')}</td>
                                                                                    <td className="p-4">
                                                                                        <span className="text-[10px] font-bold uppercase tracking-wider">{statusSteps ? statusSteps[o.status] : o.status}</span>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                                <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
                                                                    <p className="text-sm font-bold text-gray-800 uppercase tracking-widest">Total Nilai Semua Pesanan: <span className="text-hanania-pink ml-2">Rp {orders.reduce((sum, o) => sum + o.price, 0).toLocaleString('id-ID')}</span></p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {reportTab === 'stok' && (
                                                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in mb-10">
                                                                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                                                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider"><i className="fas fa-boxes-stacked mr-2 text-hanania-darkgreen"></i>Log Keluar/Masuk Stok</h3>
                                                                </div>
                                                                <div className="overflow-x-auto max-h-96 hide-scroll">
                                                                    <table className="w-full text-left border-collapse min-w-[700px] relative">
                                                                        <thead className="sticky top-0 bg-gray-100/90 backdrop-blur">
                                                                            <tr className="border-b border-gray-200 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
                                                                                <th className="p-4">Tanggal</th>
                                                                                <th className="p-4">Item</th>
                                                                                <th className="p-4">Jenis</th>
                                                                                <th className="p-4 text-right">Qty</th>
                                                                                <th className="p-4">Keterangan</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="text-xs md:text-sm">
                                                                            {(stockLogs || []).map(l => (
                                                                                <tr key={l.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                                                    <td className="p-4 text-gray-500 font-medium">{l.date}</td>
                                                                                    <td className="p-4 font-bold text-gray-800">{l.name}</td>
                                                                                    <td className="p-4">
                                                                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${l.type === 'masuk' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{l.type}</span>
                                                                                    </td>
                                                                                    <td className="p-4 font-bold text-right">{l.qty}</td>
                                                                                    <td className="p-4 text-gray-500 italic">{l.note}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {reportTab === 'ulasan' && (
                                                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in mb-10">
                                                                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                                                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider"><i className="fas fa-star mr-2 text-hanania-gold"></i>Data Ulasan Pelanggan</h3>
                                                                </div>
                                                                <div className="overflow-x-auto max-h-96 hide-scroll">
                                                                    <table className="w-full text-left border-collapse min-w-[700px] relative">
                                                                        <thead className="sticky top-0 bg-gray-100/90 backdrop-blur">
                                                                            <tr className="border-b border-gray-200 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
                                                                                <th className="p-4">Pelanggan</th>
                                                                                <th className="p-4">Order ID</th>
                                                                                <th className="p-4">Rating</th>
                                                                                <th className="p-4">Ulasan</th>
                                                                                <th className="p-4">Tampil di Beranda</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="text-xs md:text-sm">
                                                                            {(reviews || []).map(r => (
                                                                                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                                                    <td className="p-4 font-bold text-gray-800">{r.customer}</td>
                                                                                    <td className="p-4 font-medium text-gray-500">{r.order_id}</td>
                                                                                    <td className="p-4 text-hanania-gold text-xs">
                                                                                        {[...Array(r.rating)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                                                                                    </td>
                                                                                    <td className="p-4 text-gray-600 italic">"{r.text}"</td>
                                                                                    <td className="p-4 text-center">
                                                                                        {r.isFeatured ? <i className="fas fa-check-circle text-hanania-pink"></i> : <i className="fas fa-minus text-gray-300"></i>}
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        );
                                        };

            return (
                <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
                    <AdminTopNav />
                    <main className="flex-grow">
                        {adminNav === 'home_edit' && <EditHome />}
                        {adminNav === 'catalog_edit' && <EditCatalog />}
                        {adminNav === 'orders' && <ActiveOrders />}
                        {adminNav === 'internal' && <InternalArea />}
                    </main>
                </div>
            );
        };

        const App = () => {
            const [role, setRole] = React.useState('public');
            const [activeView, setActiveView] = React.useState('home');
            
            const [products, setProductsState] = React.useState(() => getStorage('hanania_products', initialProducts));
            const [orders, setOrdersState] = React.useState(() => getStorage('hanania_orders', initialOrders));
            const [stocks, setStocksState] = React.useState(() => getStorage('hanania_stocks', initialStocks));
            const [stockLogs, setStockLogsState] = React.useState(() => getStorage('hanania_stock_logs', initialStockLogs));
            const [reviews, setReviewsState] = React.useState(() => getStorage('hanania_reviews', initialReviews));

            const setProducts = (valOrFn) => {
                setProductsState(prev => {
                    const next = typeof valOrFn === 'function' ? valOrFn(prev) : valOrFn;
                    setStorage('hanania_products', next);
                    return next;
                });
            };
            const setOrders = (valOrFn) => {
                setOrdersState(prev => {
                    const next = typeof valOrFn === 'function' ? valOrFn(prev) : valOrFn;
                    setStorage('hanania_orders', next);
                    return next;
                });
            };
            const setStocks = (valOrFn) => {
                setStocksState(prev => {
                    const next = typeof valOrFn === 'function' ? valOrFn(prev) : valOrFn;
                    setStorage('hanania_stocks', next);
                    return next;
                });
            };
            const setStockLogs = (valOrFn) => {
                setStockLogsState(prev => {
                    const next = typeof valOrFn === 'function' ? valOrFn(prev) : valOrFn;
                    setStorage('hanania_stock_logs', next);
                    return next;
                });
            };
            const setReviews = (valOrFn) => {
                setReviewsState(prev => {
                    const next = typeof valOrFn === 'function' ? valOrFn(prev) : valOrFn;
                    setStorage('hanania_reviews', next);
                    return next;
                });
            };
            
            React.useEffect(() => {
                const fetchData = async () => {
                    if (!API_BASE) return;
                    try {
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 2500);

                        const [pRes, oRes, sRes, slRes, rRes] = await Promise.all([
                            fetch(`${API_BASE}/api/products`, { signal: controller.signal }),
                            fetch(`${API_BASE}/api/orders`, { signal: controller.signal }),
                            fetch(`${API_BASE}/api/stocks`, { signal: controller.signal }),
                            fetch(`${API_BASE}/api/stock_logs`, { signal: controller.signal }),
                            fetch(`${API_BASE}/api/reviews`, { signal: controller.signal })
                        ]);
                        clearTimeout(timeoutId);

                        if(pRes.ok) {
                            const pData = await pRes.json();
                            if (pData && pData.length > 0) setProducts(pData);
                        }
                        if(oRes.ok) {
                            const oData = await oRes.json();
                            if (oData && oData.length > 0) setOrders(oData);
                        }
                        if(sRes.ok) {
                            const sData = await sRes.json();
                            if (sData && sData.length > 0) setStocks(sData);
                        }
                        if(slRes.ok) {
                            const slData = await slRes.json();
                            if (slData && slData.length > 0) setStockLogs(slData);
                        }
                        if(rRes.ok) {
                            const rData = await rRes.json();
                            if (rData && rData.length > 0) setReviews(rData);
                        }
                    } catch (e) {
                        console.info("Backend API offline / running in standalone mode with local storage.");
                    }
                };
                fetchData();
            }, []);

            const LoginView = ({ setRole }) => {
                const [username, setUsername] = React.useState("");
                const [password, setPassword] = React.useState("");
                const [error, setError] = React.useState("");
                const [failCount, setFailCount] = React.useState(0);
                const [isKickedOut, setIsKickedOut] = React.useState(false);

                const handleLogin = async (e) => {
                    e.preventDefault();
                    setError("");
                    
                    let loginOk = false;
                    if (API_BASE) {
                        try {
                            const res = await fetch(`${API_BASE}/api/login`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ username, password })
                            });
                            if (res.ok) loginOk = true;
                        } catch (e) {
                            console.warn("Backend login failed or offline, fallback to local credentials", e);
                        }
                    }

                    // Fallback to local admin credentials (guarantees login works on Vercel without backend)
                    if (!loginOk && username === "tyarahmawati" && password === "244466666") {
                        loginOk = true;
                    }

                    if (loginOk) {
                        setRole('admin');
                    } else {
                        const newFailCount = failCount + 1;
                        setFailCount(newFailCount);
                        if (newFailCount >= 3) {
                            setIsKickedOut(true);
                            setTimeout(() => setRole('public'), 4000);
                        } else {
                            setError(`Username atau Password salah. (Sisa percobaan: ${3 - newFailCount})`);
                        }
                    }
                };

                if (isKickedOut) {
                    return (
                        <div className="min-h-screen bg-red-950 flex flex-col justify-center items-center p-4">
                            <div className="text-center animate-bounce">
                                <i className="fas fa-user-ninja text-6xl text-white mb-6 animate-pulse"></i>
                                <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-widest drop-shadow-lg">Kamu Ditendang!</h2>
                                <p className="text-xl text-red-200 font-bold">Kamu ditendang karena kamu bukan admin.</p>
                            </div>
                        </div>
                    );
                }

                return (
                    <div className="min-h-screen bg-hanania-adminbg flex flex-col justify-center items-center p-4">
                        <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in relative pt-12">
                            <button onClick={() => setRole('public')} className="absolute top-4 left-4 text-gray-400 hover:text-gray-800 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"><i className="fas fa-arrow-left"></i> Kembali</button>
                            <button onClick={() => setRole('public')} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><i className="fas fa-times"></i></button>
                            
                            <div className="text-center mb-8">
                                <h2 className="font-serif text-3xl font-bold text-hanania-darkgreen mb-2">Login Admin</h2>
                                <p className="text-xs text-gray-500 font-medium">Silakan masuk ke panel dasbor Hanania Florist.</p>
                            </div>
                            
                            {error && <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-lg mb-6 text-center">{error}</div>}
                            
                            <form onSubmit={handleLogin} className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Username</label>
                                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-hanania-darkgreen focus:outline-none bg-gray-50" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-hanania-darkgreen focus:outline-none bg-gray-50" />
                                </div>
                                <button type="submit" className="w-full bg-hanania-darkgreen text-white py-3.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-hanania-green transition-colors mt-4">Masuk Panel</button>
                            </form>
                        </div>
                    </div>
                );
            };

            return (
                role === 'admin' ? 
                    <AdminView setRole={setRole} products={products} setProducts={setProducts} orders={orders} setOrders={setOrders} stocks={stocks} setStocks={setStocks} stockLogs={stockLogs} setStockLogs={setStockLogs} reviews={reviews} setReviews={setReviews} />
                : role === 'login' ?
                    <LoginView setRole={setRole} />
                :
                    <PublicView activeView={activeView} setActiveView={setActiveView} setRole={setRole} products={products} orders={orders} reviews={reviews} setReviews={setReviews} />
            );
        };

export default App;
