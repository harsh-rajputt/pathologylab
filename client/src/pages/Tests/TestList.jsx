import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Filter, Play, Edit2, Trash2, ShieldAlert,
    ClipboardList, CheckCircle2, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function TestList() {
    const { showNotification } = useApp();
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Filters matching PatientList aesthetics
    const [filters, setFilters] = useState({
        department: '',
        wing: ''
    });

    const fetchTests = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/tests');
            const data = await res.json();
            if (data.success) {
                setTests(data.data.tests);
            }
        } catch (error) {
            console.error("Failed to fetch tests:", error);
            showNotification("Failed to connect to database.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you absolutely sure you want to delete this test permanently?')) return;
        
        try {
            const res = await fetch(`http://localhost:5000/api/tests/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                showNotification("Test deleted successfully", "success");
                setTests(tests.filter(t => t._id !== id));
            } else {
                showNotification(data.error || "Failed to delete", "error");
            }
        } catch (_err) {
            showNotification("Server error during deletion", "error");
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Filter Logic
    const filteredTests = tests.filter(test => {
        const matchesSearch = test.testName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              test.shortCode?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDepartment = filters.department ? test.department === filters.department : true;
        const matchesWing = filters.wing ? test.wing === filters.wing : true;
        
        return matchesSearch && matchesDepartment && matchesWing;
    });

    const containerVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <div className="min-h-screen bg-slate-100/50 p-4 md:p-6 lg:p-8">
            <motion.div 
                className="max-w-[1600px] mx-auto bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Purplish Header Theme mimicking the provided images for List Pages */}
                <div className="bg-purple-700 text-white px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-purple-200" />
                        <h1 className="text-lg font-semibold tracking-wide">
                            Test Parameter Details
                        </h1>
                    </div>
                    <button 
                        onClick={() => navigate('/tests/entry')}
                        className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-sm font-semibold rounded-lg transition-colors border border-white/20"
                    >
                        + New Test
                    </button>
                </div>

                {/* Filter Controls matching Patient List */}
                <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-end gap-5">
                    <div className="space-y-1.5 flex-1 min-w-[200px] max-w-[300px]">
                        <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Search Name/Code</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-400" />
                            </div>
                            <input 
                                type="text"
                                placeholder="Search tests..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-slate-700"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-[150px] max-w-[250px]">
                        <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Department</label>
                        <select 
                            name="department"
                            value={filters.department}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-slate-700"
                        >
                            <option value="">All Departments</option>
                            <option value="HAEMATOLOGY">HAEMATOLOGY</option>
                            <option value="BIOCHEMESTRY">BIOCHEMESTRY</option>
                        </select>
                    </div>

                    <div>
                        <button className="flex items-center gap-2 mb-0.5 px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer">
                            Filter <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                    </div>
                </div>

                {/* Table Data */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-4 py-3 text-xs font-bold text-slate-800 tracking-wide w-16">Action</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-800 tracking-wide">Test Code</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-800 tracking-wide">Test Name</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-800 tracking-wide">Department</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-800 tracking-wide">Test Format</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-800 tracking-wide">Rate (₹)</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-800 tracking-wide">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500 font-medium tracking-wide">
                                        Loading laboratory tests...
                                    </td>
                                </tr>
                            ) : filteredTests.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center">
                                            <ShieldAlert className="w-12 h-12 text-slate-300 mb-3" />
                                            <span className="font-medium">No tests found</span>
                                            <span className="text-sm mt-1">Try adding a new test from the test entry page.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredTests.map((test) => (
                                    <tr key={test._id} className="hover:bg-purple-50/50 transition-colors text-sm text-slate-700 group">
                                        <td className="px-4 py-2.5">
                                            <div className="flex items-center gap-1">
                                                <button 
                                                    onClick={() => navigate(`/tests/entry?id=${test._id || test.id}`, { state: { test } })}
                                                    className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit Test"
                                                >
                                                    <Edit2 size={16} strokeWidth={2.5} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(test._id)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Delete Test"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2.5 font-mono text-slate-600">
                                            {test.shortCode || test.testCode || '-'}
                                        </td>
                                        <td className="px-4 py-2.5 font-bold text-slate-900">
                                            {test.testName}
                                        </td>
                                        <td className="px-4 py-2.5 font-medium text-slate-600">
                                            {test.department || '-'}
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-xs font-semibold">
                                                {test.testFormat || 'Single'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5 font-bold text-emerald-600">
                                            ₹{test.rate || 0}
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                                                <CheckCircle2 size={14} /> Active
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
