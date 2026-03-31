import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Boxes, Save, RefreshCw, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MultiTestSetting() {
    const { showNotification } = useApp();
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [groupName, setGroupName] = useState('');
    
    const [tests, setTests] = useState([]);
    const [selectedTests, setSelectedTests] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/tests')
            .then(res => res.json())
            .then(data => { if(data.success) setTests(data.tests); })
            .catch(err => console.error(err));
    }, []);

    const parentTests = tests.filter(t => t.testFormat === 'Multiple');
    const childTests = tests.filter(t => t.testFormat === 'Single');

    const toggleTest = (testId) => {
        if (selectedTests.includes(testId)) {
            setSelectedTests(selectedTests.filter(id => id !== testId));
        } else {
            setSelectedTests([...selectedTests, testId]);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        showNotification("Multi Test group configured successfully!", "success");
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 min-h-screen bg-slate-50/50">
            {/* Header Title */}
            <header className="mb-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl shadow-sm">
                            <Boxes size={24} strokeWidth={2.5} />
                        </div>
                        Multi Test Parameter Mapping
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Group individual parameters into multi-line testing batches.</p>
                </motion.div>
            </header>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="w-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
            >
                {/* Header matching screenshot aesthetic */}
                <div className="bg-blue-700 px-5 py-3.5 flex items-center justify-between text-white shadow-sm">
                    <div className="flex items-center gap-3">
                        <Boxes size={20} strokeWidth={2.5} />
                        <h2 className="text-lg font-bold tracking-wide">Group / Multi Test Linkage</h2>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Top Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-slate-600 mb-1">Select Department Filter</label>
                                <select 
                                    value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-800"
                                >
                                    <option value="">-- All Departments --</option>
                                    <option value="HAEMATOLOGY">HAEMATOLOGY</option>
                                </select>
                            </div>
                            
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-slate-600 mb-1">Select Group / Parent Test</label>
                                <select 
                                    value={groupName} onChange={(e) => setGroupName(e.target.value)} required
                                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-bold text-slate-800"
                                >
                                    <option value="">-- Select Target Group --</option>
                                    {parentTests.map(t => <option key={t._id} value={t._id}>{t.testName}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Linkage Area */}
                        <div className="mt-8 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                                <h3 className="text-sm font-bold text-slate-700">Assign Child Parameters</h3>
                            </div>
                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
                                {childTests.map((test) => (
                                    <label key={test._id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedTests.includes(test._id) ? 'bg-blue-50 border-blue-300 shadow-sm' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedTests.includes(test._id)}
                                            onChange={() => toggleTest(test._id)}
                                            className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 leading-tight">{test.testName}</p>
                                            <p className="text-xs text-slate-500 mt-1 font-mono">{test.shortCode || test.testCode}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button type="button" className="px-5 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold rounded-lg transition-colors flex items-center gap-2">
                                <RefreshCw size={16} /> Reset
                            </button>
                            <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-md shadow-blue-500/30 hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <Save size={18} /> Link Parameters
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
