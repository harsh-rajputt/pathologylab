import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Calendar, Clock, Activity, FileText, 
    UserPlus, Trash2, Syringe, Stethoscope, 
    Save, PlusCircle, CheckCircle2, Phone,
    Wallet, CreditCard, LayoutList, RefreshCcw, HandCoins
} from 'lucide-react';

const COMMON_TESTS = [
    { name: "Complete Blood Count (CBC)", price: 400 },
    { name: "Lipid Profile", price: 600 },
    { name: "Liver Function Test (LFT)", price: 750 },
    { name: "Kidney Function Test (KFT)", price: 650 },
    { name: "Thyroid Profile (T3, T4, TSH)", price: 500 },
    { name: "Blood Sugar Fasting (FBS)", price: 150 },
    { name: "HbA1c", price: 450 },
    { name: "Urine Routine & Microscopy", price: 200 },
    { name: "Vitamin D3", price: 1200 },
    { name: "Vitamin B12", price: 1000 }
];

const SAMPLE_TYPES = [
    "Blood", "Urine", "Stool", "Sputum", "Swab", "Tissue", "Semen", "Other"
];

export default function PatientRegistration() {
    const navigate = useNavigate();
    const location = useLocation();
    const defaultDate = new Date().toISOString().split('T')[0];
    const defaultTime = new Date().toTimeString().slice(0, 5);

    const [formData, setFormData] = useState({
        prefix: 'Mr.',
        fullName: '',
        age: '',
        ageUnit: 'Years',
        gender: 'Male',
        mobileNo: '',
        weight: '',
        reportingDate: defaultDate,
        reportingTime: defaultTime,
        referBy: 'Self',
        sampleType: 'Blood',
        remarks: ''
    });

    const [selectedTests, setSelectedTests] = useState([]);
    const [currentTest, setCurrentTest] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // Edit mode tracking
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // Amount Details State
    const [amountDetails, setAmountDetails] = useState({
        discount: '',
        discountType: '₹',
        discountBy: 'Self',
        payMode: 'Cash',
        received: '',
        transactionId: ''
    });

    useEffect(() => {
        if (location.state?.editPatient) {
            const patient = location.state.editPatient;
            setFormData({
                prefix: patient.prefix || 'Mr.',
                fullName: patient.fullName || '',
                age: patient.age || '',
                ageUnit: patient.ageUnit || 'Years',
                gender: patient.gender || 'Male',
                mobileNo: patient.mobileNo || '',
                weight: patient.weight || '',
                reportingDate: patient.reportingDate || defaultDate,
                reportingTime: patient.reportingTime || defaultTime,
                referBy: patient.referBy || 'Self',
                sampleType: patient.sampleType || 'Blood',
                remarks: patient.remarks || ''
            });
            setSelectedTests(patient.tests || []);
            setAmountDetails({
                discount: patient.amounts?.discount || '',
                discountType: patient.amounts?.discountType || '₹',
                discountBy: patient.amounts?.discountBy || 'Self',
                payMode: patient.amounts?.payMode || 'Cash',
                received: patient.amounts?.received || '',
                transactionId: patient.amounts?.transactionId || ''
            });
            setIsEditMode(true);
            setEditId(patient._id);
        }
    }, [location.state, defaultDate, defaultTime]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAmountChange = (e) => {
        const { name, value } = e.target;
        setAmountDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleAddTest = () => {
        if (currentTest.trim() && !selectedTests.some(t => t.name.toLowerCase() === currentTest.trim().toLowerCase())) {
            const predefined = COMMON_TESTS.find(t => t.name.toLowerCase() === currentTest.trim().toLowerCase());
            setSelectedTests(prev => [...prev, {
                name: currentTest.trim(), 
                price: predefined ? predefined.price : 0 // User can add custom test, default price 0
            }]);
            setCurrentTest('');
            setAmountDetails(prev => ({ ...prev, received: '' })); // Reset received when tests change
        }
    };

    const handleRemoveTest = (testNameToRemove) => {
        setSelectedTests(prev => prev.filter(test => test.name !== testNameToRemove));
    };

    const handleTestPriceChange = (testName, newPrice) => {
        setSelectedTests(prev => prev.map(test => 
            test.name === testName ? { ...test, price: Number(newPrice) || 0 } : test
        ));
    };

    // Derived Amount Calculations
    const totalAmount = selectedTests.reduce((sum, test) => sum + (Number(test.price) || 0), 0);
    const discountVal = Number(amountDetails.discount) || 0;
    const discountAmount = amountDetails.discountType === '₹' 
        ? discountVal 
        : (totalAmount * discountVal / 100);
    const payableAmount = Math.max(0, totalAmount - discountAmount);
    const dues = Math.max(0, payableAmount - (Number(amountDetails.received) || 0));

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const payload = {
            ...formData,
            tests: selectedTests,
            amounts: { ...amountDetails, totalAmount, payableAmount, dues },
            status: 'New'
        };

        if (!isEditMode) {
            payload.id = "LAB-" + Math.floor(10000 + Math.random() * 90000); // Random ID like LAB-12345
        }

        try {
            const endpoint = isEditMode ? `http://localhost:5000/api/patients/${editId}` : 'http://localhost:5000/api/patients';
            const methodType = isEditMode ? 'PUT' : 'POST';

            const res = await fetch(endpoint, {
                method: methodType,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if (data.success) {
                console.log(isEditMode ? "Updated:" : "Registered:", data.patient);
                setIsSubmitted(true);
                setTimeout(() => setIsSubmitted(false), 3000);
                
                if (!isEditMode) {
                    // Clear Form automatically (optional but good practice)
                    setSelectedTests([]);
                    setFormData(prev => ({...prev, fullName: '', age: '', mobileNo: '', weight: '', remarks: ''}));
                    setAmountDetails(prev => ({...prev, received: '', transactionId: '', discount: ''}));
                }
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error("Save Error:", err);
            alert("Failed to connect to backend server");
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 lg:p-12">
            <motion.div 
                className="max-w-[1400px] mx-auto"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Header Section */}
                <motion.div variants={itemVariants} className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                            <UserPlus className="h-8 w-8 text-indigo-600" />
                            {isEditMode ? "Edit Patient Registration" : "New Patient Registration"}
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Enter patient details, select investigations, and manage billing.
                        </p>
                    </div>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Top Section: Patient Details & Clinical Reference */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Patient Information Card */}
                        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-indigo-500" />
                                <h2 className="text-lg font-semibold text-slate-800">Patient Details</h2>
                            </div>
                            
                            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-5">
                                {/* Prefix & Name */}
                                <div className="md:col-span-12 space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Patient Name <span className="text-red-500">*</span></label>
                                    <div className="flex gap-3">
                                        <select 
                                            name="prefix" 
                                            value={formData.prefix}
                                            onChange={handleInputChange}
                                            className="w-24 px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 outline-none transition-all"
                                        >
                                            <option value="Mr.">Mr.</option>
                                            <option value="Mrs.">Mrs.</option>
                                            <option value="Ms.">Ms.</option>
                                            <option value="Mast.">Mast.</option>
                                            <option value="Dr.">Dr.</option>
                                        </select>
                                        <input 
                                            type="text" 
                                            name="fullName"
                                            required
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            placeholder="Full Name" 
                                            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Age & Gender */}
                                <div className="md:col-span-6 space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Age & Gender <span className="text-red-500">*</span></label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="number" 
                                            name="age"
                                            required
                                            min="0"
                                            value={formData.age}
                                            onChange={handleInputChange}
                                            placeholder="Age" 
                                            className="w-20 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 outline-none transition-all"
                                        />
                                        <select 
                                            name="ageUnit"
                                            value={formData.ageUnit}
                                            onChange={handleInputChange}
                                            className="px-2 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 outline-none transition-all"
                                        >
                                            <option value="Years">Yrs</option>
                                            <option value="Months">Mos</option>
                                            <option value="Days">Days</option>
                                        </select>
                                        <select 
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 outline-none transition-all"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Mobile No */}
                                <div className="md:col-span-3 space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Mobile No</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <input 
                                            type="tel" 
                                            name="mobileNo"
                                            value={formData.mobileNo}
                                            onChange={handleInputChange}
                                            placeholder="10-digit no." 
                                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Weight */}
                                <div className="md:col-span-3 space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Weight (kg)</label>
                                    <input 
                                        type="number" 
                                        name="weight"
                                        min="0"
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 65" 
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Clinical Reference Card */}
                        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
                                <Stethoscope className="w-5 h-5 text-teal-500" />
                                <h2 className="text-lg font-semibold text-slate-800">Clinical Reference</h2>
                            </div>
                            
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Refer By */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Referred By <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Stethoscope className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input 
                                            type="text" 
                                            name="referBy"
                                            required
                                            value={formData.referBy}
                                            onChange={handleInputChange}
                                            placeholder="Doctor's Name / Self" 
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Sample Type */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Sample Type</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Syringe className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <select 
                                            name="sampleType"
                                            value={formData.sampleType}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-700 outline-none transition-all appearance-none"
                                        >
                                            {SAMPLE_TYPES.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Reporting Date */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Reporting Date</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Calendar className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input 
                                            type="date" 
                                            name="reportingDate"
                                            value={formData.reportingDate}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Reporting Time */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Reporting Time</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Clock className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input 
                                            type="time" 
                                            name="reportingTime"
                                            value={formData.reportingTime}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom Section: Tests & Amounts */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        
                        {/* Investigation Card */}
                        <motion.div variants={itemVariants} className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-rose-500" />
                                <h2 className="text-lg font-semibold text-slate-800">Investigations</h2>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                {/* Add Test Input */}
                                <div className="space-y-2 mb-6">
                                    <label className="text-sm font-medium text-slate-700">Search Package, Profile or Test <span className="text-red-500">*</span></label>
                                    <div className="flex gap-3">
                                        <div className="relative flex-1">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FileText className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input 
                                                type="text" 
                                                value={currentTest}
                                                onChange={(e) => setCurrentTest(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTest())}
                                                placeholder="--- Search Test Name ---" 
                                                list="common-tests"
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900 outline-none transition-all"
                                            />
                                            <datalist id="common-tests">
                                                {COMMON_TESTS.map(test => (
                                                    <option key={test.name} value={test.name} />
                                                ))}
                                            </datalist>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={handleAddTest}
                                            disabled={!currentTest.trim()}
                                            className="px-5 py-2.5 bg-rose-50 text-rose-600 font-semibold rounded-lg hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                        >
                                            <PlusCircle className="w-5 h-5" />
                                            <span className="hidden sm:inline">Add</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Selected Tests List */}
                                <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 flex flex-col min-h-[220px]">
                                    <div className="px-4 py-3 border-b border-slate-200 bg-slate-100/50 flex justify-between items-center">
                                        <h3 className="text-sm font-semibold text-slate-700">Added Tests ({selectedTests.length})</h3>
                                        {selectedTests.length === 0 && <span className="text-xs text-rose-500 font-medium">* Required</span>}
                                    </div>
                                    <div className="p-4 flex-1 overflow-auto">
                                        <AnimatePresence>
                                            {selectedTests.length === 0 ? (
                                                <motion.p 
                                                    initial={{ opacity: 0 }} 
                                                    animate={{ opacity: 1 }} 
                                                    className="text-center text-sm text-slate-400 mt-10"
                                                >
                                                    List is empty. Add a test to see it here.
                                                </motion.p>
                                            ) : (
                                                <div className="space-y-3">
                                                    {selectedTests.map((test) => (
                                                        <motion.div
                                                            key={test.name}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                                            className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-lg shadow-sm"
                                                        >
                                                            <span className="text-sm font-medium text-slate-700 font-mono truncate mr-2" title={test.name}>{test.name}</span>
                                                            <div className="flex items-center gap-4 shrink-0">
                                                                <div className="flex items-center bg-slate-50 border border-slate-300 rounded-md overflow-hidden">
                                                                    <span className="px-2 text-slate-500 text-xs">₹</span>
                                                                    <input 
                                                                        type="number" 
                                                                        min="0"
                                                                        value={test.price} 
                                                                        onChange={(e) => handleTestPriceChange(test.name, e.target.value)}
                                                                        className="w-16 py-1 px-1 bg-transparent text-sm text-right outline-none font-medium text-slate-700"
                                                                    />
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveTest(test.name)}
                                                                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                                
                                {/* Remarks */}
                                <div className="mt-6 space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Remarks</label>
                                    <input 
                                        type="text" 
                                        name="remarks"
                                        value={formData.remarks}
                                        onChange={handleInputChange}
                                        placeholder="Any additional remarks..." 
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-900 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Amount Details Card */}
                        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                            <div className="bg-slate-50 border-b border-amber-200/50 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Wallet className="w-5 h-5 text-amber-500" />
                                    <h2 className="text-lg font-semibold text-slate-800">Billing Details</h2>
                                </div>
                                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-md font-bold">₹ INR</span>
                            </div>
                            
                            <div className="p-6 flex-1 space-y-5 bg-gradient-to-b from-white to-slate-50/30">
                                
                                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                    <span className="text-sm font-medium text-slate-500">Total Amount</span>
                                    <span className="text-lg font-bold text-slate-800">₹ {totalAmount.toFixed(2)}</span>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Discounts</label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 flex bg-white border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 transition-all">
                                            <input 
                                                type="number" 
                                                min="0"
                                                name="discount"
                                                value={amountDetails.discount}
                                                onChange={handleAmountChange}
                                                placeholder="0"
                                                className="w-full px-3 py-2 outline-none text-slate-800 font-medium"
                                            />
                                            <select 
                                                name="discountType"
                                                value={amountDetails.discountType}
                                                onChange={handleAmountChange}
                                                className="bg-slate-50/50 border-l border-slate-300 px-2 outline-none text-slate-700 font-medium cursor-pointer"
                                            >
                                                <option value="₹">₹</option>
                                                <option value="%">%</option>
                                            </select>
                                        </div>
                                        <select 
                                            name="discountBy"
                                            value={amountDetails.discountBy}
                                            onChange={handleAmountChange}
                                            className="w-1/3 px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-700 outline-none text-sm"
                                        >
                                            <option value="Self">Self</option>
                                            <option value="Doctor">Doctor</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-3 border-y border-amber-100 bg-amber-50/30 px-3 rounded-lg">
                                    <span className="text-sm font-bold text-slate-700">Payable Amount</span>
                                    <span className="text-xl font-black text-amber-600">₹ {payableAmount.toFixed(2)}</span>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-500 uppercase">Received</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                                    <span className="text-slate-400 font-medium">₹</span>
                                                </div>
                                                <input 
                                                    type="number" 
                                                    name="received"
                                                    value={amountDetails.received}
                                                    onChange={handleAmountChange}
                                                    placeholder="0"
                                                    className="w-full pl-6 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-bold outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-500 uppercase">Dues</label>
                                            <div className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-rose-600 font-bold text-right pointer-events-none">
                                                ₹ {dues.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-500 uppercase">Payment Mode</label>
                                        <select 
                                            name="payMode"
                                            value={amountDetails.payMode}
                                            onChange={handleAmountChange}
                                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 outline-none transition-all"
                                        >
                                            <option value="Cash">Cash</option>
                                            <option value="Credit Card">Credit Card</option>
                                            <option value="UPI">UPI</option>
                                            <option value="Bank Transfer">Bank Transfer</option>
                                        </select>
                                    </div>

                                    {amountDetails.payMode !== 'Cash' && (
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-500 uppercase">Transaction ID</label>
                                            <input 
                                                type="text" 
                                                name="transactionId"
                                                value={amountDetails.transactionId}
                                                onChange={handleAmountChange}
                                                placeholder="TXN ID / Ref No"
                                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 outline-none transition-all"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Action Buttons */}
                    <motion.div variants={itemVariants} className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
                        <AnimatePresence>
                            {isSubmitted && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-lg border border-emerald-200 mr-4"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span className="text-sm font-medium">Saved Successfully!</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button 
                            type="button"
                            onClick={() => navigate('/patients/list')}
                            className="p-2.5 text-slate-500 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                            title="List All"
                        >
                            <LayoutList className="w-5 h-5" />
                        </button>
                        <button 
                            type="button"
                            className="p-2.5 text-slate-500 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                            title="Refresh Form"
                            onClick={() => window.location.reload()}
                        >
                            <RefreshCcw className="w-5 h-5" />
                        </button>
                        <button 
                            type="submit"
                            disabled={selectedTests.length === 0}
                            className="px-8 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {isEditMode ? "Update Registration" : "Save Registration"}
                        </button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
}
