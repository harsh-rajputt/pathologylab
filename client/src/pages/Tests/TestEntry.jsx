import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileEdit, List as ListIcon, Save, RefreshCw, Maximize2, IndianRupee, X } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useLocation, useNavigate } from 'react-router-dom';

import { InputField, SelectField, Checkbox } from '../../components/UI/FormControls';

export default function TestEntry() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(false);

    const [formData, setFormData] = useState({
        testName: '', wing: 'PATHOLOGY', department: '', unit: '', testFormat: 'Single',
        nr1: '', nr2: '', nr3: '', nr4: '', nr5: '',
        setDefault: false, normalLower: '0', normalHigher: '0', defaultResult: '', method: '', sample: 'Sample',
        vial: '', reportingDays: '', rate: '0', discount: '0', offerRate: '0',
        content: '',
        showMethod: false, showComment: false, testNameBold: false, useCommentResult: false,
        resultBold: false, paragraphResult: false, pageBreak: false, showShortCode: false,
        testId: '0', testCode: '', shortCode: ''
    });

    const [isAgeGroupModalOpen, setIsAgeGroupModalOpen] = useState(false);
    const [ageGroups, setAgeGroups] = useState([]);

    useEffect(() => {
        const fetchTestData = async (id) => {
            try {
                const res = await fetch(`http://localhost:5000/api/tests/${id}`);
                const data = await res.json();
                if (data.success && data.test) {
                    const t = data.test;
                    setFormData(prev => ({
                        ...prev,
                        ...t,
                        testName: t.testName || t.name || '',
                        testFormat: t.testFormat || t.format || 'Single',
                        department: t.department || '',
                        unit: t.unit || '',
                        wing: t.wing || 'PATHOLOGY',
                        rate: t.rate ?? 0,
                        discount: t.discount ?? 0,
                        offerRate: t.offerRate ?? 0,
                        content: t.content || '',
                        _id: t._id || t.id
                    }));

                    if (t.ageGroups && Array.isArray(t.ageGroups) && t.ageGroups.length > 0) {
                        setAgeGroups(prev => {
                            if (prev.length === 0) return t.ageGroups; // If metadata not loaded yet
                            return prev.map(dbGroup => {
                                const savedOverride = t.ageGroups.find(saved => saved.category === dbGroup.category);
                                return savedOverride ? { ...dbGroup, lower: savedOverride.lower, higher: savedOverride.higher } : dbGroup;
                            });
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch test details", error);
            }
        };

        if (location.state && location.state.test) {
            setIsEditMode(true);
            const initialTest = location.state.test;
            const testId = initialTest._id || initialTest.id;
            
            if (testId) {
                fetchTestData(testId);
            } else {
                // Fallback for simple cases if ID is missing (should not happen normally)
                setFormData(prev => ({ ...prev, ...initialTest }));
            }
        }
    }, [location.state]);

    const [unitOptions, setUnitOptions] = useState(["Select Unit"]);
    const [wingOptions, setWingOptions] = useState(["PATHOLOGY", "RADIOLOGY", "ECG", "CT SCAN"]);
    const [departmentOptions, setDepartmentOptions] = useState(["Select Department", "HAEMATOLOGY", "BIOCHEMESTRY"]);

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                // Fetch Units
                const resUnits = await fetch('http://localhost:5000/api/test-units');
                const dataUnits = await resUnits.json();
                if (dataUnits.success) {
                    setUnitOptions(["Select Unit", ...dataUnits.units.map(u => u.name)]);
                }

                // Fetch Wings
                const resWings = await fetch('http://localhost:5000/api/wings');
                const dataWings = await resWings.json();
                if (dataWings.success && dataWings.wings?.length > 0) {
                    setWingOptions(dataWings.wings.map(w => w.name));
                }

                // Fetch Departments
                const resDepts = await fetch('http://localhost:5000/api/departments');
                const dataDepts = await resDepts.json();
                if (dataDepts.success && dataDepts.departments?.length > 0) {
                    setDepartmentOptions(["Select Department", ...dataDepts.departments.map(d => d.name)]);
                }

                // Fetch Age Categories for Normal Range Matrix
                const resAge = await fetch('http://localhost:5000/api/age-categories');
                const dataAge = await resAge.json();
                if (dataAge.success && dataAge.categories?.length > 0) {
                    const mappedGroups = dataAge.categories.map((c, idx) => ({
                        id: c._id || (idx + 1),
                        category: c.name,
                        normalRange: `${c.ageStart}-${c.ageEnd}`,
                        lower: '0',
                        higher: '0'
                    }));
                    
                    // Carefully merge with existing test config if already loaded (edit mode edge case)
                    setAgeGroups(prev => {
                        return mappedGroups.map(dbGroup => {
                            const existing = prev.find(p => p.category === dbGroup.category);
                            return existing ? { ...dbGroup, lower: existing.lower, higher: existing.higher } : dbGroup;
                        });
                    });
                }
            } catch (error) {
                console.error("Failed to fetch dynamic test metadata options", error);
            }
        };
        fetchMetadata();
    }, []);

    const handleAgeGroupChange = (id, field, value) => {
        setAgeGroups(prev => prev.map(group => group.id === id ? { ...group, [field]: value } : group));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        try {
            const payload = {
                ...formData,
                ageGroups: ageGroups
            };

            const endpoint = isEditMode ? `http://localhost:5000/api/tests/${formData._id}` : 'http://localhost:5000/api/tests';
            const method = isEditMode ? 'PUT' : 'POST';

            const res = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (data.success) {
                alert(isEditMode ? 'Test layout updated systematically!' : 'Test layout saved systematically!');
                if (isEditMode) {
                    navigate('/tests/list');
                    return;
                }
                setFormData({
                    testName: '', wing: 'PATHOLOGY', department: '', unit: '', testFormat: 'Single',
                    nr1: '', nr2: '', nr3: '', nr4: '', nr5: '',
                    setDefault: false, normalLower: '0', normalHigher: '0', defaultResult: '', method: '', sample: 'Sample',
                    vial: '', reportingDays: '', rate: '0', discount: '0', offerRate: '0',
                    content: '',
                    showMethod: false, showComment: false, testNameBold: false, useCommentResult: false,
                    resultBold: false, paragraphResult: false, pageBreak: false, showShortCode: false,
                    testId: '0', testCode: '', shortCode: ''
                });
                setAgeGroups(prev => prev.map(group => ({ ...group, lower: '0', higher: '0' })));
            } else {
                alert(data.error || "Failed to save test configuration");
            }
        } catch (error) {
            console.error(error);
            alert('Server error occurred');
        }
    };

    return (
        <div className="p-4 md:p-6 min-h-screen bg-slate-50/50 font-sans">
            <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-fuchsia-100 text-fuchsia-600 rounded-xl shadow-sm">
                            <FileEdit size={24} strokeWidth={2.5} />
                        </div>
                        {isEditMode ? "Edit Test Configuration" : "Test Entry Configuration"}
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Configure deep clinical test properties, formats, formatting, and pricing parameters.</p>
                </motion.div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden"
            >
                {/* Purple Header */}
                <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 px-5 py-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                        <ListIcon size={20} strokeWidth={2.5} />
                        <h2 className="text-lg font-bold tracking-wide">Test Entry</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            type="button" 
                            onClick={() => navigate('/tests/list')} 
                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors font-medium text-sm"
                            title="Go to Test List"
                        >
                            <ListIcon size={16} /> Test List
                        </button>
                        <button type="button" onClick={() => window.location.reload()} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors" title="Reload Frame"><RefreshCw size={18} /></button>
                    </div>
                </div>

                <form onSubmit={handleSave} className="p-6 md:p-8">
                    {/* Top 4-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 mb-6">

                        {/* Column 1 */}
                        <div>
                            <InputField label="Test Name" name="testName" value={formData.testName} onChange={handleChange} />
                            <SelectField label="Wing" name="wing" value={formData.wing} onChange={handleChange} options={wingOptions} />
                            <SelectField label="Department" name="department" value={formData.department} onChange={handleChange} options={departmentOptions} />
                            <SelectField label="Unit" name="unit" value={formData.unit} onChange={handleChange} options={unitOptions} />
                            <SelectField label="Test Format" name="testFormat" value={formData.testFormat} onChange={handleChange} options={["Single", "Multiple", "Heading", "Profile"]} />
                        </div>

                        {/* Column 2 */}
                        <div>
                            <InputField label="Normal Range 1" name="nr1" value={formData.nr1} onChange={handleChange} />
                            <InputField label="Normal Range 2" name="nr2" value={formData.nr2} onChange={handleChange} />
                            <InputField label="Normal Range 3" name="nr3" value={formData.nr3} onChange={handleChange} />
                            <InputField label="Normal Range 4" name="nr4" value={formData.nr4} onChange={handleChange} />
                            <InputField label="Normal Range 5" name="nr5" value={formData.nr5} onChange={handleChange} />
                        </div>

                        {/* Column 3 */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-xs font-semibold text-slate-600">Set Age Based Normal Range</label>
                            </div>
                            <div className="flex items-center justify-between gap-2 mb-3 mt-1">
                                <Checkbox label="Set Default" name="setDefault" checked={formData.setDefault} onChange={handleChange} />
                                <button type="button" onClick={() => setIsAgeGroupModalOpen(true)} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 outline-none text-white text-xs font-bold rounded-md shadow-sm transition-colors">Open Age Group...</button>
                            </div>

                            <div className="flex gap-4">
                                <InputField label="Normal Lower" name="normalLower" value={formData.normalLower} onChange={handleChange} className="flex-1" />
                                <InputField label="Normal Higher" name="normalHigher" value={formData.normalHigher} onChange={handleChange} className="flex-1" />
                            </div>

                            <InputField label="Default Result" name="defaultResult" value={formData.defaultResult} onChange={handleChange} />
                            <InputField label="Method" name="method" value={formData.method} onChange={handleChange} />
                            <SelectField label="Sample" name="sample" value={formData.sample} onChange={handleChange} options={["Sample", "Blood", "Urine", "Serum"]} />
                        </div>

                        {/* Column 4 */}
                        <div>
                            <SelectField label="Vial" name="vial" value={formData.vial} onChange={handleChange} options={["Select Vial", "EDTA", "SST", "Plain Tube"]} />
                            <SelectField label="Reporting Days" name="reportingDays" value={formData.reportingDays} onChange={handleChange} options={["Reporting Days", "1 Day", "2 Days", "Same Day"]} />

                            <div className="flex flex-col mb-3">
                                <label className="text-xs font-semibold text-slate-600 mb-1">Rate To Patient</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 px-3 flex items-center bg-emerald-100/50 border-r border-emerald-500 rounded-l-lg pointer-events-none">
                                        <IndianRupee size={15} className="text-emerald-700 font-bold" />
                                    </div>
                                    <input
                                        type="number" name="rate" value={formData.rate} onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 bg-emerald-50/10 border border-emerald-500 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all font-bold text-slate-800 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <InputField label="Discount %" name="discount" type="number" value={formData.discount} onChange={handleChange} className="flex-1" />
                                <InputField label="Offer Rate" name="offerRate" type="number" value={formData.offerRate} onChange={handleChange} className="flex-1" />
                            </div>
                        </div>

                    </div>

                    {/* Rich Text Editor */}
                    <div className="mb-6">
                        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-fuchsia-500/20 focus-within:border-fuchsia-500 transition-all [&_.ql-toolbar]:border-none [&_.ql-toolbar]:bg-slate-50 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[160px]">
                            <ReactQuill
                                theme="snow"
                                value={formData.content}
                                onChange={(content) => setFormData({ ...formData, content })}
                                placeholder="Enter detailed test specifications, interpretation guidelines, or default formatting..."
                                className="text-slate-700 font-medium h-48 mb-11"
                            />
                        </div>
                    </div>

                    {/* Formatting Checkboxes */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-y-4 gap-x-6 mb-8 px-2">
                        <Checkbox label="Show Method" name="showMethod" checked={formData.showMethod} onChange={handleChange} />
                        <Checkbox label="Show Comment" name="showComment" checked={formData.showComment} onChange={handleChange} />
                        <Checkbox label="Test Name Bold" name="testNameBold" checked={formData.testNameBold} onChange={handleChange} />
                        <Checkbox label="Use Comment as Result" name="useCommentResult" checked={formData.useCommentResult} onChange={handleChange} />
                        <Checkbox label="Result In Bold" name="resultBold" checked={formData.resultBold} onChange={handleChange} />
                        <Checkbox label="Paragraph Result" name="paragraphResult" checked={formData.paragraphResult} onChange={handleChange} />
                        <Checkbox label="Page Break" name="pageBreak" checked={formData.pageBreak} onChange={handleChange} />
                        <Checkbox label="Show Short Code" name="showShortCode" checked={formData.showShortCode} onChange={handleChange} />
                    </div>

                    {/* Bottom Row */}
                    <div className="flex flex-wrap items-end gap-5">
                        <div className="w-32">
                            <InputField label="Test ID" name="testId" type="number" value={formData.testId} onChange={handleChange} className="!mb-0" />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <InputField label="Test Code" name="testCode" value={formData.testCode} onChange={handleChange} className="!mb-0" />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <InputField label="Short Code" name="shortCode" value={formData.shortCode} onChange={handleChange} className="!mb-0" />
                        </div>
                        <button
                            type="submit"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-8 rounded-lg shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 h-10 mt-auto"
                        >
                            <Save size={18} />
                            {isEditMode ? "Update" : "Save"}
                        </button>
                    </div>

                </form>
            </motion.div>

            {/* Age Group Modal Overlay */}
            <AnimatePresence>
                {isAgeGroupModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col border border-slate-100"
                        >
                            {/* Premium Header */}
                            <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 px-6 py-4 flex items-center justify-between text-white">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <ListIcon size={18} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg tracking-wide">Age Group Configuration</h3>
                                        <p className="text-fuchsia-100 text-xs font-medium opacity-90">Set age-specific normal ranges</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsAgeGroupModalOpen(false)}
                                    className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors"
                                >
                                    <X size={20} strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-5 md:p-6 bg-slate-50/50">
                                <div className="border border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left whitespace-nowrap">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                                    <th className="py-4 px-4 w-12 text-center font-bold">#</th>
                                                    <th className="py-4 px-4 font-bold">Category</th>
                                                    <th className="py-4 px-4 font-bold">Normal Range</th>
                                                    <th className="py-4 px-4 font-bold text-emerald-600">Lower Bound</th>
                                                    <th className="py-4 px-4 font-bold text-rose-500">Higher Bound</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ageGroups.map((group, index) => (
                                                    <motion.tr
                                                        key={group.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="border-b border-slate-100 hover:bg-fuchsia-50/30 transition-colors"
                                                    >
                                                        <td className="py-3 px-4 text-center">
                                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-slate-500 font-bold text-xs">{group.id}</span>
                                                        </td>
                                                        <td className="py-3 px-4 text-slate-800 font-bold text-sm">
                                                            {group.category}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <input
                                                                type="text"
                                                                value={group.normalRange}
                                                                onChange={(e) => handleAgeGroupChange(group.id, 'normalRange', e.target.value)}
                                                                className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 focus:bg-white text-slate-700 text-sm font-medium transition-all"
                                                                placeholder="e.g. 0-0"
                                                            />
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <input
                                                                type="text"
                                                                value={group.lower}
                                                                onChange={(e) => handleAgeGroupChange(group.id, 'lower', e.target.value)}
                                                                className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white text-slate-700 text-sm font-medium transition-all"
                                                                placeholder="Lower"
                                                            />
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <input
                                                                type="text"
                                                                value={group.higher}
                                                                onChange={(e) => handleAgeGroupChange(group.id, 'higher', e.target.value)}
                                                                className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:bg-white text-slate-700 text-sm font-medium transition-all"
                                                                placeholder="Higher"
                                                            />
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        onClick={() => setIsAgeGroupModalOpen(false)}
                                        className="px-5 py-2.5 text-slate-600 bg-slate-200 hover:bg-slate-300 font-bold rounded-xl transition-colors text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => setIsAgeGroupModalOpen(false)}
                                        className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all text-sm flex items-center gap-2"
                                    >
                                        <Save size={16} />
                                        Save Configuration
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
