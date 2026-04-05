import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, X, Search, ChevronRight, Activity, Edit2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { OrderInput } from '../../components/UI/OrderInput';

export default function MultiTestSetting() {
    const { showNotification } = useApp();
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // UI State
    const [activeParentId, setActiveParentId] = useState(null);
    const [searchLeft, setSearchLeft] = useState('');
    const [searchMiddle, setSearchMiddle] = useState('');

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/tests');
            const data = await res.json();
            if (data.success) {
                // Ensure all tests have a childTests array initialized to prevent null errors
                const formattedTests = data.tests.map(t => ({
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
            showNotification("Please select a parent test to save its mapping.", "error");
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
                showNotification(`Child parameters permanently linked to ${activeParent.testName}!`, "success");
            } else {
                showNotification(data.error || "Failed to save mapping.", "error");
            }
        } catch (error) {
            console.error(error);
            showNotification("Server error during save.", "error");
        }
    };

    // Filtered Lists
    const parentTests = tests.filter(t => 
        (t.testFormat === 'Multiple' || t.testFormat === 'Heading') && 
        t.testName.toLowerCase().includes(searchLeft.toLowerCase())
    );
    const activeParent = tests.find(t => t._id === activeParentId);
    
    // Middle: show all non-parent tests (Single, Heading, etc.) not yet linked
    const availableSingleTests = tests.filter(t => 
        t.testFormat !== 'Multiple' && 
        t.testFormat !== 'Profile' && 
        (!activeParent || !activeParent.childTests.includes(t._id)) &&
        t.testName.toLowerCase().includes(searchMiddle.toLowerCase())
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
                {/* Red Header Bar matching the screenshot */}
                <div className="bg-red-600 px-5 py-3 flex items-center justify-between text-white shadow-sm">
                    <div className="flex items-center gap-2">
                        <Activity size={20} strokeWidth={2.5} />
                        <h2 className="text-lg font-bold tracking-wide">MultiTest Setting</h2>
                    </div>
                    {activeParentId && (
                        <button 
                            onClick={handleSaveMapping}
                            className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-1.5 rounded flex items-center gap-2 text-sm font-bold border border-white/20"
                        >
                            <Save size={16} /> Save Mapping
                        </button>
                    )}
                </div>

                {/* 3 Column Workbench Container */}
                <div className="p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-160px)] min-h-[600px] overflow-hidden">
                    
                    {/* LEFT COLUMN: Multiple Parent List */}
                    <div className="flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm h-full">
                        <div className="p-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
                            <div className="text-xs font-bold text-slate-500 uppercase flex-1">Search Parent</div>
                            <div className="relative w-full max-w-[200px]">
                                <input 
                                    type="text" placeholder="Search..."
                                    value={searchLeft} onChange={e => setSearchLeft(e.target.value)}
                                    className="w-full pl-8 pr-2 py-1.5 text-sm bg-white border border-emerald-500/50 rounded outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-700 placeholder:text-slate-400"
                                />
                                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-600" />
                            </div>
                        </div>
                        
                        <div className="bg-slate-100/60 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-800 flex justify-between items-center">
                            <span>TestName</span>
                        </div>
                        
                        <div className="overflow-y-auto flex-1 p-2 space-y-1 min-h-0">
                            {isLoading ? (
                                <p className="text-center text-slate-400 text-sm py-8 font-medium">Loading Parents...</p>
                            ) : parentTests.length === 0 ? (
                                <p className="text-center text-slate-400 text-sm py-8 font-medium">No Multi-Test Parents found.</p>
                            ) : (
                                parentTests.map(test => (
                                    <button 
                                        key={test._id}
                                        onClick={() => setActiveParentId(test._id)}
                                        className={`w-full text-left flex items-start gap-2 px-3 py-2.5 rounded transition-all text-sm font-bold ${activeParentId === test._id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'}`}
                                    >
                                        <ChevronRight size={16} className={`shrink-0 mt-0.5 ${activeParentId === test._id ? 'text-white' : 'text-blue-500'}`} />
                                        <span className="leading-tight">{test.testName}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* MIDDLE COLUMN: Single Child Pool */}
                    <div className="flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm h-full opacity-100 transition-opacity">
                        <div className="p-3 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
                            <div className="text-xs font-bold text-slate-500 uppercase flex-1">Search Component</div>
                            <div className="relative w-full max-w-[200px]">
                                <input 
                                    type="text" placeholder="Search parameter..."
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
                                <p className="text-center text-slate-400 text-sm py-8 font-medium">Select a Parent Test first to assign parameters.</p>
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
                                                className="shrink-0 text-blue-600 hover:text-white hover:bg-blue-600 p-0.5 rounded transition-colors"
                                                title="Assign to Multi-Test"
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
                                                onClick={() => navigate('/tests/entry', { state: { test } })}
                                                className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-0.5 rounded transition-colors"
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
                        {/* Box corresponding exactly to red border in screenshot */}
                        <div className="border border-red-600 h-full flex flex-col bg-white overflow-hidden">
                            <div className="bg-red-50/50 px-4 py-3 border-b border-red-200 text-sm font-bold text-red-700">
                                {activeParent ? activeParent.testName : "Select Multi Test"}
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-2 pr-1 space-y-1 bg-slate-50/30 min-h-0">
                                {!activeParent ? (
                                    <p className="text-center text-slate-400 text-sm py-8 font-medium">No parent selected.</p>
                                ) : linkedSingleTests.length === 0 ? (
                                    <p className="text-center text-slate-400 text-sm py-8 font-medium">No children assigned yet.</p>
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
                                                    onClick={() => navigate('/tests/entry', { state: { test } })}
                                                    className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors"
                                                    title="Edit Test"
                                                >
                                                    <Edit2 size={13} strokeWidth={2.5} />
                                                </button>
                                                <button 
                                                    onClick={() => handleRemoveChild(test._id)}
                                                    className="text-slate-400 hover:text-white hover:bg-red-500 p-0.5 rounded transition-colors"
                                                    title="Remove from Multi-Test"
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
