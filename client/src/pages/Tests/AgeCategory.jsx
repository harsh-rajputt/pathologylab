import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Edit2, UsersRound, RefreshCw, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AgeCategory() {
    const { showNotification } = useApp();
    
    const [categories, setCategories] = useState([]);
    
    // Fetch categories on component mount
    React.useEffect(() => {
        fetchAgeCategories();
    }, []);

    const fetchAgeCategories = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/age-categories');
            const data = await res.json();
            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.error('Failed to fetch Age Categories', error);
        }
    };

    const [formData, setFormData] = useState({
        _id: null,
        name: '',
        sex: '',
        ageStart: '',
        ageEnd: '',
        type: ''
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.sex) {
            showNotification('Category Name and Under (Sex) are required!', 'error');
            return;
        }

        try {
            const isUpdate = isEditing && formData._id;
            const endpoint = isUpdate 
                ? `http://localhost:5000/api/age-categories/${formData._id}` 
                : 'http://localhost:5000/api/age-categories';
            
            const reqMethod = isUpdate ? 'PUT' : 'POST';

            const res = await fetch(endpoint, {
                method: reqMethod,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (data.success) {
                showNotification(isUpdate ? 'Age Category updated successfully!' : 'New Age Category registered successfully!', 'success');
                fetchAgeCategories();
                handleReset();
            } else {
                showNotification(data.error || 'Operation failed', 'error');
            }
        } catch (error) {
            console.error(error);
            showNotification('Server Error', 'error');
        }
    };

    const handleEdit = (category) => {
        setFormData({ ...category });
        setIsEditing(true);
    };

    const handleReset = () => {
        setFormData({ _id: null, name: '', sex: '', ageStart: '', ageEnd: '', type: '' });
        setIsEditing(false);
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 min-h-screen bg-slate-50/50">
            <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="max-w-[1200px] mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
            >
                {/* Purple Header matching screenshot */}
                <div className="bg-fuchsia-700 px-5 py-3.5 flex items-center justify-between text-white shadow-sm">
                    <div className="flex items-center gap-3">
                        <UsersRound size={20} className="text-fuchsia-200" strokeWidth={2.5} />
                        <h2 className="text-lg font-bold tracking-wide">Age Category</h2>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {/* Input Form Module */}
                    <form onSubmit={handleSave} className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                            <div className="md:col-span-1 space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Category</label>
                                <input 
                                    type="text" name="name" 
                                    value={formData.name} onChange={handleChange}
                                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none transition-all text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]"
                                    placeholder="e.g. Infant-M"
                                />
                            </div>

                            <div className="md:col-span-1 space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Under</label>
                                <select 
                                    name="sex" 
                                    value={formData.sex} onChange={handleChange}
                                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none transition-all text-sm font-medium text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]"
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div className="md:col-span-1 space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Age Group</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="text" name="ageStart" 
                                        value={formData.ageStart} onChange={handleChange}
                                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none transition-all text-sm font-bold text-right text-slate-800"
                                        placeholder="0"
                                    />
                                    <span className="text-slate-400 font-bold">-</span>
                                    <input 
                                        type="text" name="ageEnd" 
                                        value={formData.ageEnd} onChange={handleChange}
                                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none transition-all text-sm font-bold text-left text-slate-800"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-1 space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Type</label>
                                <input 
                                    type="text" name="type" 
                                    value={formData.type} onChange={handleChange}
                                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none transition-all text-sm font-medium text-slate-400"
                                    placeholder="D/M/Y"
                                />
                            </div>

                            <div className="md:col-span-1 flex gap-2">
                                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded shadow-sm shadow-emerald-600/30 transition-colors flex justify-center items-center gap-2">
                                    <Save size={16} /> Save
                                </button>
                                {isEditing && (
                                    <button type="button" onClick={handleReset} className="px-3 bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold py-2 rounded transition-colors" title="Cancel Edit">
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>

                    {/* Matrix View */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                                        <th className="px-5 py-3 w-16 text-center">Act</th>
                                        <th className="px-5 py-3 font-bold">Category</th>
                                        <th className="px-5 py-3 font-bold">Age Group</th>
                                        <th className="px-5 py-3 font-bold">Sex</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {categories.map((cat, i) => (
                                        <tr key={cat._id || i} className={`border-b border-slate-100 hover:bg-fuchsia-50/50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                                            <td className="px-5 py-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button 
                                                        onClick={() => handleEdit(cat)}
                                                        className="p-1.5 text-blue-500 hover:text-white hover:bg-blue-500 rounded transition-colors"
                                                        title="Edit Category"
                                                    >
                                                        <Edit2 size={15} strokeWidth={2.5} />
                                                    </button>
                                                    <button 
                                                        onClick={async () => {
                                                            if (window.confirm('Delete this category?')) {
                                                                try {
                                                                    const res = await fetch(`http://localhost:5000/api/age-categories/${cat._id}`, { method: 'DELETE' });
                                                                    if ((await res.json()).success) {
                                                                        showNotification('Category removed.', 'success');
                                                                        fetchAgeCategories();
                                                                    }
                                                                } catch (err) { console.error(err); }
                                                            }
                                                        }}
                                                        className="p-1.5 text-rose-500 hover:text-white hover:bg-rose-500 rounded transition-colors"
                                                        title="Delete Category"
                                                    >
                                                        <X size={15} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 font-bold text-slate-800">{cat.name}</td>
                                            <td className="px-5 py-3 text-slate-600 font-mono text-sm">{cat.ageStart}-{cat.ageEnd}</td>
                                            <td className="px-5 py-3 font-medium text-slate-600">{cat.sex}</td>
                                        </tr>
                                    ))}
                                    {categories.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-5 py-10 text-center text-slate-400 font-medium">
                                                No categories configured.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
