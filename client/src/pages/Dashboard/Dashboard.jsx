// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const stats = [
    { label: "This month's Registrations", value: "0" },
    { label: "Bill of the month",          value: "₹0" },
    { label: "Collection of the month",    value: "₹0" },
    { label: "Total Dues",                 value: "₹0" },
];

export default function Dashboard() {
    return (
        <div className="p-8">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
                <p className="text-slate-500 mt-1">Welcome back — here's your lab summary for this month.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
                    >
                        <p className="text-slate-500 text-sm font-medium mb-2">{stat.label}</p>
                        <h2 className="text-3xl font-bold text-slate-800">{stat.value}</h2>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity Placeholder */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
            >
                <h2 className="text-xl font-bold text-slate-800 mb-2">Recent Activity</h2>
                <p className="text-slate-500 text-sm font-medium">No recent activity to display.</p>
            </motion.div>
        </div>
    );
}
