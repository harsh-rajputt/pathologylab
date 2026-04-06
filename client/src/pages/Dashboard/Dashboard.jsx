import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Users, Receipt, IndianRupee, Wallet, ArrowRight, Download, Calendar, Activity, User, LogOut } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState([
        { id: 1, title: "This Month Registration", value: "0", icon: Users, trend: "", gradient: "from-blue-500 to-indigo-600", shadow: "shadow-blue-500/30" },
        { id: 2, title: "Bill For The Month", value: "₹0.00", icon: Receipt, trend: "", gradient: "from-rose-400 to-red-500", shadow: "shadow-rose-500/30" },
        { id: 3, title: "Collection For The Month", value: "₹0.00", icon: IndianRupee, trend: "", gradient: "from-violet-500 to-fuchsia-600", shadow: "shadow-violet-500/30" },
        { id: 4, title: "Total Dues", value: "₹0.00", icon: Wallet, trend: "", gradient: "from-amber-400 to-orange-500", shadow: "shadow-orange-500/30" },
    ]);
    const [dailyData, setDailyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/patients');
                const data = await res.json();
                if (data.success) {
                    const patients = data.patients;

                    const now = new Date();
                    const currentMonth = now.getMonth();
                    const currentYear = now.getFullYear();

                    let monthReg = 0;
                    let monthBill = 0;
                    let monthColl = 0;
                    let totalDues = 0;

                    const dailyMap = {};
                    const monthlyMap = {};

                    patients.forEach(p => {
                        const date = new Date(p.createdAt);
                        const pMonth = date.getMonth();
                        const pYear = date.getFullYear();

                        const bill = Number(p.amounts?.totalAmount || 0);
                        const coll = Number(p.amounts?.received || 0);
                        const dues = Number(p.amounts?.dues || 0);

                        totalDues += dues;

                        if (pMonth === currentMonth && pYear === currentYear) {
                            monthReg++;
                            monthBill += bill;
                            monthColl += coll;
                        }

                        // Daily Aggregation
                        const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                        if (!dailyMap[dateStr]) dailyMap[dateStr] = { reg: 0, bill: 0, coll: 0, dues: 0 };
                        dailyMap[dateStr].reg++;
                        dailyMap[dateStr].bill += bill;
                        dailyMap[dateStr].coll += coll;
                        dailyMap[dateStr].dues += dues;

                        // Monthly Aggregation
                        const monthStr = `${String(pMonth + 1).padStart(2, '0')}-${pYear}`;
                        if (!monthlyMap[monthStr]) monthlyMap[monthStr] = { reg: 0, bill: 0, coll: 0, dues: 0 };
                        monthlyMap[monthStr].reg++;
                        monthlyMap[monthStr].bill += bill;
                        monthlyMap[monthStr].coll += coll;
                        monthlyMap[monthStr].dues += dues;
                    });

                    setStats([
                        { id: 1, title: "This Month Registration", value: String(monthReg), icon: Users, trend: "Current", gradient: "from-blue-500 to-indigo-600", shadow: "shadow-blue-500/30" },
                        { id: 2, title: "Bill For The Month", value: `₹${monthBill.toFixed(2)}`, icon: Receipt, trend: "Current", gradient: "from-rose-400 to-red-500", shadow: "shadow-rose-500/30" },
                        { id: 3, title: "Collection For The Month", value: `₹${monthColl.toFixed(2)}`, icon: IndianRupee, trend: "Current", gradient: "from-violet-500 to-fuchsia-600", shadow: "shadow-violet-500/30" },
                        { id: 4, title: "Total Outstanding Dues", value: `₹${totalDues.toFixed(2)}`, icon: Wallet, trend: "All Time", gradient: "from-amber-400 to-orange-500", shadow: "shadow-orange-500/30" },
                    ]);

                    const dailyArr = Object.entries(dailyMap).map(([date, data], index) => ({
                        id: index + 1, date, reg: data.reg, bill: data.bill.toFixed(2), coll: data.coll.toFixed(2), dues: data.dues.toFixed(2)
                    }));
                    setDailyData(dailyArr.sort((a, b) => b.id - a.id));

                    let tReg = 0, tBill = 0, tColl = 0, tDues = 0;
                    const monthlyArr = Object.entries(monthlyMap).map(([month, data], index) => {
                        tReg += data.reg; tBill += data.bill; tColl += data.coll; tDues += data.dues;
                        return { id: index + 1, month, reg: data.reg, bill: data.bill.toFixed(2), coll: data.coll.toFixed(2), dues: data.dues.toFixed(2) };
                    });

                    if (monthlyArr.length > 0) {
                        monthlyArr.push({ id: monthlyArr.length + 1, month: "Total : -", reg: tReg, bill: tBill.toFixed(2), coll: tColl.toFixed(2), dues: tDues.toFixed(2), isTotal: true });
                    }
                    setMonthlyData(monthlyArr);
                }
            } catch (error) {
                console.error("Dashboard dataload error", error);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="p-6 md:p-8 min-h-screen bg-slate-50/50 font-sans">
            {/* Header */}
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-3"
                >
                    {/* User Profile Dropdown Menu */}
                    <div className="relative group z-50">
                        <button className="p-3 bg-white border border-slate-200 text-slate-700 rounded-full shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center group-hover:ring-4 group-hover:ring-indigo-500/10">
                            <User size={20} className="text-slate-600" />
                        </button>

                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right translate-y-2 group-hover:translate-y-0">
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                                <p className="text-xs text-slate-500 font-semibold mb-0.5 uppercase tracking-wider">Logged in as</p>
                                <p className="text-[15px] font-bold text-slate-900 tracking-tight">Admin User</p>
                            </div>
                            <div className="p-2">
                                <button 
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to log out?')) {
                                            // Handle logout logic here (e.g., clear localStorage, cookies, etc.)
                                            window.location.href = '/'; 
                                        }
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-rose-600 font-semibold hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <LogOut size={16} strokeWidth={2.5} /> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                        className="relative bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/40 hover:-translate-y-1 transition-all duration-300"
                    >
                        {/* Background Decoration */}
                        <div className={`absolute -right-6 -top-6 w-28 h-28 bg-gradient-to-br ${stat.gradient} rounded-full opacity-[0.08] group-hover:scale-[1.8] group-hover:opacity-10 transition-all duration-700 ease-in-out`} />

                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg ${stat.shadow}`}>
                                <stat.icon size={26} strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 tracking-wide uppercase">
                                {stat.trend}
                            </span>
                        </div>

                        <div>
                            <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-1.5">{stat.value}</h3>
                            <p className="text-sm font-semibold text-slate-500/80">{stat.title}</p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100/80 relative z-10">
                            <button className="text-sm font-bold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                                View Details <ArrowRight size={16} strokeWidth={2.5} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Daily Table */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="bg-white rounded-[1.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden flex flex-col"
                >
                    <div className="p-6 border-b border-slate-100/80 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shadow-sm">
                                <Activity size={22} className="stroke-[2.5]" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Daily Summary</h2>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                            <Download size={20} strokeWidth={2.5} />
                        </button>
                    </div>
                    <div className="overflow-x-auto p-4 flex-grow">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead>
                                <tr className="text-slate-500 text-sm font-semibold border-b border-slate-100">
                                    <th className="pb-4 px-4 font-bold text-slate-400">SN</th>
                                    <th className="pb-4 px-4 font-bold text-slate-400">Date</th>
                                    <th className="pb-4 px-4 font-bold text-slate-400">Registration</th>
                                    <th className="pb-4 px-4 font-bold text-slate-400">Bill Amount</th>
                                    <th className="pb-4 px-4 font-bold text-slate-400">Collection</th>
                                    <th className="pb-4 px-4 font-bold text-slate-400">Dues</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-slate-700">
                                {dailyData.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="py-5 px-4 font-bold text-slate-900">{row.id}</td>
                                        <td className="py-5 px-4 font-medium">{row.date}</td>
                                        <td className="py-5 px-4">
                                            <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs ring-1 ring-indigo-100">
                                                {row.reg}
                                            </span>
                                        </td>
                                        <td className="py-5 px-4 font-semibold text-slate-900">₹{row.bill}</td>
                                        <td className="py-5 px-4 font-bold text-emerald-600">₹{row.coll}</td>
                                        <td className="py-5 px-4 font-bold text-rose-500">₹{row.dues}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Monthly Table */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="bg-white rounded-[1.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden flex flex-col"
                >
                    <div className="p-6 border-b border-slate-100/80 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm">
                                <Calendar size={22} className="stroke-[2.5]" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Monthly Summary</h2>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                            <Download size={20} strokeWidth={2.5} />
                        </button>
                    </div>
                    <div className="overflow-x-auto p-4 flex-grow">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead>
                                <tr className="text-slate-500 text-sm font-semibold border-b border-slate-100">
                                    <th className="pb-4 px-4 font-bold text-slate-400">SN</th>
                                    <th className="pb-4 px-4 font-bold text-slate-400">Month</th>
                                    <th className="pb-4 px-4 font-bold text-slate-400">Registration</th>
                                    <th className="pb-4 px-4 font-bold text-slate-400">Bill Amount</th>
                                    <th className="pb-4 px-4 font-bold text-slate-400">Collection</th>
                                    <th className="pb-4 px-4 font-bold text-slate-400">Dues</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-slate-700">
                                {monthlyData.map((row) => (
                                    <tr key={row.id} className={`hover:bg-slate-50/80 transition-colors group ${row.isTotal ? 'bg-slate-50/50 border-t border-slate-200/60' : 'border-b border-slate-50'}`}>
                                        <td className="py-4 px-4 font-bold text-slate-900">{row.id}</td>
                                        <td className="py-4 px-4 font-semibold text-slate-900">{row.month}</td>
                                        <td className="py-4 px-4">
                                            <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs ring-1 ring-indigo-100">
                                                {row.reg}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 font-semibold text-slate-900">₹{row.bill}</td>
                                        <td className="py-4 px-4 font-bold text-emerald-600">₹{row.coll}</td>
                                        <td className="py-4 px-4 font-bold text-rose-500">₹{row.dues}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
