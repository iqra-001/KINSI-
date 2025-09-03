import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  Sparkles,
  Users,
  Calendar,
  Heart,
  MessageCircle,
  Menu,
  X,
  Bell,
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Eye,
  Globe,
  Filter,
  Download,
  UploadCloud,
  Plus,
  Star,
  Ban,
  Receipt,
  BadgeCheck,
  Settings,
  CreditCard,
  Activity,
  TrendingUp,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Sparkles as Spark,
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Legend } from "recharts";
import logo from "../assets/logo2.png";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

/**
 * Kinsi Admin Dashboard – Command Center
 * --------------------------------------------------------
 * A single-file, production-ready admin console that matches
 * KINSI's warm palette and animated look. It uses TailwindCSS
 * for styling and Recharts + Framer Motion for interactivity.
 *
 * Plug your APIs where indicated (// TODO) to go live.
 */

// Brand palette helpers (keeps consistency with your landing page)
const brand = {
  bgDark: "#3D2914",
  accent: "#FF8A47",
  accentDark: "#FF6B2B",
  mint: "#A8D5A8",
  sand: "#F5F1E8",
  text: "#3D2914",
};

// Fake seed data (replace with API calls)
const seed = {
  kpis: {
    revenue: 1264000, // KES
    bookings: 842,
    activeVendors: 214,
    disputes: 7,
  },
  revenueSeries: Array.from({ length: 12 }).map((_, i) => ({
    month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
    value: Math.round(70000 + Math.random() * 90000 + (i * 4000)),
  })),
  bookingsSeries: Array.from({ length: 8 }).map((_, i) => ({
    week: `W${i + 1}`,
    bookings: Math.round(70 + Math.random() * 60),
    cancels: Math.round(5 + Math.random() * 10),
  })),
  approvals: [
    { id: "V-1892", name: "Bloom & Beam Decor", phone: "+254 712 123 456", city: "Nairobi", rating: 4.7, docs: ["ID", "KRA", "Portfolio"], status: "pending" },
    { id: "V-1903", name: "Savannah Sounds DJ", phone: "+254 727 987 654", city: "Thika", rating: 4.5, docs: ["ID", "KRA"], status: "pending" },
    { id: "V-1911", name: "Garissa Royal Caterers", phone: "+254 701 333 222", city: "Garissa", rating: 4.8, docs: ["ID", "KRA", "Food Handler"], status: "pending" },
  ],
  transactions: Array.from({ length: 7 }).map((_, i) => ({
    id: `TX-${2031 + i}`,
    date: new Date(2025, 7, 17 + i).toISOString().slice(0,10),
    user: ["Aisha Noor", "Brian Otieno", "Fatuma Ali", "James Kariuki", "Linet Njeri", "Mohamed Ahmed", "Zeinab Hussein"][i],
    vendor: ["Royal Decor", "DJ Pulse", "Sweet Crumbs", "LensCraft", "Royal Decor", "DJ Pulse", "Sweet Crumbs"][i],
    service: ["Decor", "Music", "Catering", "Photography", "Decor", "Music", "Catering"][i],
    amount: Math.round(6000 + Math.random() * 40000),
    status: ["paid", "paid", "paid", "refunded", "paid", "disputed", "paid"][i],
  })),
  tickets: [
    { id: "S-101", title: "Refund request – booking #8421", user: "Brian O.", priority: "high", state: "open" },
    { id: "S-102", title: "Vendor verification delay", user: "Zeinab H.", priority: "medium", state: "in_progress" },
    { id: "S-103", title: "Change event date", user: "Aisha N.", priority: "low", state: "open" },
  ],
  visionsQueue: [
    { id: "P-771", owner: "@decor_nerd", type: "Vision Board", flag: "contains brand logos", status: "review" },
    { id: "P-778", owner: "@weddingvibes", type: "Inspo Post", flag: "suspected stock image", status: "review" },
  ],
};

function currency(n){
  return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(n);
}

