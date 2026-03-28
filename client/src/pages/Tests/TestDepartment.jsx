import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, List as ListIcon, Building2, Search, Save, AlertCircle } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const initialData = [
    { id: 1, name: "HAEMATOLOGY", orderNo: 0, wing: "PATHOLOGY" },
    { id: 2, name: "CITY SCAN", orderNo: 0, wing: "CT SCAN" },
    { id: 3, name: "cardiology", orderNo: 0, wing: "ECG" },
    { id: 4, name: "RADIOLOGY", orderNo: 0, wing: "df" },
    { id: 5, name: "USG", orderNo: 0, wing: "df" },
    { id: 6, name: "PATHOLOGY", orderNo: 0, wing: "PATHOLOGY" },
    { id: 7, name: "OTHERS", orderNo: 0, wing: "-" },
    { id: 8, name: "X - RAY", orderNo: 1, wing: "-" },
    { id: 9, name: "RADIOLOGY 1", orderNo: 2, wing: "-" },
    { id: 10, name: "BIOCHEMESTRY", orderNo: 2, wing: "PATHOLOGY" },
    { id: 11, name: "HORMONAL EXAMINATION", orderNo: 3, wing: "PATHOLOGY" },
    { id: 12, name: "MRI", orderNo: 3, wing: "-" },
];

export default function TestDepartment() {
    const [departments, setDepartments] = useState(initialData);
    const [formData, setFormData] = useState({ id: null, name: '', orderNo: '0', wing: '', comment: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const wingsList = ["Select Wing", "PATHOLOGY", "CT SCAN", "ECG", "MRI", "X-RAY", "df"];

    const handleSave = (e) => {
        e.preventDefault();
        if (!formData.name) return;

        if (isEditing) {
            setDepartments(departments.map(dept => 
                dept.id === formData.id ? { ...dept, name: formData.name, orderNo: parseInt(formData.orderNo) || 0, wing: formData.wing === "Select Wing" ? "-" : formData.wing } : dept
            ));
        } else {
            const newId = departments.length > 0 ? Math.max(...departments.map(d => d.id)) + 1 : 1;
            setDepartments([{ id: newId, name: formData.name, orderNo: parseInt(formData.orderNo) || 0, wing: formData.wing === "Select Wing" ? "-" : formData.wing }, ...departments]);
        }
        
        // Reset form
        setFormData({ id: null, name: '', orderNo: '0', wing: '', comment: '' });
        setIsEditing(false);
    };

    const handleEdit = (dept) => {
        setFormData({ id: dept.id, name: dept.name, orderNo: dept.orderNo.toString(), wing: dept.wing === "-" ? "Select Wing" : dept.wing, comment: '' });
        setIsEditing(true);
    };

    const handleDelete = (id) => {
        if(window.confirm("Are you sure you want to delete this department?")) {
            setDepartments(departments.filter(dept => dept.id !== id));
        }
    };

    const filteredDepartments = departments.filter(dept => 
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        dept.wing.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6 min-h-screen bg-slate-50/50 font-sans">
            <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-fuchsia-100 text-fuchsia-600 rounded-xl shadow-sm">
                            <Building2 size={24} strokeWidth={2.5} />
                        </div>
                        Test Department
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Create, edit, and manage all laboratory departments.</p>
                </motion.div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Form Section (Left) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.4 }}
                    className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden sticky top-6"
                >
                    {/* Purple Header exactly as requested but modernized */}
                    <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 px-5 py-4 flex items-center gap-2 text-white">
                        <ListIcon size={20} strokeWidth={2.5} />
                        <h2 className="text-lg font-bold tracking-wide">
                            {isEditing ? "Edit Department" : "New Department"}
                        </h2>
                    </div>

                    <form onSubmit={handleSave} className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Department Name <span className="text-rose-500">*</span></label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 focus:bg-white transition-all outline-none font-medium text-slate-800"
                                placeholder="e.g. HAEMATOLOGY"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Order No</label>
                                <input 
                                    type="number" 
                                    value={formData.orderNo}
                                    onChange={(e) => setFormData({...formData, orderNo: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 focus:bg-white transition-all outline-none font-medium text-slate-800"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Wing</label>
                                <select 
                                    value={formData.wing}
                                    onChange={(e) => setFormData({...formData, wing: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 focus:bg-white transition-all outline-none font-medium text-slate-800 appearance-none"
                                >
                                    {wingsList.map(w => (
                                        <option key={w} value={w}>{w}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Comment (Optional)</label>
                            <div className="bg-white rounded-xl overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-fuchsia-500/20 focus-within:border-fuchsia-500 transition-all [&_.ql-toolbar]:border-none [&_.ql-toolbar]:bg-slate-50 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[120px]">
                                <ReactQuill 
                                    theme="snow"
                                    value={formData.comment}
                                    onChange={(content) => setFormData({...formData, comment: content})}
                                    placeholder="Add formatted instructions for reports..."
                                    className="text-slate-700 font-medium"
                                />
                            </div>
                        </div>

                        <div className="pt-2 flex gap-3">
                            <button 
                                type="submit" 
                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                {isEditing ? 'Update Department' : 'Save Department'}
                            </button>
                            {isEditing && (
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({ id: null, name: '', orderNo: '0', wing: '', comment: '' });
                                    }}
                                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </motion.div>

                {/* Table Section (Right) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col h-full"
                >
                    <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Departments</h2>
                        
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search departments..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 focus:bg-white outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                                    <th className="py-4 px-6 w-16">Actions</th>
                                    <th className="py-4 px-6">Department Name</th>
                                    <th className="py-4 px-6 text-center">Order No</th>
                                    <th className="py-4 px-6">Wing</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <AnimatePresence>
                                    {filteredDepartments.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="py-12 text-center text-slate-500">
                                                <AlertCircle className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                                                <p className="text-lg font-medium text-slate-600">No departments found</p>
                                                <p className="text-sm">Try adjusting your search query.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredDepartments.map((dept) => (
                                            <motion.tr 
                                                key={dept.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className={`border-b border-slate-100 hover:bg-fuchsia-50/30 transition-colors group ${isEditing && formData.id === dept.id ? 'bg-fuchsia-50' : ''}`}
                                            >
                                                <td className="py-3 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => handleEdit(dept)}
                                                            className={`p-1.5 rounded-md transition-colors ${isEditing && formData.id === dept.id ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:text-fuchsia-600 hover:bg-fuchsia-50'}`}
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={16} strokeWidth={2.5} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(dept.id)}
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} strokeWidth={2.5} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-6 font-bold text-slate-800">
                                                    {dept.name}
                                                </td>
                                                <td className="py-3 px-6 text-center">
                                                    <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
                                                        {dept.orderNo}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-6 font-medium text-slate-600">
                                                    {dept.wing}
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
