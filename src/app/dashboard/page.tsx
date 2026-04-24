"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { logout } from "@/app/actions/auth";
import { 
  getDashboardData, 
  updateStore, 
  addProduct, 
  deleteProduct,
  updateProduct 
} from "@/app/actions/dashboard";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Store as StoreIcon, 
  Eye, 
  LogOut,
  Copy,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  Upload,
  X,
  QrCode,
  Download,
  Loader2,
  ShieldCheck
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [timeFilter, setTimeFilter] = useState("This Week");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [greeting, setGreeting] = useState("Good Morning");
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    console.log("Dashboard mounted, fetching data...");
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("Loading timed out, showing empty state");
        setLoading(false);
        setStoreData({ name: "", products: [], visits: [] });
      }
    }, 10000);

    async function loadData(isInitial = false) {
      try {
        const res = await getDashboardData();
        if (res.success && res.store) {
          setStoreData(res.store);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        if (isInitial) setLoading(false);
      }
    }
    loadData(true);

    // Auto-refresh every 30 seconds for "real-time" feel
    const interval = setInterval(() => loadData(false), 30000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const handleCopy = () => {
    if (!storeData?.url) return;
    // Use the actual origin (localhost:3000 or lokl.in)
    const origin = window.location.origin;
    const fullUrl = `${origin}/${storeData.url}`;
    
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    showToast("Store URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (formData: FormData) => {
    setIsSaving(true);
    try {
      const res = await updateStore(formData);
      if (res.success) {
        setIsModalOpen(false);
        showToast("Store details saved successfully!");
        // Refresh data
        const { store } = await getDashboardData();
        setStoreData(store);
      } else {
        showToast(res.error || "Error saving changes.", 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleProductSubmit = async (formData: FormData) => {
    setIsSaving(true);
    try {
      let res;
      const isEditing = !!editingProduct;
      if (isEditing) {
        formData.append("id", editingProduct.id);
        formData.append("currentImageUrl", editingProduct.imageUrl || "");
        res = await updateProduct(formData);
      } else {
        res = await addProduct(formData);
      }

      if (res.success) {
        setIsModalOpen(false);
        setEditingProduct(null);
        showToast(isEditing ? "Product updated successfully!" : "New product added to your store!");
        const { store } = await getDashboardData();
        setStoreData(store);
      } else {
        showToast(res.error || "Error processing product.", 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setIsDeletingId(id);
      try {
        const res = await deleteProduct(id);
        if (res.success) {
          showToast("Product removed from your store.");
          const { store } = await getDashboardData();
          setStoreData(store);
        } else {
          showToast("Failed to delete product.", 'error');
        }
      } finally {
        setIsDeletingId(null);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const getVisitStats = () => {
    if (!storeData?.visits) return { count: 0, points: [] };
    
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfThisWeek = startOfToday - (now.getDay() * 24 * 60 * 60 * 1000);
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let filteredVisits = storeData.visits;
    if (timeFilter === "Today") {
      filteredVisits = storeData.visits.filter((v: any) => new Date(v.timestamp).getTime() >= startOfToday);
    } else if (timeFilter === "This Week") {
      filteredVisits = storeData.visits.filter((v: any) => new Date(v.timestamp).getTime() >= startOfThisWeek);
    } else if (timeFilter === "This Month") {
      filteredVisits = storeData.visits.filter((v: any) => new Date(v.timestamp).getTime() >= startOfThisMonth);
    }

    return {
      count: filteredVisits.length,
      points: [] // Points are handled by the SVG logic below
    };
  };

  const currentStats = getVisitStats();

  const generatePath = (points: number[]) => {
    const width = 400;
    const height = 100;
    const step = width / (points.length - 1);
    const max = Math.max(...points) * 1.2;
    
    return points.reduce((path, p, i) => {
      const x = i * step;
      const y = height - (p / max) * height;
      return i === 0 ? `M${x},${y}` : `${path} L${x},${y}`;
    }, "");
  };

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Products", icon: <ShoppingCart size={20} /> },
    { name: "Store", icon: <StoreIcon size={20} /> },
    { name: "Total Visits", icon: <Eye size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#1F1101] flex flex-col md:flex-row font-playfair selection:bg-[#F8F7F5] selection:text-[#1F1101]">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 p-6 justify-between shrink-0">
        <div>
          {/* White Logo */}
          <div className="mb-12">
            <Image 
              src="/white-logo.png" 
              alt="Lokl Logo" 
              width={120} 
              height={40} 
              className="object-contain"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>

          {/* Nav Items */}
          <nav className="space-y-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all active:scale-95 ${
                  activeTab === item.name 
                    ? "text-white font-bold" 
                    : "text-white/70 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="text-lg">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 w-full bg-white text-[#1F1101] px-4 py-3 rounded-xl font-bold hover:bg-gray-100 active:scale-95 transition-all"
        >
          <span>Logout</span>
        </button>
      </aside>

      {/* Mobile Header (replaces Sidebar on small screens) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#1F1101]">
        <Image 
          src="/white-logo.png" 
          alt="Lokl Logo" 
          width={100} 
          height={32} 
          className="object-contain"
          style={{ width: 'auto', height: 'auto' }}
        />
        <button 
          onClick={handleLogout}
          className="text-white/70 hover:text-white p-2"
        >
          <LogOut size={24} />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header area (above white box) */}
        <div className="px-6 md:px-10 py-6 shrink-0">
          <h1 className="text-white text-2xl md:text-3xl font-bold tracking-wide">
            {greeting}, {storeData?.user?.name || "Store Owner"}
          </h1>
        </div>

        {/* White Container */}
        <div className="flex-1 bg-white rounded-t-[2rem] md:rounded-tl-[2.5rem] md:rounded-tr-none p-6 md:p-10 lg:p-12 overflow-y-auto pb-32 md:pb-12">
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F1101]"></div>
            </div>
          ) : (
          <div className="w-full space-y-6">
            
            {activeTab === "Dashboard" && (
              <>
                {/* Top Store Info Card */}
                <div className="bg-[#F8F7F5] rounded-3xl p-8 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <StoreIcon size={32} className="text-[#1F1101]" />
                    <h2 className="text-3xl font-bold text-[#1F1101]">{storeData?.name || "Your Store"}</h2>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-8 text-[#1F1101]/60 font-sans">
                    <a 
                      href={storeData?.url ? `/${storeData.url}` : "#"} 
                      target="_blank" 
                      className="truncate max-w-[200px] sm:max-w-md lg:max-w-none hover:text-[#1F1101] underline decoration-dotted"
                    >
                      {storeData?.url ? `${typeof window !== 'undefined' ? window.location.host : 'localhost:3000'}/${storeData.url}` : "Setting up your link..."}
                    </a>
                    <button 
                      onClick={handleCopy}
                      className={`p-1 transition-all duration-200 ${copied ? "text-green-600 scale-110" : "hover:text-[#1F1101]"}`}
                      title={copied ? "Copied!" : "Copy URL"}
                    >
                      {copied ? <div className="flex items-center gap-1"><span className="text-[10px] font-bold">Copied!</span></div> : <Copy size={18} />}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button 
                      onClick={handleCopy}
                      className="bg-[#1F1101] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0f0800] active:scale-95 transition-all shadow-md flex items-center gap-2"
                    >
                      {copied ? "Link Copied!" : "Share Store"}
                    </button>
                    <button 
                      onClick={() => {
                        if (storeData?.url) {
                          window.open(`/${storeData.url}`, "_blank");
                        } else {
                          alert("Please save your store details first!");
                        }
                      }}
                      className="bg-[#1F1101] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0f0800] active:scale-95 transition-all shadow-md"
                    >
                      View Store
                    </button>
                    <button 
                      onClick={() => {
                        if (storeData?.phoneNumber) {
                          window.location.href = `tel:${storeData.phoneNumber}`;
                        } else {
                          alert("Please add a phone number in the Store settings first!");
                        }
                      }}
                      className="bg-[#1F1101] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0f0800] active:scale-95 transition-all shadow-md"
                    >
                      Test Call Button
                    </button>
                    <button 
                      onClick={() => setShowQrModal(true)}
                      className="bg-[#1F1101] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0f0800] active:scale-95 transition-all shadow-md flex items-center gap-2"
                    >
                      <QrCode size={20} />
                      Generate QR
                    </button>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#F8F7F5] rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <ShoppingCart size={28} className="text-[#1F1101]" />
                      <h3 className="text-2xl font-bold text-[#1F1101]">Total Products</h3>
                    </div>
                    <p className="text-6xl font-bold text-[#1F1101]">{storeData?.products?.length || 0}</p>
                  </div>

                  <div className="bg-[#F8F7F5] rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <Plus size={28} className="text-[#1F1101]" />
                      <h3 className="text-2xl font-bold text-[#1F1101]">New Products</h3>
                    </div>
                    <p className="text-6xl font-bold text-[#1F1101]">
                      {storeData?.products?.filter((p: any) => new Date(p.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length || 0}
                    </p>
                    <p className="text-sm text-gray-400 mt-2 font-sans italic">Added this week</p>
                  </div>

                  <div className="bg-[#F8F7F5] rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <Eye size={28} className="text-[#1F1101]" />
                      <h3 className="text-2xl font-bold text-[#1F1101]">Total Store Visits</h3>
                    </div>
                    <p className="text-6xl font-bold text-[#1F1101]">{storeData?.visits?.length || 0}</p>
                  </div>

                  <div className="bg-[#F8F7F5] rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <ShoppingCart size={28} className="text-[#1F1101]" />
                      <h3 className="text-2xl font-bold text-[#1F1101]">Potential Sales</h3>
                    </div>
                    <p className="text-6xl font-bold text-[#1F1101]">
                      ₹ {storeData?.products?.reduce((acc: number, p: any) => acc + p.price, 0).toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-gray-400 mt-2 font-sans italic">Total inventory value</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Products" && (
              <>
                <div className="bg-[#F8F7F5] rounded-3xl p-8 shadow-sm flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <ShoppingCart size={28} className="text-[#1F1101]" />
                      <h3 className="text-2xl font-bold text-[#1F1101]">Products</h3>
                    </div>
                    <p className="text-5xl font-bold text-[#1F1101]">{storeData?.products?.length || 0} <span className="text-3xl font-medium">Items</span></p>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingProduct(null);
                      setIsModalOpen(true);
                    }}
                    className="bg-[#1F1101] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0f0800] active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Add Products
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {storeData?.products?.length > 0 ? storeData.products.map((product: any) => (
                    <div key={product.id} className="bg-[#F8F7F5] rounded-[2rem] p-4 flex flex-col gap-4 shadow-sm">
                      <div className="aspect-square bg-white rounded-2xl overflow-hidden flex items-center justify-center p-4">
                        <img 
                          src={product.imageUrl || "/product-1.png"} 
                          alt={product.name} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop";
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-2xl font-bold text-[#1F1101]">{product.name}</h4>
                        <p className="text-xl text-[#1F1101]/60">₹ {product.price}</p>
                        <p className="text-sm text-gray-400 font-sans line-clamp-2">
                          {product.description || "No description provided."}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <button 
                          onClick={() => {
                            setEditingProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="flex-1 bg-[#1F1101] text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#0f0800] active:scale-95 transition-all"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={isDeletingId === product.id}
                          className="ml-4 p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 active:scale-90 transition-all disabled:opacity-50"
                        >
                          {isDeletingId === product.id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full py-12 text-center text-gray-400 font-playfair text-xl">
                      No products added yet. Click "Add Products" to start!
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "Store" && (
              <div className="space-y-8">
                <div className="bg-[#F8F7F5] rounded-3xl p-8 shadow-sm">
                  <div className="flex items-center gap-4">
                    <StoreIcon size={32} className="text-[#1F1101]" />
                    <h2 className="text-3xl font-bold text-[#1F1101]">Your Store</h2>
                  </div>
                </div>

                <form action={handleSave} className="grid grid-cols-1 gap-8 max-w-2xl">
                  <div className="space-y-2">
                    <label className="text-lg font-bold text-[#1F1101]">Store name</label>
                    <input 
                      type="text" 
                      name="name"
                      defaultValue={storeData?.name || ""}
                      placeholder="Please enter Your store name" 
                      className="w-full p-4 rounded-xl border border-gray-200 font-sans focus:ring-2 focus:ring-[#1F1101] outline-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-lg font-bold text-[#1F1101]">Customer Call Number</label>
                    <input 
                      type="text" 
                      name="phoneNumber"
                      defaultValue={storeData?.phoneNumber || ""}
                      placeholder="Please enter Your Number" 
                      className="w-full p-4 rounded-xl border border-gray-200 font-sans focus:ring-2 focus:ring-[#1F1101] outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-lg font-bold text-[#1F1101]">Short description</label>
                    <textarea 
                      name="description"
                      defaultValue={storeData?.description || ""}
                      placeholder="Please enter Your store description" 
                      rows={4}
                      className="w-full p-4 rounded-xl border border-gray-200 font-sans focus:ring-2 focus:ring-[#1F1101] outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-lg font-bold text-[#1F1101]">Store Address</label>
                    <input 
                      type="text" 
                      name="address"
                      defaultValue={storeData?.address || ""}
                      placeholder="Please enter Your Number" 
                      className="w-full p-4 rounded-xl border border-gray-200 font-sans focus:ring-2 focus:ring-[#1F1101] outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="space-y-2">
                      <label className="text-lg font-bold text-[#1F1101] block">Upload Store Logo</label>
                      <input 
                        type="file" 
                        name="logo"
                        accept="image/*"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1F1101] file:text-white hover:file:bg-[#0f0800] transition-all cursor-pointer"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isSaving}
                      className="bg-[#1F1101] text-white px-12 py-3 rounded-xl font-bold hover:bg-[#0f0800] active:scale-95 transition-all shadow-lg self-end mb-1 flex items-center gap-2 disabled:opacity-70"
                    >
                      {isSaving && <Loader2 size={20} className="animate-spin" />}
                      {isSaving ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "Total Visits" && (
              <div className="space-y-6">
                <div className="bg-[#F8F7F5] rounded-3xl p-8 shadow-sm">
                  <div className="flex items-center gap-4">
                    <Eye size={32} className="text-[#1F1101]" />
                    <h2 className="text-3xl font-bold text-[#1F1101]">Total Store Visits</h2>
                  </div>
                </div>

                <div className="bg-[#F8F7F5] rounded-3xl p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-gray-400">
                      <ShoppingCart size={20} />
                      <span className="text-xs font-bold uppercase tracking-widest">Total Page Views</span>
                    </div>
                    <p className="text-8xl font-black text-[#1F1101] tracking-tighter">
                      {currentStats.count}
                    </p>
                  </div>
                  
                  <div className="relative group">
                    <select 
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="appearance-none bg-[#1F1101] text-white px-10 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-[#0f0800] outline-none cursor-pointer pr-12"
                    >
                      <option value="Today">Today</option>
                      <option value="This Week">This Week</option>
                      <option value="This Month">This Month</option>
                    </select>
                    <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
                  </div>
                </div>

                <div className="bg-[#F8F7F5] rounded-3xl p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h3 className="text-3xl font-bold text-[#1F1101]">Last 7 Days Traffic</h3>
                      <p className="text-sm text-gray-400 font-sans mt-1">Real-time visitor analytics</p>
                    </div>
                    <div className="px-4 py-1.5 bg-[#1F1101] text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">Live Data</div>
                  </div>
                  
                  <div className="w-full flex flex-col">
                    <div className="h-64 relative">
                      {(() => {
                        const visits = Array(7).fill(0);
                        const labels = [];
                        const now = new Date();
                        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                        for (let i = 6; i >= 0; i--) {
                          const d = new Date();
                          d.setDate(now.getDate() - i);
                          labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
                        }

                        storeData?.visits?.forEach((v: any) => {
                          const vDate = new Date(v.timestamp);
                          const startOfVDate = new Date(vDate.getFullYear(), vDate.getMonth(), vDate.getDate());
                          const diff = Math.floor((startOfToday.getTime() - startOfVDate.getTime()) / (1000 * 60 * 60 * 24));
                          if (diff >= 0 && diff < 7) visits[6 - diff]++;
                        });

                        const max = Math.max(...visits, 1);
                        // Adjust Y range to 0-180 to avoid clipping at the bottom (viewBox is 200)
                        const points = visits.map((v, i) => ({ x: i * 116.6, y: 180 - (v / (max * 1.2)) * 160 }));
                        const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(" ");
                        const fillData = `${pathData} L 700 200 L 0 200 Z`;

                        return (
                          <>
                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 200">
                              <defs>
                                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#1F1101" stopOpacity="0.1" />
                                  <stop offset="100%" stopColor="#1F1101" stopOpacity="0" />
                                </linearGradient>
                              </defs>

                              <path d={fillData} fill="url(#lineGradient)" className="transition-all duration-700" />
                              <path d={pathData} fill="none" stroke="#1F1101" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-700" />

                              {/* Hover Hotspots */}
                              {points.map((p, i) => (
                                <g key={i} onMouseEnter={() => setHoveredDay(i)} onMouseLeave={() => setHoveredDay(null)} className="cursor-pointer">
                                  <rect x={p.x - 50} y="0" width="100" height="200" fill="transparent" />
                                  <circle 
                                    cx={p.x} 
                                    cy={p.y} 
                                    r={hoveredDay === i ? 8 : 4} 
                                    fill={hoveredDay === i ? "#1F1101" : "white"} 
                                    stroke="#1F1101" 
                                    strokeWidth="3"
                                    className="transition-all duration-200"
                                  />
                                </g>
                              ))}
                            </svg>

                            {/* Tooltip */}
                            {hoveredDay !== null && (
                              <div 
                                className="absolute bg-[#1F1101] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl animate-in fade-in zoom-in duration-200 pointer-events-none z-50"
                                style={{ 
                                  left: `${(hoveredDay * 116.6 / 700) * 100}%`, 
                                  top: `${(points[hoveredDay].y / 200) * 100}%`,
                                  transform: 'translate(-50%, -130%)'
                                }}
                              >
                                {visits[hoveredDay]} visitors
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-8 border-transparent border-t-[#1F1101]" />
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>

                    {/* Day Labels - Now outside the fixed-height container to push the card's height */}
                    <div className="flex justify-between mt-12 border-t border-gray-200 pt-6">
                      {(() => {
                        const labels = [];
                        const now = new Date();
                        for (let i = 6; i >= 0; i--) {
                          const d = new Date();
                          d.setDate(now.getDate() - i);
                          labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
                        }
                        return labels.map((day, i) => (
                          <div key={i} className={`text-sm font-bold uppercase tracking-widest transition-colors ${hoveredDay === i ? "text-[#1F1101]" : "text-gray-400"}`}>
                            {day}
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
          )}
        </div>

      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#1F1101] border-t border-white/10 flex justify-around items-center p-3 z-50">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`flex flex-col items-center gap-1 p-2 transition-all active:scale-90 ${
              activeTab === item.name 
                ? "text-white" 
                : "text-white/60 hover:text-white"
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-sans font-medium">{item.name}</span>
          </button>
        ))}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 md:p-10">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-3xl font-bold text-[#1F1101]">{editingProduct ? "Edit Product" : "Add Products"}</h2>
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={28} className="text-[#1F1101]" />
                </button>
              </div>

              {/* Modal Form */}
              <form action={handleProductSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-lg font-bold text-[#1F1101]">Product name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    defaultValue={editingProduct?.name || ""}
                    placeholder="Please enter Your Product name" 
                    className="w-full p-4 rounded-xl border border-gray-200 font-sans focus:ring-2 focus:ring-[#1F1101] outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-bold text-[#1F1101]">Price</label>
                  <input 
                    type="number" 
                    name="price"
                    required
                    defaultValue={editingProduct?.price || ""}
                    placeholder="Please enter Your Product price" 
                    className="w-full p-4 rounded-xl border border-gray-200 font-sans focus:ring-2 focus:ring-[#1F1101] outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-bold text-[#1F1101]">Short description</label>
                  <textarea 
                    name="description"
                    defaultValue={editingProduct?.description || ""}
                    placeholder="Please enter Your Product description" 
                    rows={4}
                    className="w-full p-4 rounded-xl border border-gray-200 font-sans focus:ring-2 focus:ring-[#1F1101] outline-none resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-bold text-[#1F1101] block">Upload Product Photo</label>
                  {editingProduct?.imageUrl && (
                    <p className="text-xs text-gray-400 mb-2 font-sans italic">Current image exists. Upload new to replace.</p>
                  )}
                  <input 
                    type="file" 
                    name="image"
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1F1101] file:text-white hover:file:bg-[#0f0800] transition-all cursor-pointer"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#1F1101] text-white px-12 py-3 rounded-xl font-bold hover:bg-[#0f0800] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 min-w-[160px]"
                  >
                    {isSaving && <Loader2 size={20} className="animate-spin" />}
                    {isSaving ? "Processing..." : (editingProduct ? "Update Product" : "Save Product")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 text-center space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-[#1F1101]">Store QR Code</h2>
                <button 
                  onClick={() => setShowQrModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-[#1F1101]" />
                </button>
              </div>

              <div className="bg-[#F8F7F5] p-8 rounded-[2rem] flex items-center justify-center shadow-inner">
                {(() => {
                  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
                  const qrData = `${origin}/${storeData?.url}?source=qr`;
                  return (
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`}
                      alt="Store QR Code"
                      className="w-full h-auto rounded-xl"
                      id="store-qr-image"
                    />
                  );
                })()}
              </div>

              <div className="space-y-2">
                <p className="font-bold text-[#1F1101] text-lg">{storeData?.name}</p>
                <p className="text-sm text-gray-400 font-sans">Scan to visit store</p>
              </div>

              <button 
                onClick={() => {
                  const origin = window.location.origin;
                  const qrData = `${origin}/${storeData?.url}?source=qr`;
                  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrData)}`;
                  
                  // Fetch and download
                  fetch(qrUrl)
                    .then(res => res.blob())
                    .then(blob => {
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${storeData?.name || 'store'}-qr.png`;
                      a.click();
                      showToast("QR Code downloaded!");
                    });
                }}
                className="w-full bg-[#1F1101] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#0f0800] transition-all shadow-lg"
              >
                <Download size={20} />
                Download QR Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Toast Notification */}
      {toast && (
        <div className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md ${
            toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-[#1F1101] text-white'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/20`}>
              {toast.type === 'error' ? <X size={18} /> : <ShieldCheck size={18} />}
            </div>
            <p className="font-bold tracking-wide">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