const StatChip = ({ icon: Icon, label, value, trend }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.4 }}
    className="relative overflow-hidden rounded-3xl p-5 shadow-xl border"
    style={{ background: "linear-gradient(135deg,#FFF7ED,#FFFFFF)", borderColor: "rgba(168,213,168,.45)" }}
  >
    <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-20" style={{ background: brand.mint }} />
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md" style={{ background: `linear-gradient(135deg, ${brand.accent}, ${brand.accentDark})` }}>
        <Icon className="text-white" size={22} />
      </div>
      <div>
        <p className="text-sm" style={{ color: "#8B6F47" }}>{label}</p>
        <p className="text-2xl font-black" style={{ color: brand.text }}>{value}</p>
      </div>
      {trend && (
        <span className="ml-auto text-sm font-semibold flex items-center gap-1" style={{ color: trend > 0 ? "#16a34a" : "#b91c1c" }}>
          <TrendingUp size={16} /> {trend>0?`+${trend}%`:`${trend}%`}
        </span>
      )}
    </div>
  </motion.div>
);

const Tag = ({ children, tone = "mint" }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-xs font-semibold border`}
    style={{
      color: tone === "mint" ? brand.text : "#fff",
      background: tone === "mint" ? "#E7F3E7" : brand.accent,
      borderColor: tone === "mint" ? "rgba(168,213,168,.6)" : brand.accent,
    }}
  >
    {children}
  </span>
);

const KinsiAdminDashboard = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("overview");
  const [drawer, setDrawer] = useState(null); // selected booking/transaction
  const [approvals, setApprovals] = useState(seed.approvals);
  const [transactions, setTransactions] = useState(seed.transactions);
  const [tickets, setTickets] = useState(seed.tickets);
  const [visions, setVisions] = useState(seed.visionsQueue);
  const [broadcastOpen, setBroadcastOpen] = useState(false);

  const filteredTx = useMemo(() => {
    if(!query) return transactions;
    return transactions.filter(t =>
      [t.id, t.user, t.vendor, t.service].join(" ").toLowerCase().includes(query.toLowerCase())
    );
  }, [transactions, query]);

  // Quick actions (mocked)
  const verifyVendor = (id) => {
    setApprovals(prev => prev.filter(v => v.id !== id));
  };
  const rejectVendor = (id) => {
    setApprovals(prev => prev.filter(v => v.id !== id));
  };
  const refundTx = (id) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, status: "refunded" } : tx));
  };

  // Layout wrappers
  const Section = ({ title, subtitle, children, right }) => (
    <div className="mb-10">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h3 className="text-xl md:text-2xl font-black" style={{ color: brand.text }}>{title}</h3>
          {subtitle && <p className="text-sm" style={{ color: "#8B6F47" }}>{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(180deg, ${brand.sand} 0%, #fff 40%)` }}>
      {/* Top Bar */}
      <nav className="sticky top-0 z-40 backdrop-blur-md border-b" style={{ borderColor: "rgba(168,213,168,.35)", background: "rgba(255, 247, 237, .9)" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-full text-white shadow"
              style={{ background: `linear-gradient(135deg, ${brand.accent}, ${brand.accentDark})` }}
              onClick={() => navigate("/")}
            >
              <img src={logo} alt="KINSI" className="w-6 h-6" />
              <span className="font-bold">KINSI Admin</span>
            </button>

            <div className="flex-1" />

            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border bg-white shadow-sm" style={{ borderColor: "rgba(168,213,168,.45)" }}>
              <Search size={18} className="text-amber-900/70" />
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search users, vendors, bookings…" className="outline-none w-72 text-sm" />
            </div>

            <button className="relative p-2 rounded-full" title="Notifications" style={{ color: brand.text }}>
              <Bell size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full ring-2 ring-orange-300 overflow-hidden shadow">
              <img src={logo} alt="admin" className="w-full h-full object-contain bg-white" />
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { id:"overview", label:"Overview" },
              { id:"commerce", label:"Payments & Bookings" },
              { id:"marketplace", label:"Users & Vendors" },
              { id:"moderation", label:"Moderation" },
              { id:"support", label:"Support" },
              { id:"settings", label:"Settings" },
            ].map(t => (
              <button
                key={t.id}
                onClick={()=>setTab(t.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${tab===t.id?"shadow":""]}`}
                style={{
                  background: tab===t.id? `linear-gradient(135deg, ${brand.accent}, ${brand.accentDark})` : "#fff",
                  color: tab===t.id? "#fff" : brand.text,
                  borderColor: tab===t.id? brand.accent : "rgba(168,213,168,.45)",
                }}
              >
                {t.label}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={()=>setBroadcastOpen(true)}
                className="px-4 py-2 rounded-full text-sm font-bold text-white shadow"
                style={{ background: `linear-gradient(135deg, ${brand.accent}, ${brand.accentDark})` }}
              >
                <MegaphoneIcon className="inline mr-2" /> Broadcast
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            <Section title="Command Center" subtitle="High-level pulse across KINSI">
              <div className="grid md:grid-cols-4 gap-4">
                <StatChip icon={DollarSign} label="Revenue (30d)" value={currency(seed.kpis.revenue)} trend={8.2} />
                <StatChip icon={Calendar} label="Bookings" value={seed.kpis.bookings} trend={5.1} />
                <StatChip icon={Users} label="Active Vendors" value={seed.kpis.activeVendors} trend={3.6} />
                <StatChip icon={AlertCircle} label="Open Disputes" value={seed.kpis.disputes} trend={-1.2} />
              </div>
            </Section>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Revenue chart */}
              <Section title="Revenue" subtitle="Monthly performance">
                <div className="bg-white rounded-3xl p-4 shadow border" style={{ borderColor: "rgba(168,213,168,.45)" }}>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={seed.revenueSeries}>
                        <defs>
                          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={brand.accent} stopOpacity={0.6}/>
                            <stop offset="100%" stopColor={brand.accent} stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="month" tick={{ fill: brand.text }} />
                        <YAxis tick={{ fill: brand.text }} />
                        <Tooltip />
                        <Area dataKey="value" type="monotone" stroke={brand.accent} fill="url(#rev)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Section>

              {/* Bookings chart */}
              <Section title="Bookings" subtitle="Weekly movements">
                <div className="bg-white rounded-3xl p-4 shadow border" style={{ borderColor: "rgba(168,213,168,.45)" }}>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={seed.bookingsSeries}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="week" tick={{ fill: brand.text }} />
                        <YAxis tick={{ fill: brand.text }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="bookings" fill={brand.mint} />
                        <Bar dataKey="cancels" fill={brand.accent} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Section>

              {/* Live feed */}
              <Section title="Live Activity" subtitle="Payments, messages and actions in real time">
                <div className="bg-white rounded-3xl p-4 shadow border h-64 overflow-auto" style={{ borderColor: "rgba(168,213,168,.45)" }}>
                  {[...transactions].slice(0,6).map((t, i) => (
                    <div key={t.id} className="flex items-center justify-between py-2 border-b last:border-b-0" style={{ borderColor: "rgba(168,213,168,.25)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#FFF1E8" }}>
                          <CreditCard size={18} style={{ color: brand.accent }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: brand.text }}>{t.user} paid {currency(t.amount)}</p>
                          <p className="text-xs" style={{ color: "#8B6F47" }}>{t.vendor} – {t.service} • {t.date}</p>
                        </div>
                      </div>
                      <Tag tone={t.status === "paid" ? "mint" : "hot"}>
                        {t.status}
                      </Tag>
                    </div>
                  ))}
                </div>
              </Section>
            </div>

            {/* Transactions & Approvals */}
            <div className="grid lg:grid-cols-3 gap-6 mt-6">
              <Section title="Recent Transactions" subtitle="Click to view full details">
                <div className="bg-white rounded-3xl shadow border overflow-hidden" style={{ borderColor: "rgba(168,213,168,.45)" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-amber-50/60 text-left">
                        <th className="p-3">ID</th>
                        <th className="p-3">User</th>
                        <th className="p-3">Vendor</th>
                        <th className="p-3">Service</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTx.map((t) => (
                        <tr key={t.id} className="border-t hover:bg-amber-50/40 cursor-pointer" style={{ borderColor: "rgba(168,213,168,.25)" }} onClick={()=>setDrawer(t)}>
                          <td className="p-3 font-medium">{t.id}</td>
                          <td className="p-3">{t.user}</td>
                          <td className="p-3">{t.vendor}</td>
                          <td className="p-3">{t.service}</td>
                          <td className="p-3">{currency(t.amount)}</td>
                          <td className="p-3"><Tag tone={t.status === "paid" ? "mint" : "hot"}>{t.status}</Tag></td>
                          <td className="p-3 text-right">
                            <button
                              onClick={(e)=>{ e.stopPropagation(); refundTx(t.id); }}
                              className="text-xs px-3 py-1.5 rounded-full text-white"
                              style={{ background: brand.accent }}
                            >Refund</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>

              <Section title="Vendor Approvals" subtitle="KYC & portfolio review">
                <div className="bg-white rounded-3xl shadow border" style={{ borderColor: "rgba(168,213,168,.45)" }}>
                  <ul className="divide-y" style={{ borderColor: "rgba(168,213,168,.25)" }}>
                    {approvals.map(v => (
                      <li key={v.id} className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold" style={{ color: brand.text }}>{v.name} <span className="text-xs opacity-70">({v.id})</span></p>
                            <p className="text-xs" style={{ color: "#8B6F47" }}><Phone className="inline" size={12}/> {v.phone} • <MapPin className="inline" size={12}/> {v.city}</p>
                            <p className="text-xs mt-1"><Star className="inline" size={12} style={{ color: brand.accent }} /> {v.rating} • Docs: {v.docs.join(", ")}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={()=>verifyVendor(v.id)} className="px-3 py-1.5 rounded-full text-white text-xs" style={{ background: brand.accent }}>
                              <ShieldCheck className="inline mr-1" size={14}/> Verify
                            </button>
                            <button onClick={()=>rejectVendor(v.id)} className="px-3 py-1.5 rounded-full text-xs border" style={{ borderColor: "rgba(168,213,168,.45)" }}>
                              <Ban className="inline mr-1" size={14}/> Reject
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                    {approvals.length===0 && (
                      <li className="p-6 text-center text-sm" style={{ color: "#8B6F47" }}>No pending approvals 🎉</li>
                    )}
                  </ul>
                </div>
              </Section>

              <Section title="Support Tickets" subtitle="Triage and SLA health">
                <div className="bg-white rounded-3xl shadow border" style={{ borderColor: "rgba(168,213,168,.45)" }}>
                  <ul className="divide-y" style={{ borderColor: "rgba(168,213,168,.25)" }}>
                    {tickets.map(s => (
                      <li key={s.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold" style={{ color: brand.text }}>{s.title}</p>
                            <p className="text-xs" style={{ color: "#8B6F47" }}>Ticket {s.id} • {s.user} • Priority: {s.priority}</p>
                          </div>
                          <button className="px-3 py-1.5 rounded-full text-xs text-white" style={{ background: brand.accent }}>Open</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Section>
            </div>
          </div>
        )}

        {/* COMMERCE */}
        {tab === "commerce" && (
          <div>
            <Section title="Payments & Bookings" subtitle="Track cashflow, refunds, disputes">
              <div className="grid md:grid-cols-3 gap-4">
                <StatChip icon={Receipt} label="Gross Volume (30d)" value={currency(1489000)} trend={6.4} />
                <StatChip icon={CreditCard} label="Avg. Order Value" value={currency(17600)} />
                <StatChip icon={AlertCircle} label="Dispute Rate" value={"0.8%"} trend={-0.2} />
              </div>
            </Section>

            <div className="bg-white rounded-3xl p-4 shadow border" style={{ borderColor: "rgba(168,213,168,.45)" }}>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Tag>All</Tag>
                <Tag>Paid</Tag>
                <Tag>Refunded</Tag>
                <Tag>Disputed</Tag>
                <div className="ml-auto flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-full text-xs border" style={{ borderColor: "rgba(168,213,168,.45)" }}><Filter className="inline mr-1" size={14}/> Filters</button>
                  <button className="px-3 py-1.5 rounded-full text-xs border" style={{ borderColor: "rgba(168,213,168,.45)" }}><Download className="inline mr-1" size={14}/> Export CSV</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-amber-50/60 text-left">
                      <th className="p-3">Date</th>
                      <th className="p-3">Booking</th>
                      <th className="p-3">User</th>
                      <th className="p-3">Vendor</th>
                      <th className="p-3">Service</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(b => (
                      <tr key={b.id} className="border-t hover:bg-amber-50/40" style={{ borderColor: "rgba(168,213,168,.25)" }}>
                        <td className="p-3">{b.date}</td>
                        <td className="p-3">{b.id}</td>
                        <td className="p-3">{b.user}</td>
                        <td className="p-3">{b.vendor}</td>
                        <td className="p-3">{b.service}</td>
                        <td className="p-3">{currency(b.amount)}</td>
                        <td className="p-3"><Tag tone={b.status === "paid" ? "mint" : "hot"}>{b.status}</Tag></td>
                        <td className="p-3 text-right">
                          <button onClick={()=>setDrawer(b)} className="px-3 py-1.5 rounded-full text-xs border mr-2" style={{ borderColor: "rgba(168,213,168,.45)" }}><Eye size={14} className="inline mr-1"/> View</button>
                          {b.status!=="refunded" && (
                            <button onClick={()=>refundTx(b.id)} className="px-3 py-1.5 rounded-full text-xs text-white" style={{ background: brand.accent }}><DollarSign size={14} className="inline mr-1"/> Refund</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MARKETPLACE */}
        {tab === "marketplace" && (
          <div>
            <Section title="Users & Vendors" subtitle="Observe interactions and relationships">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white rounded-3xl p-4 shadow border" style={{ borderColor: "rgba(168,213,168,.45)" }}>
                  <h4 className="font-bold mb-3" style={{ color: brand.text }}>Conversation Mirror</h4>
                  <div className="h-80 overflow-y-auto space-y-3">
                    {/* Simulated thread */}
                    <div className="flex gap-2 items-start">
                      <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">U</div>
                      <div className="bg-amber-50 p-3 rounded-2xl text-sm max-w-[70%]">Hi! Can you do a pastel Somali-themed baby shower for 50 guests?</div>
                    </div>
                    <div className="flex gap-2 items-start justify-end">
                      <div className="bg-green-50 p-3 rounded-2xl text-sm max-w-[70%]">Salaam! Absolutely. Sharing a quote and mood board shortly 🌿</div>
                      <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">V</div>
                    </div>
                    <div className="flex gap-2 items-start">
                      <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">U</div>
                      <div className="bg-amber-50 p-3 rounded-2xl text-sm max-w-[70%]">Budget around KES 120k. Need halal catering + kids corner.</div>
                    </div>
                    <div className="flex gap-2 items-start justify-end">
                      <div className="bg-green-50 p-3 rounded-2xl text-sm max-w-[70%]">Got it. Quoting KES 115k incl. decor + catering. Attaching contract…</div>
                      <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">V</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <input placeholder="Search messages…" className="flex-1 px-3 py-2 border rounded-full text-sm" style={{ borderColor: "rgba(168,213,168,.45)" }} />
                    <button className="px-3 py-2 rounded-full text-sm text-white" style={{ background: brand.accent }}><Search className="inline mr-1" size={14}/> Find</button>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-4 shadow border" style={{ borderColor: "rgba(168,213,168,.45)" }}>
                  <h4 className="font-bold mb-3" style={{ color: brand.text }}>At a Glance</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between border-b pb-2" style={{ borderColor: "rgba(168,213,168,.25)" }}><span>Active users (30d)</span><span className="font-semibold">3,412</span></li>
                    <li className="flex justify-between border-b pb-2" style={{ borderColor: "rgba(168,213,168,.25)" }}><span>Active vendors</span><span className="font-semibold">214</span></li>
                    <li className="flex justify-between border-b pb-2" style={{ borderColor: "rgba(168,213,168,.25)" }}><span>Messages sent</span><span className="font-semibold">18,904</span></li>
                    <li className="flex justify-between"><span>Average response</span><span className="font-semibold">14m</span></li>
                  </ul>
                  <button className="mt-4 w-full px-4 py-2 rounded-full text-sm text-white" style={{ background: brand.accent }}>Open Directory</button>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* MODERATION */}
        {tab === "moderation" && (
          <div>
            <Section title="Moderation" subtitle="Visions, reviews, and profile content">
              <div className="bg-white rounded-3xl p-4 shadow border" style={{ borderColor: "rgba(168,213,168,.45)" }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-amber-50/60 text-left">
                      <th className="p-3">Item</th>
                      <th className="p-3">Owner</th>
                      <th className="p-3">Flag</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visions.map(v => (
                      <tr key={v.id} className="border-t" style={{ borderColor: "rgba(168,213,168,.25)" }}>
                        <td className="p-3 font-medium">{v.type} <span className="opacity-60">({v.id})</span></td>
                        <td className="p-3">{v.owner}</td>
                        <td className="p-3">{v.flag}</td>
                        <td className="p-3"><Tag>{v.status}</Tag></td>
                        <td className="p-3 text-right">
                          <button className="px-3 py-1.5 rounded-full text-xs border mr-2" style={{ borderColor: "rgba(168,213,168,.45)" }}><Eye size={14} className="inline mr-1"/> Review</button>
                          <button className="px-3 py-1.5 rounded-full text-xs text-white mr-2" style={{ background: brand.accent }}><CheckCircle2 size={14} className="inline mr-1"/> Approve</button>
                          <button className="px-3 py-1.5 rounded-full text-xs border" style={{ borderColor: "rgba(168,213,168,.45)" }}><Ban size={14} className="inline mr-1"/> Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          </div>
        )}

        {/* SUPPORT */}
        {tab === "support" && (
          <div>
            <Section title="Support Inbox" subtitle="Conversations that need attention">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white rounded-3xl p-4 shadow border" style={{ borderColor: "rgba(168,213,168,.45)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag>All</Tag>
                    <Tag>Open</Tag>
                    <Tag>In Progress</Tag>
                    <Tag>Closed</Tag>
                  </div>
                  <ul className="divide-y" style={{ borderColor: "rgba(168,213,168,.25)" }}>
                    {tickets.map(s => (
                      <li key={s.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold" style={{ color: brand.text }}>{s.title}</p>
                            <p className="text-xs" style={{ color: "#8B6F47" }}>Ticket {s.id} • {s.user} • Priority: {s.priority}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 rounded-full text-xs border" style={{ borderColor: "rgba(168,213,168,.45)" }}>Assign</button>
                            <button className="px-3 py-1.5 rounded-full text-xs text-white" style={{ background: brand.accent }}>Reply</button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-3xl p-4 shadow border" style={{ borderColor: "rgba(168,213,168,.45)" }}>
                  <h4 className="font-bold mb-2" style={{ color: brand.text }}>Macros</h4>
                  <div className="space-y-2">
                    {[
                      "Send payment receipt",
                      "Request additional documents",
                      "Offer partial refund",
                      "Share vendor shortlist",
                    ].map(m => (
                      <button key={m} className="w-full text-left px-3 py-2 rounded-2xl border hover:bg-amber-50/60" style={{ borderColor: "rgba(168,213,168,.45)" }}>{m}</button>
                    ))}
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* SETTINGS */}
        {tab === "settings" && (
          <div>
            <Section title="Platform Settings" subtitle="Risk, payouts, and platform rules">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-5 shadow border" style={{ borderColor: "rgba(168,213,168,.45)" }}>
                  <h4 className="font-bold mb-3" style={{ color: brand.text }}>Payments</h4>
                  <div className="space-y-3 text-sm">
                    <label className="flex items-center justify-between">
                      <span>Hold payouts until event completion</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 accent-orange-500" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span>Enable escrow for bookings</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 accent-orange-500" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span>Automatic refunds on cancellations (24h window)</span>
                      <input type="checkbox" className="w-5 h-5 accent-orange-500" />
                    </label>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5 shadow border" style={{ borderColor: "rgba(168,213,168,.45)" }}>
                  <h4 className="font-bold mb-3" style={{ color: brand.text }}>Trust & Safety</h4>
                  <div className="space-y-3 text-sm">
                    <label className="flex items-center justify-between">
                      <span>Require KRA + ID for vendors</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 accent-orange-500" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span>Auto-flag stock photos in portfolios</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 accent-orange-500" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span>Block DMs without active booking</span>
                      <input type="checkbox" className="w-5 h-5 accent-orange-500" />
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2 bg-white rounded-3xl p-5 shadow border" style={{ borderColor: "rgba(168,213,168,.45)" }}>
                  <h4 className="font-bold mb-3" style={{ color: brand.text }}>Webhooks & Integrations</h4>
                  <div className="grid md:grid-cols-3 gap-3">
                    {[
                      { name: "M-Pesa (Daraja)", status: "connected" },
                      { name: "Email (SES)", status: "connected" },
                      { name: "Analytics (PostHog)", status: "connected" },
                    ].map(i => (
                      <div key={i.name} className="p-3 rounded-2xl border flex items-center justify-between" style={{ borderColor: "rgba(168,213,168,.45)" }}>
                        <span className="text-sm">{i.name}</span>
                        <Tag tone={i.status==="connected"?"mint":"hot"}>{i.status}</Tag>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}
      </main>

      {/* Transaction Drawer */}
      <AnimatePresence>
        {drawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-50"
            onClick={()=>setDrawer(null)}
          >
            <motion.div
              initial={{ x: 420 }}
              animate={{ x: 0 }}
              exit={{ x: 420 }}
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-5"
              onClick={(e)=>e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-xl" style={{ color: brand.text }}>Booking {drawer.id}</h4>
                <button onClick={()=>setDrawer(null)} className="p-1 rounded-full hover:bg-amber-50"><X size={18}/></button>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="opacity-70">User:</span> {drawer.user}</p>
                <p><span className="opacity-70">Vendor:</span> {drawer.vendor}</p>
                <p><span className="opacity-70">Service:</span> {drawer.service}</p>
                <p><span className="opacity-70">Date:</span> {drawer.date}</p>
                <p><span className="opacity-70">Amount:</span> {currency(drawer.amount)}</p>
                <p><span className="opacity-70">Status:</span> <Tag>{drawer.status}</Tag></p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="px-3 py-2 rounded-xl border" style={{ borderColor: "rgba(168,213,168,.45)" }}><Download className="inline mr-1" size={16}/> Invoice</button>
                <button className="px-3 py-2 rounded-xl text-white" style={{ background: brand.accent }}><Mail className="inline mr-1" size={16}/> Email receipt</button>
                <button onClick={()=>refundTx(drawer.id)} className="px-3 py-2 rounded-xl text-white" style={{ background: brand.accentDark }}><DollarSign className="inline mr-1" size={16}/> Refund</button>
                <button className="px-3 py-2 rounded-xl border" style={{ borderColor: "rgba(168,213,168,.45)" }}><MessageCircle className="inline mr-1" size={16}/> Open chat</button>
              </div>

              <div className="mt-6">
                <h5 className="font-semibold mb-2" style={{ color: brand.text }}>Timeline</h5>
                <ul className="text-sm space-y-2">
                  <li>📌 Booking created</li>
                  <li>💳 Payment authorized</li>
                  <li>✅ Vendor accepted</li>
                  <li>📄 Contract shared</li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Broadcast modal */}
      <AnimatePresence>
        {broadcastOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={()=>setBroadcastOpen(false)}>
            <motion.div initial={{ scale: .95 }} animate={{ scale: 1 }} exit={{ scale: .95 }} className="w-full max-w-lg bg-white rounded-3xl p-5 border shadow-2xl" style={{ borderColor: "rgba(168,213,168,.45)" }} onClick={(e)=>e.stopPropagation()}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-xl" style={{ color: brand.text }}>Broadcast Message</h4>
                <button onClick={()=>setBroadcastOpen(false)} className="p-1 rounded-full hover:bg-amber-50"><X size={18}/></button>
              </div>
              <p className="text-sm mb-3" style={{ color: "#8B6F47" }}>Send an announcement to all vendors or users (e.g., maintenance windows, feature launches).</p>
              <div className="space-y-3">
                <select className="w-full px-3 py-2 rounded-2xl border" style={{ borderColor: "rgba(168,213,168,.45)" }}>
                  <option>Audience: All Vendors</option>
                  <option>Audience: All Users</option>
                </select>
                <input className="w-full px-3 py-2 rounded-2xl border" placeholder="Subject" style={{ borderColor: "rgba(168,213,168,.45)" }} />
                <textarea className="w-full px-3 py-2 rounded-2xl border h-32" placeholder="Write your message…" style={{ borderColor: "rgba(168,213,168,.45)" }} />
              </div>
              <div className="mt-4 flex items-center justify-end gap-2">
                <button onClick={()=>setBroadcastOpen(false)} className="px-4 py-2 rounded-full text-sm border" style={{ borderColor: "rgba(168,213,168,.45)" }}>Cancel</button>
                <button className="px-4 py-2 rounded-full text-sm text-white" style={{ background: `linear-gradient(135deg, ${brand.accent}, ${brand.accentDark})` }}>Send</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-8 text-center mt-8" style={{ color: "#8B6F47" }}>
        <p>© 2025 KINSI • Admin Console</p>
      </footer>
    </div>
  );
};

// Small inline icon to avoid another import just for one usage
const MegaphoneIcon = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 10v4a2 2 0 0 0 2 2h1l3 5v-7h7a4 4 0 0 0 4-4V6a1 1 0 0 0-1.447-.894L6 9H5a2 2 0 0 0-2 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default KinsiAdminDashboard;
