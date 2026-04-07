import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Save, Trash2, ArrowUp, ArrowDown, Palette, CheckCircle2, FlaskConical, AlertCircle, Pencil } from 'lucide-react';

const AbnormalIndication = () => {
    const [indications, setIndications] = useState([]);
    const [newIndication, setNewIndication] = useState({
        low: '',
        high: '',
        isDefault: false,
        color: '#DC2626'
    });
    const [editingId, setEditingId] = useState(null);
    const [footerColor, setFooterColor] = useState('#DC2626');

    const fetchIndications = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/abnormal-indications');
            const data = await res.json();
            if (data.success) {
                setIndications(data.items);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    };

    useEffect(() => {
        fetchIndications();
    }, []);

    const handleAdd = async () => {
        if (!newIndication.low && !newIndication.high) return;
        
        try {
            let res;
            if (editingId) {
                res = await fetch(`http://localhost:5000/api/abnormal-indications/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newIndication)
                });
            } else {
                res = await fetch('http://localhost:5000/api/abnormal-indications', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newIndication)
                });
            }

            const data = await res.json();
            if (data.success) {
                setEditingId(null);
                setNewIndication({ low: '', high: '', isDefault: false, color: '#DC2626' });
                fetchIndications();
            }
        } catch (err) {
            console.error("Save Error:", err);
        }
    };

    const handleEdit = (item) => {
        setNewIndication({
            low: item.low,
            high: item.high,
            isDefault: item.isDefault,
            color: item.color
        });
        setEditingId(item._id); // Use MongoDB ID
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this indicator?')) return;
        
        try {
            const res = await fetch(`http://localhost:5000/api/abnormal-indications/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                if (editingId === id) {
                    setEditingId(null);
                    setNewIndication({ low: '', high: '', isDefault: false, color: '#DC2626' });
                }
                fetchIndications();
            }
        } catch (err) {
            console.error("Delete Error:", err);
        }
    };

    const colors = ['Black', 'Brown', 'Red', 'Blue', 'Green', 'Orange', 'Purple'];

    return (
        <div className="p-6 md:p-8 min-h-screen bg-slate-50/50 font-sans">
            <header className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                        <AlertCircle className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Abnormal Indications</h1>
                        <p className="text-sm text-slate-500 font-medium">Configure visual alerts for abnormal test results</p>
                    </div>
                </div>
            </header>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto space-y-6"
            >
                {/* Addition Form Card */}
                <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Plus size={18} className={editingId ? "text-amber-500" : "text-emerald-500"} />
                            <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-widest">
                                {editingId ? "Edit Existing Indication" : "Register New Indication"}
                            </h3>
                        </div>
                        {editingId && (
                            <button 
                                onClick={() => {
                                    setEditingId(null);
                                    setNewIndication({ low: '', high: '', isDefault: false, color: '#DC2626' });
                                }}
                                className="text-[10px] bg-slate-100 text-slate-500 font-bold px-3 py-1 rounded-full hover:bg-slate-200 transition-colors uppercase tracking-widest"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Low Value Symbol</label>
                                <input 
                                    type="text" 
                                    value={newIndication.low}
                                    onChange={(e) => setNewIndication({...newIndication, low: e.target.value})}
                                    placeholder="e.g. ↑"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">High Value Symbol</label>
                                <input 
                                    type="text" 
                                    value={newIndication.high}
                                    onChange={(e) => setNewIndication({...newIndication, high: e.target.value})}
                                    placeholder="e.g. ↓"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                                />
                            </div>
                            <div className="flex flex-col items-center justify-center space-y-2 pb-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase">Default</label>
                                <input 
                                    type="checkbox" 
                                    checked={newIndication.isDefault}
                                    onChange={(e) => setNewIndication({...newIndication, isDefault: e.target.checked})}
                                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Color (Picker)</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <input 
                                            type="text" 
                                            value={newIndication.color}
                                            onChange={(e) => setNewIndication({...newIndication, color: e.target.value})}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-xs font-mono font-bold"
                                        />
                                    </div>
                                    <input 
                                        type="color" 
                                        value={newIndication.color.startsWith('#') ? newIndication.color : '#000000'}
                                        onChange={(e) => setNewIndication({...newIndication, color: e.target.value})}
                                        className="w-11 h-[42px] p-1 bg-white border border-slate-200 rounded-xl cursor-pointer"
                                    />
                                </div>
                            </div>
                            <button 
                                onClick={handleAdd}
                                className={`h-[42px] font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 px-6 ${
                                    editingId ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200" : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200"
                                }`}
                            >
                                {editingId ? <ArrowUp size={18} /> : <Plus size={18} />}
                                {editingId ? "Update" : "Add New"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200">
                                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider text-center w-16">#</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Low Indication</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">High Indication</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider text-center">Default</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Indicator Color</th>
                                    <th className="px-6 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {indications.map((item, index) => (
                                    <motion.tr 
                                        layout
                                        key={item._id}
                                        className={`transition-colors group ${editingId === item._id ? "bg-indigo-50/30" : "hover:bg-slate-50/50"}`}
                                    >
                                        <td className="px-6 py-4 text-center font-bold text-slate-400 text-sm">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 font-bold border border-rose-100">
                                                    {item.low}
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">Low Bound</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 font-bold border border-blue-100">
                                                    {item.high}
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">High Bound</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {item.isDefault ? (
                                                <div className="inline-flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full">
                                                    <CheckCircle2 size={14} strokeWidth={3} />
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center justify-center w-6 h-6 border-2 border-slate-200 rounded-full" />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-[11px] font-bold tracking-tight uppercase" style={{ color: item.color }}>{item.color}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleEdit(item)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Config Card */}
                <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-xl shadow-slate-100 p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-50 rounded-xl">
                                <Palette className="text-amber-500" size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Global Result Appearance</h4>
                                <p className="text-xs text-slate-500">Configure font color for abnormal values in reports</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Abnormal Result Color :</span>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={footerColor}
                                    onChange={(e) => setFooterColor(e.target.value)}
                                    className="w-28 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold outline-none"
                                />
                                <input 
                                    type="color" 
                                    value={footerColor.startsWith('#') ? footerColor : '#dc2626'}
                                    onChange={(e) => setFooterColor(e.target.value)}
                                    className="w-10 h-8 p-1 bg-white border border-slate-200 rounded-md cursor-pointer"
                                />
                            </div>
                            <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2">
                                <Save size={16} /> Set
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AbnormalIndication;
