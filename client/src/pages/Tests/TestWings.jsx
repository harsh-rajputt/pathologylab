import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, List as ListIcon, Network, Search, Save, AlertCircle } from 'lucide-react';

export default function TestWings() {
    const [wings, setWings] = useState([]);
    const [formData, setFormData] = useState({ id: null, name: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchWings();
    }, []);

    const fetchWings = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/wings');
            const data = await res.json();
            if (data.success) setWings(data.wings);
        } catch (error) {
            console.error("Failed to fetch database records", error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const wingName = formData.name.trim();
        if (!wingName) return;

        if (isEditing) {
            // Updating logic (can be added to backend later)
            setWings(wings.map(w => w._id === formData.id ? { ...w, name: wingName } : w));
        } else {
            try {
                const res = await fetch('http://localhost:5000/api/wings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: wingName })
                });
                const data = await res.json();
                if (data.success) {
                    setWings([data.wing, ...wings]); // Immediately update UI with new database object
                } else {
                    alert(data.error);
                }
            } catch (error) {
                console.error("Save Error:", error);
            }
        }
        
        // Reset form
        setFormData({ id: null, name: '' });
        setIsEditing(false);
    };

    const handleEdit = (wing) => {
        setFormData({ id: wing._id || wing.id, name: wing.name });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to permanently delete this wing from the database?")) {
            try {
                const res = await fetch(`http://localhost:5000/api/wings/${id}`, { method: 'DELETE' });
                const data = await res.json();
                if (data.success) {
                    setWings(wings.filter(w => (w._id || w.id) !== id));
                }
            } catch (error) {
                console.error("Delete Error:", error);
            }
        }
    };

    const filteredWings = wings.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="p-4 md:p-6 min-h-screen bg-slate-50/50 font-sans">
            <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-fuchsia-100 text-fuchsia-600 rounded-xl shadow-sm">
                            <Network size={24} strokeWidth={2.5} />
                        </div>
                        Test Wings
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Create and organize departments into structural wings.</p>
                </motion.div>
                
                {/* Search Bar matching the clean aesthetic */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search wings..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 outline-none transition-all text-sm font-medium"
                    />
                </motion.div>
            </header>

            {/* Central Main Container */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.4 }}
                className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden"
            >
                {/* Purple Header precisely like the picture */}
                <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 px-5 py-4 flex items-center gap-2 text-white">
                    <ListIcon size={20} strokeWidth={2.5} />
                    <h2 className="text-lg font-bold tracking-wide">
                        Test Wing
                    </h2>
                </div>

                <div className="p-6 md:p-8">
                    {/* Inline Form matching picture layout exactly */}
                    <form onSubmit={handleSave} className="mb-8">
                        <div className="flex flex-col sm:flex-row items-end gap-3 sm:gap-4 max-w-2xl mx-auto">
                            <div className="flex-1 w-full">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Wing Name <span className="text-rose-500">*</span></label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 focus:bg-white transition-all outline-none font-medium text-slate-800"
                                    placeholder="e.g. ECG"
                                />
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button 
                                    type="submit" 
                                    className={`flex-1 sm:flex-none py-3 px-6 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${isEditing ? 'bg-fuchsia-600 hover:bg-fuchsia-700 shadow-fuchsia-500/30' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'}`}
                                >
                                    <Save size={18} />
                                    {isEditing ? 'Update' : 'Save'}
                                </button>
                                {isEditing && (
                                    <button 
                                        type="button" 
                                        onClick={() => { setIsEditing(false); setFormData({ id: null, name: '' }); }}
                                        className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>

                    {/* Table matching the design */}
                    <div className="max-w-3xl mx-auto border border-slate-200 rounded-2xl overflow-hidden">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="py-3.5 px-6 w-16 text-slate-400 font-semibold text-xs uppercase tracking-wider text-center">Actions</th>
                                    <th className="py-3.5 px-6 text-slate-500 font-semibold text-xs uppercase tracking-wider">Wing Name</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <AnimatePresence>
                                    {filteredWings.length === 0 ? (
                                        <tr>
                                            <td colSpan="2" className="py-12 text-center text-slate-500">
                                                <AlertCircle className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                                                <p className="text-lg font-medium text-slate-600">No wings found</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredWings.map((wing, index) => (
                                            <motion.tr 
                                                key={wing._id || wing.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className={`border-b border-slate-100 hover:bg-fuchsia-50/40 transition-colors group ${isEditing && formData.id === (wing._id || wing.id) ? 'bg-fuchsia-50/60' : ''}`}
                                            >
                                                <td className="py-2.5 px-4 text-center">
                                                    <div className="flex items-center justify-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => handleEdit(wing)}
                                                            className={`p-1.5 rounded-md transition-all ${isEditing && formData.id === (wing._id || wing.id) ? 'bg-fuchsia-600 text-white shadow-md' : 'text-slate-500 hover:text-fuchsia-600 hover:bg-fuchsia-100'}`}
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={16} strokeWidth={2.5} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(wing._id || wing.id)}
                                                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-100 rounded-md transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} strokeWidth={2.5} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-6 font-bold text-slate-700">
                                                    {wing.name}
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
