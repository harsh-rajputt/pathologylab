import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, FlaskConical, User, AlertTriangle, CheckCircle2, ArrowUpDown, Trash2, List } from 'lucide-react';

export default function ResultEntry() {
    const location = useLocation();
    const navigate = useNavigate();
    const patient = location.state?.patient;

    const [allTests, setAllTests] = useState([]);
    const [results, setResults] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showRedirect, setShowRedirect] = useState(false);

    const handleResultKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const allInputs = Array.from(document.querySelectorAll('[data-result-input]'));
            const idx = allInputs.indexOf(e.target);
            if (idx >= 0 && idx < allInputs.length - 1) {
                allInputs[idx + 1].focus();
            }
        }
    }, []);

    useEffect(() => {
        if (!patient) return;
        fetch('http://localhost:5000/api/tests')
            .then(r => r.json())
            .then(data => { if (data.success) setAllTests(data.data.tests); })
            .catch(err => console.error(err));
        if (patient.results) setResults(patient.results);
    }, [patient]);

    if (!patient) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-slate-500">
                <AlertTriangle size={48} className="text-amber-400" />
                <p className="text-lg font-semibold">No patient selected.</p>
                <button onClick={() => navigate('/patients/list')} className="px-6 py-2 bg-indigo-700 text-white rounded font-semibold hover:bg-indigo-800">
                    Go Back to Patient List
                </button>
            </div>
        );
    }

    const buildRows = () => {
        const rows = [];
        for (const pt of (patient.tests || [])) {
            const def = allTests.find(t => t.testName === pt.name);
            if (def && def.testFormat === 'Multiple' && def.childTests?.length > 0) {
                rows.push({ type: 'group', name: pt.name, def });
                for (const childId of def.childTests) {
                    const childDef = allTests.find(t => t._id === childId || t._id === String(childId));
                    if (childDef) {
                        // Heading format child = subgroup label row, Single = param row
                        if (childDef.testFormat === 'Heading') {
                            rows.push({ type: 'subheading', name: childDef.testName });
                        } else {
                            rows.push({ type: 'param', name: childDef.testName, def: childDef, parentName: pt.name });
                        }
                    }
                }
            } else if (def && def.testFormat === 'Heading') {
                rows.push({ type: 'subheading', name: pt.name });
            } else {
                rows.push({ type: 'param', name: pt.name, def: def || null });
            }
        }
        return rows;
    };

    const rows = buildRows();

    const handleResultChange = (testName, value) => {
        setResults(prev => ({ ...prev, [testName]: { ...prev[testName], value } }));
    };

    const getStatus = (def, testName) => {
        const val = parseFloat(results[testName]?.value);
        if (!def || isNaN(val)) return 'none';
        const low = parseFloat(def.normalLower);
        const high = parseFloat(def.normalHigher);
        if (!isNaN(low) && val < low) return 'low';
        if (!isNaN(high) && val > high) return 'high';
        return 'normal';
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`http://localhost:5000/api/patients/${patient._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ results, status: 'Result Filled' })
            });
            const data = await res.json();
            if (data.success) { setSaved(true); setShowRedirect(true); }
            else alert(data.error || 'Failed to save results');
        } catch { alert('Server error while saving results'); }
        finally { setIsSaving(false); }
    };

    const handleDelete = async () => {
        if (!window.confirm('Clear all entered results for this patient?')) return;
        setResults({});
        try {
            const res = await fetch(`http://localhost:5000/api/patients/${patient._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ results: {}, status: 'Deleted' })
            });
            const data = await res.json();
            if (!data.success) alert(data.error || 'Failed to clear results');
        } catch { alert('Server error while clearing results'); }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-3 md:p-5 font-sans">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">

                {/* Top Action Bar */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/patients/list')} className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 shadow-sm">
                            <ArrowLeft size={18} className="text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <FlaskConical size={22} className="text-indigo-600" /> Result Entry
                            </h1>
                            <p className="text-gray-500 text-xs">{patient.prefix} {patient.fullName} • {patient.age} {patient.ageUnit} • {patient.gender}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/patients/list')}
                        className="flex items-center gap-2 px-5 py-2 bg-slate-800 text-white font-bold rounded hover:bg-slate-900 shadow transition-colors"
                        title="Back to Patient List"
                    >
                        <List size={18} />
                        Patient List
                    </button>
                </div>

                {/* Patient Info */}
                <div className="bg-white border border-gray-300 rounded mb-4 px-4 py-2.5 flex flex-wrap gap-6 text-sm shadow-sm">
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-indigo-500" />
                        <span className="font-bold text-gray-800">{patient.prefix} {patient.fullName}</span>
                    </div>
                    <div><span className="text-gray-400">Lab ID: </span><span className="font-bold text-gray-700">{patient.labId || patient.id || 'N/A'}</span></div>
                    <div><span className="text-gray-400">Date: </span><span className="font-bold text-gray-700">{patient.reportingDate}</span></div>
                    <div><span className="text-gray-400">Ref By: </span><span className="font-bold text-gray-700">{patient.referBy || 'Self'}</span></div>
                    <div><span className="text-gray-400">Sample: </span><span className="font-bold text-gray-700">{patient.sampleType}</span></div>
                </div>

                {/* Results Table — matches screenshot style */}
                <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr style={{ background: '#3d3f8f' }} className="text-white">
                                <th className="px-4 py-2.5 text-left text-xs font-bold border-r border-indigo-600 w-[45%]">Test Name</th>
                                <th className="px-4 py-2.5 text-center text-xs font-bold border-r border-indigo-600 w-[18%]">Normal-Range</th>
                                <th className="px-4 py-2.5 text-center text-xs font-bold border-r border-indigo-600 w-[12%]">Unit</th>
                                <th className="px-4 py-2.5 text-center text-xs font-bold w-[22%] border-r border-indigo-600">
                                    <span className="flex items-center justify-center gap-1">Finding Result <ArrowUpDown size={12} /></span>
                                </th>
                                <th className="px-2 py-2.5 text-center text-xs font-bold w-[5%]">↑↓</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-medium">
                                        No investigations found for this patient.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row, i) => {
                                    // GROUP ROW: red background like screenshot "COMPLETE BLOOD COUNT"
                                    if (row.type === 'group') {
                                        return (
                                            <tr key={`group-${row.name}-${i}`} style={{ background: '#fff0f0' }} className="border-t border-b border-red-200">
                                                <td colSpan="5" className="px-4 py-2 font-extrabold text-red-700 text-xs tracking-wide">
                                                    <span className="mr-1 text-red-500">⚕</span>
                                                    {row.name.toUpperCase()} <span className="text-red-400">*</span>
                                                </td>
                                            </tr>
                                        );
                                    }

                                    // SUBHEADING ROW: "---DIFFERENTIAL LEUCOCYTE COUNT---"  style
                                    if (row.type === 'subheading') {
                                        return (
                                            <tr key={`sub-${row.name}-${i}`} style={{ background: '#eef2ff' }} className="border-t border-indigo-100">
                                                <td colSpan="5" className="px-4 py-1.5 text-xs font-bold text-indigo-600 tracking-wide">
                                                    ---{row.name.toUpperCase()}---
                                                </td>
                                            </tr>
                                        );
                                    }

                                    // PARAM ROW: alternating white / light blue
                                    const def = row.def;
                                    const status = getStatus(def, row.name);
                                    const isEven = i % 2 === 0;

                                    const rangeTxt = def
                                        ? [def.normalLower, def.normalHigher].filter(Boolean).join('-')
                                        : '';

                                    return (
                                        <tr
                                            key={`param-${row.name}-${i}`}
                                            style={{ background: isEven ? '#f0f4ff' : '#ffffff' }}
                                            className="border-t border-gray-200"
                                        >
                                            {/* Test Name */}
                                            <td className="px-5 py-1.5 border-r border-gray-200">
                                                <span className="text-xs font-semibold uppercase tracking-wide text-[#1a3a6b]">
                                                    {row.name}
                                                </span>
                                            </td>

                                            {/* Normal Range */}
                                            <td className="px-4 py-1.5 text-center text-xs text-gray-600 border-r border-gray-200 font-mono">
                                                {rangeTxt || '-'}
                                            </td>

                                            {/* Unit */}
                                            <td className="px-4 py-1.5 text-center text-xs text-gray-500 border-r border-gray-200">
                                                {def?.unit || '-'}
                                            </td>

                                            {/* Result Input */}
                                            <td className="px-3 py-1 border-r border-gray-200">
                                                <input
                                                    data-result-input
                                                    type="text"
                                                    value={results[row.name]?.value ?? ''}
                                                    onChange={e => handleResultChange(row.name, e.target.value)}
                                                    onKeyDown={handleResultKeyDown}
                                                    placeholder="0"
                                                    className="w-full px-3 py-1 border border-gray-300 text-sm font-bold text-gray-800 bg-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-300"
                                                />
                                            </td>

                                            {/* L / H Status Column */}
                                            <td className="px-2 py-1 text-center">
                                                {status === 'high' && <span className="font-extrabold text-sm text-red-600">H</span>}
                                                {status === 'low'  && <span className="font-extrabold text-sm text-blue-600">L</span>}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Sticky Bottom Action Bar */}
                <div className="sticky bottom-0 mt-4 bg-white border border-gray-300 rounded shadow-lg px-5 py-3 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">{patient.prefix} {patient.fullName}</span>
                        {' '}&bull;{' '}{patient.labId || patient.id || ''}
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 shadow transition-colors"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700 shadow transition-colors disabled:opacity-60"
                        >
                            {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
                            {saved ? 'Saved!' : isSaving ? 'Saving...' : 'Save Results'}
                        </button>
                    </div>
                </div>

            </motion.div>

            {/* Redirect To Modal — shown after successful save */}
            {showRedirect && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded shadow-2xl overflow-hidden w-64">
                        {/* Header */}
                        <div className="bg-red-600 flex items-center justify-between px-4 py-2.5">
                            <span className="text-white font-bold text-base">Redirect To</span>
                            <button
                                onClick={() => setShowRedirect(false)}
                                className="text-white hover:text-red-200 font-bold text-lg leading-none"
                            >
                                ✕
                            </button>
                        </div>
                        {/* Options */}
                        <div className="p-3 space-y-2 bg-gray-100">
                            <button
                                onClick={() => { setShowRedirect(false); navigate('/patients/result-print', { state: { patient, results } }); }}
                                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded transition-colors"
                            >
                                Print Option
                            </button>
                            <button
                                onClick={() => { setShowRedirect(false); navigate('/patients/list'); }}
                                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded transition-colors"
                            >
                                Patient List
                            </button>
                            <button
                                onClick={() => { setShowRedirect(false); navigate('/patients/register'); }}
                                className="w-full py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded transition-colors"
                            >
                                New Registration
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
