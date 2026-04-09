import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, Save, Edit2, Trash2, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function TestUnit() {
    const { showNotification } = useApp();
    const [units, setUnits] = useState([]);
    const [formData, setFormData] = useState({ id: null, name: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUnits = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/test-units');
            const data = await res.json();
            if (data.success) {
                setUnits(data.data.units);
            }
        } catch (error) {
            console.error("Failed to fetch test units:", error);
            showNotification("Failed to load units from database", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch initial units on mount
    useEffect(() => {
        fetchUnits();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            showNotification("Unit name is required", "error");
            return;
        }

        try {
            const endpoint = isEditing 
                ? `http://localhost:5000/api/test-units/${formData.id}` 
                : 'http://localhost:5000/api/test-units';
            
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: formData.name })
            });

            const data = await res.json();
            
            if (data.success) {
                showNotification(isEditing ? "Test unit updated successfully!" : "Test unit created successfully!", "success");
                setFormData({ id: null, name: '' });
                setIsEditing(false);
                fetchUnits(); // Reload the list
            } else {
                showNotification(data.error || "Failed to save unit", "error");
            }
        } catch (error) {
            console.error("Save Error:", error);
            showNotification("Server communication error", "error");
        }
    };

    const handleEdit = (unit) => {
        setIsEditing(true);
        setFormData({ id: unit._id || unit.id, name: unit.name });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this unit permanently?')) return;
        
        try {
            const res = await fetch(`http://localhost:5000/api/test-units/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                showNotification("Unit deleted", "success");
                fetchUnits();
            } else {
                showNotification(data.error || "Cannot delete unit", "error");
            }
        } catch (error) {
            console.error("Delete Error:", error);
            showNotification("Server error during deletion", "error");
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 min-h-screen bg-slate-50/50">
            {/* Header Title */}
            <header className="mb-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl shadow-sm">
                            <Layers size={24} strokeWidth={2.5} />
                        </div>
                        Test Unit Management
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Create and manage your clinical measurement units (%, /cumm, mg/dL, etc.).</p>
                </motion.div>
            </header>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
            >
                {/* Purple Header matching screenshot aesthetic */}
                <div className="bg-purple-700 px-5 py-3.5 flex items-center text-white shadow-sm">
                    <Layers size={20} strokeWidth={2.5} className="mr-3" />
                    <h2 className="text-lg font-bold tracking-wide">Unit</h2>
                </div>

                <div className="p-6 md:p-8">
                    {/* Input Form matching the screenshot closely with Save button next to it */}
                    <form onSubmit={handleSave} className="flex flex-col md:flex-row gap-4 mb-8 items-end">
                        <div className="flex-1 w-full relative">
                            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Unit Name</label>
                            <input 
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g. mg/dL, /cumm, %, etc."
                                className={`w-full px-4 py-2.5 bg-white border ${isEditing ? 'border-amber-400 focus:ring-amber-500/20' : 'border-slate-300 focus:ring-purple-500/20'} rounded-lg focus:ring-2 focus:border-purple-500 shadow-sm transition-all outline-none font-medium text-slate-800`}
                                required
                            />
                            {isEditing && (
                                <span className="absolute right-3 top-[38px] text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded">
                                    EDIT MODE
                                </span>
                            )}
                        </div>
                        
                        <div className="flex gap-2">
                            <button 
                                type="submit" 
                                className={`px-6 py-2.5 font-bold text-white rounded-lg shadow-md transition-all flex items-center gap-2 ${isEditing ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                            >
                                <Save className="w-4 h-4" />
                                {isEditing ? "Update" : "Save"}
                            </button>

                            {isEditing && (
                                <button 
                                    type="button" 
                                    onClick={() => { setIsEditing(false); setFormData({ id: null, name: '' }); }}
                                    className="px-4 py-2.5 font-bold text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-lg shadow-sm transition-all"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Table View Component */}
                    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                                    <th className="px-4 py-3 text-sm font-bold w-16 text-center">Action</th>
                                    <th className="px-5 py-3 text-sm font-bold">Test Unit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="2" className="py-8 text-center text-slate-400 font-medium">Loading units...</td>
                                    </tr>
                                ) : units.length === 0 ? (
                                    <tr>
                                        <td colSpan="2" className="py-12 text-center text-slate-500 flex flex-col items-center">
                                            <ShieldAlert className="w-10 h-10 text-slate-300 mb-3" />
                                            No test units found. Create one above!
                                        </td>
                                    </tr>
                                ) : (
                                    units.map((unit) => (
                                        <tr key={unit._id || unit.id} className="hover:bg-slate-50/70 transition-colors group">
                                            <td className="px-4 py-2.5 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button 
                                                        onClick={() => handleEdit(unit)}
                                                        className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                                        title="Edit Unit"
                                                    >
                                                        <Edit2 size={16} strokeWidth={2.5} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(unit._id || unit.id)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Delete Unit"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-5 py-2.5 font-medium text-slate-800">
                                                {unit.name}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
