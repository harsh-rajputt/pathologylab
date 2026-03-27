import React from 'react';
import { motion } from "framer-motion";
import { Users, Receipt, IndianRupee, Wallet, ArrowRight, Download, Calendar, Activity } from 'lucide-react';

const stats = [
    { 
        id: 1,
        title: "This Month Registration", 
        value: "1", 
        icon: Users,
        trend: "+1 this week",
        gradient: "from-blue-500 to-indigo-600",
        shadow: "shadow-blue-500/30"
    },
    { 
        id: 2,
        title: "Bill For The Month",          
        value: "220", 
        icon: Receipt,
        trend: "Steady",
        gradient: "from-rose-400 to-red-500",
        shadow: "shadow-rose-500/30"
    },
    { 
        id: 3,
        title: "Collection For The Month",    
        value: "₹200.00", 
        icon: IndianRupee,
        trend: "+₹200 today",
        gradient: "from-violet-500 to-fuchsia-600",
        shadow: "shadow-violet-500/30"
    },
    { 
        id: 4,
        title: "Total Dues",                 
        value: "₹0.00", 
        icon: Wallet,
        trend: "All clear",
        gradient: "from-amber-400 to-orange-500",
        shadow: "shadow-orange-500/30"
    },
];

const dailyData = [
    { id: 1, date: "07/03/2026", reg: 1, bill: "200.00", coll: "200.00", dues: "0.00" }
];

const monthlyData = [
    { id: 1, month: "03-2026", reg: 1, bill: "200.00", coll: "200.00", dues: "0.00" },
    { id: 2, month: "Total : -", reg: 1, bill: "200.00", coll: "200.00", dues: "0.00", isTotal: true },
];

export default function Dashboard() {
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
                    <p className="text-slate-500 mt-1">Here's what's happening in your lab today.</p>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-3"
                >
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl shadow-sm hover:bg-slate-50 transition-all font-medium flex items-center gap-2 group">
                        <Calendar size={18} className="text-slate-500 group-hover:text-indigo-600 transition-colors" />
                        <span>Filter by Date</span>
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-sm hover:bg-indigo-700 transition-all font-medium flex items-center gap-2 shadow-indigo-600/20 group">
                        <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                        <span>Export Report</span>
                    </button>
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
