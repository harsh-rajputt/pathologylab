import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, X, Search, ChevronRight, ListChecks, Edit2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { OrderInput } from '../../components/UI/OrderInput';

export default function ProfileSetting() {
    const { showNotification } = useApp();
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // UI State
    const [activeParentId, setActiveParentId] = useState(null);
    const [searchLeft, setSearchLeft] = useState('');
    const [searchMiddle, setSearchMiddle] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        fetchTests();
        fetchDepartments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchTests = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/tests');
            const data = await res.json();
            if (data.success) {
                // Ensure all tests have a childTests array initialized to prevent null errors
                const formattedTests = data.data.tests.map(t => ({
                    ...t,
                    childTests: t.childTests || []
                }));
                setTests(formattedTests);
            }
        } catch (error) {
            console.error(error);
            showNotification("Failed to fetch test lists.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/departments');
            const data = await res.json();
            if (data.success && data.data.departments) {
                setDepartments(data.data.departments);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddChild = (childId) => {
        if (!activeParentId) return;
        setTests(prev => prev.map(test => {
            if (test._id === activeParentId) {
                if (!test.childTests.includes(childId)) {
                    return { ...test, childTests: [...test.childTests, childId] };
                }
            }
            return test;
        }));
    };

    const handleRemoveChild = (childId) => {
        if (!activeParentId) return;
        setTests(prev => prev.map(test => {
            if (test._id === activeParentId) {
                return { ...test, childTests: test.childTests.filter(id => id !== childId) };
            }
            return test;
        }));
    };

    const handleReorderChild = (currentIndex, newIndex) => {
        if (!activeParentId || currentIndex === newIndex) return;
        setTests(prev => prev.map(test => {
            if (test._id === activeParentId) {
                const newChildren = [...test.childTests];
                const [movedItem] = newChildren.splice(currentIndex, 1);
                newChildren.splice(newIndex, 0, movedItem);
                return { ...test, childTests: newChildren };
            }
            return test;
        }));
    };

    const handleSaveMapping = async () => {
        if (!activeParentId) {
            showNotification("Please select a profile to save its mapping.", "error");
            return;
        }

        const activeParent = tests.find(t => t._id === activeParentId);
        
        try {
            const res = await fetch(`http://localhost:5000/api/tests/${activeParentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ childTests: activeParent.childTests })
            });
            const data = await res.json();
            if (data.success) {
                showNotification(`Components permanently linked to ${activeParent.testName} Profile!`, "success");
            } else {
                showNotification(data.error || "Failed to save profile mapping.", "error");
            }
        } catch (error) {
            console.error(error);
            showNotification("Server error during save.", "error");
        }
    };

    // Filtered Lists
    const parentTests = tests.filter(t => t.testFormat === 'Profile' && t.testName.toLowerCase().includes(searchLeft.toLowerCase()));
    const activeParent = tests.find(t => t._id === activeParentId);
    
    // Middle: show all non-profile tests not yet linked
    const availableSingleTests = tests.filter(t => 
        t.testFormat !== 'Profile' && 
        (!activeParent || !activeParent.childTests.includes(t._id)) &&
        t.testName.toLowerCase().includes(searchMiddle.toLowerCase()) &&
        (selectedDepartment === '' || t.department === selectedDepartment)
    );

    // Right list (those already linked to the active parent)
    const linkedSingleTests = activeParent 
        ? activeParent.childTests.map(id => tests.find(t => t._id === id)).filter(Boolean)
        : [];

    return (
        <div className="p-4 min-h-screen bg-slate-50 font-sans">
            <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="max-w-[1600px] mx-auto bg-white shadow-xl shadow-slate-200/50 border border-slate-200 rounded-xl overflow-hidden"
            >
                {/* Emerald Header Bar matching the profile styling */}
                <div className="bg-emerald-600 px-5 py-3 flex items-center justify-between text-white shadow-sm">
                    <div className="flex items-center gap-2">
                        <ListChecks size={20} strokeWidth={2.5} />
                        <h2 className="text-lg font-bold tracking-wide">Profile / Package Setting</h2>
                    </div>
                    {activeParentId && (
                        <button 
                            onClick={handleSaveMapping}
                            className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-1.5 rounded flex items-center gap-2 text-sm font-bold border border-white/20"
                        >
                            <Save size={16} /> Save Profile Config
                        </button>
                    )}
                </div>

                {/* 3 Column Workbench Container */}
                <div className="p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-160px)] min-h-[600px] overflow-hidden">
                    
                    {/* LEFT COLUMN: Profile Parent List */}
                    <div className="flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm h-full">
                        <div className="p-3 border-b border-slate-200 bg-slate-50/50 flex flex-col gap-2">
                            <div className="text-xs font-bold text-slate-500 uppercase">Search Profiles</div>
                            <div className="relative w-full">
                                <input 
                                    type="text" placeholder="Search profile..."
                                    value={searchLeft} onChange={e => setSearchLeft(e.target.value)}
                                    className="w-full pl-8 pr-2 py-1.5 text-sm bg-white border border-emerald-500/50 rounded outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-700 placeholder:text-slate-400"
                                />
                                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-600" />
                            </div>
                        </div>
                        
                        <div className="bg-slate-100/60 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-800 flex justify-between items-center">
                            <span>Profile Name</span>
                        </div>
                        
                        <div className="overflow-y-auto flex-1 p-2 space-y-1 min-h-0">
                            {isLoading ? (
                                <p className="text-center text-slate-400 text-sm py-8 font-medium">Loading Profiles...</p>
                            ) : parentTests.length === 0 ? (
                                <p className="text-center text-slate-400 text-sm py-8 font-medium">No Profiles found.</p>
                            ) : (
                                parentTests.map(test => (
                                    <button 
                                        key={test._id}
                                        onClick={() => setActiveParentId(test._id)}
                                        className={`w-full text-left flex items-start gap-2 px-3 py-2.5 rounded transition-all text-sm font-bold ${activeParentId === test._id ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'}`}
                                    >
                                        <ChevronRight size={16} className={`shrink-0 mt-0.5 ${activeParentId === test._id ? 'text-white' : 'text-emerald-500'}`} />
                                        <span className="leading-tight">{test.testName}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* MIDDLE COLUMN: Components Pool */}
                    <div className="flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm h-full opacity-100 transition-opacity">
                        <div className="p-3 border-b border-slate-200 bg-slate-50/50 flex flex-col gap-2">
                            <div className="text-xs font-bold text-slate-500 uppercase flex justify-between items-center">
                                <span>Search Component</span>
                                <select 
                                    value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}
                                    className="px-2 py-0.5 border border-slate-300 rounded text-xs bg-white text-slate-600 outline-none"
                                >
                                    <option value="">All Depts</option>
                                    {departments.map(d => (
                                        <option key={d._id} value={d.name}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative w-full">
                                <input 
                                    type="text" placeholder="Search tests..."
                                    value={searchMiddle} onChange={e => setSearchMiddle(e.target.value)}
                                    className="w-full pl-8 pr-2 py-1.5 text-sm bg-white border border-emerald-500/50 rounded outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-700 placeholder:text-slate-400"
                                />
                                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-600" />
                            </div>
                        </div>
                        
                        <div className="bg-slate-100/60 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-800 flex justify-between items-center pr-10">
                            <span>TestName</span>
                            <span>Format</span>
                        </div>
                        
                        <div className={`overflow-y-auto flex-1 p-2 space-y-1 min-h-0 ${!activeParentId ? 'opacity-50 pointer-events-none' : ''}`}>
                            {!activeParentId ? (
                                <p className="text-center text-slate-400 text-sm py-8 font-medium">Select a Profile first to assign parameters.</p>
                            ) : availableSingleTests.length === 0 ? (
                                <p className="text-center text-slate-400 text-sm py-8 font-medium">All matched tests are already linked.</p>
                            ) : (
                                availableSingleTests.map(test => (
                                    <div 
                                        key={test._id}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                                    >
                                        <div className="flex items-start gap-2 flex-1 min-w-0">
                                            <button 
                                                onClick={() => handleAddChild(test._id)}
                                                className="shrink-0 text-emerald-600 hover:text-white hover:bg-emerald-600 p-0.5 rounded transition-colors"
                                                title="Assign to Profile"
                                            >
                                                <Plus size={18} strokeWidth={3} />
                                            </button>
                                            <span className="text-sm font-bold text-slate-700 leading-tight truncate">
                                                {test.testName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                {test.testFormat || 'Single'}
                                            </span>
                                            <button
                                                onClick={() => navigate(`/tests/entry?id=${test._id || test.id}`, { state: { test } })}
                                                className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 p-0.5 rounded transition-colors"
                                                title="Edit Test"
                                            >
                                                <Edit2 size={14} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Active Children Frame */}
                    <div className="flex flex-col h-full pl-2 overflow-hidden">
                        <div className="border border-emerald-600 h-full flex flex-col bg-white overflow-hidden rounded shadow-sm">
                            <div className="bg-emerald-50/50 px-4 py-3 border-b border-emerald-200 text-sm font-bold text-emerald-700">
                                {activeParent ? activeParent.testName : "Select Profile Package"}
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-2 pr-1 space-y-1 bg-slate-50/30 min-h-0">
                                {!activeParent ? (
                                    <p className="text-center text-slate-400 text-sm py-8 font-medium">No profile selected.</p>
                                ) : linkedSingleTests.length === 0 ? (
                                    <p className="text-center text-slate-400 text-sm py-8 font-medium">No components assigned yet.</p>
                                ) : (
                                    linkedSingleTests.map((test, index) => (
                                        <div 
                                            key={`${test._id}-${index}`}
                                            className="w-full flex items-center justify-between px-3 py-2 rounded border border-slate-200 bg-white shadow-sm"
                                        >
                                            <span className="text-sm font-bold text-slate-800 leading-tight flex items-center gap-2 flex-1 min-w-0">
                                                <OrderInput 
                                                    currentIndex={index} 
                                                    max={linkedSingleTests.length} 
                                                    onReorder={handleReorderChild} 
                                                />
                                                <span className="truncate">{test.testName}</span>
                                            </span>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <button
                                                    onClick={() => navigate(`/tests/entry?id=${test._id || test.id}`, { state: { test } })}
                                                    className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 p-1 rounded transition-colors"
                                                    title="Edit Test"
                                                >
                                                    <Edit2 size={13} strokeWidth={2.5} />
                                                </button>
                                                <button 
                                                    onClick={() => handleRemoveChild(test._id)}
                                                    className="text-slate-400 hover:text-white hover:bg-red-500 p-0.5 rounded transition-colors"
                                                    title="Remove from Profile"
                                                >
                                                    <X size={16} strokeWidth={3} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
