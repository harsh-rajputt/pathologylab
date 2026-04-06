import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar, Search, Filter,
    FileText, User, Printer, Eye, Play, X
} from 'lucide-react';

export default function PatientList() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [filters, setFilters] = useState({
        fromDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
        uptoDate: new Date().toISOString().split('T')[0],
        searchType: '',
        searchType: '',
        user: ''
    });

    // Dues Payment State
    const [targetDuesPatient, setTargetDuesPatient] = useState(null);
    const [duesFormData, setDuesFormData] = useState({
        mode: 'Cash',
        amount: '',
        discount: '0',
        transactionId: '',
        remarks: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0,5)
    });

    const fetchPatients = async () => {
        try {
            const url = new URL('http://localhost:5000/api/patients');
            if (filters.fromDate) url.searchParams.append('from', filters.fromDate);
            if (filters.uptoDate) url.searchParams.append('upto', filters.uptoDate);
            
            const res = await fetch(url.toString());
            const data = await res.json();
            if (data.success) {
                setPatients(data.patients);
            }
        } catch (error) {
            console.error("Failed to load patients:", error);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const formatDate = (isoString) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatDateTime = (dateStr, timeStr) => {
        if (!dateStr) return '';
        const d = new Date(`${dateStr}T${timeStr || '00:00'}`);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) + 
               ' ' +
               d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    // Derived Discount Amount helper
    const getDiscountAmount = (patient) => {
        if (!patient.amounts) return 0;
        const total = Number(patient.amounts.totalAmount) || 0;
        const discountVal = Number(patient.amounts.discount) || 0;
        if (patient.amounts.discountType === '₹') {
            return discountVal;
        } else {
            return (total * discountVal / 100);
        }
    };

    const handlePrint = async (patient) => {
        try {
            await fetch(`http://localhost:5000/api/patients/${patient._id || patient.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Printed' })
            });
            // Update local state so it immediately shows without reload
            setPatients(patients.map(p => (p._id === patient._id || p.id === patient.id) ? { ...p, status: 'Printed' } : p));
        } catch (error) {
            console.error('Error updating status to printed:', error);
        }
        setSelectedPatient(null);
        navigate('/patients/result-print', { state: { patient, results: patient.results || {} } });
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <div className="min-h-screen bg-slate-100/50 p-4 md:p-6 lg:p-8 pb-24">
            <motion.div 
                className="max-w-[1600px] mx-auto bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Header Section mimicking the purple banner */}
                <div className="bg-purple-700 text-white px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-200" />
                        <h1 className="text-lg font-semibold tracking-wide flex items-center">
                            <MenuIcon className="w-4 h-4 mr-2" />
                            List of Test Request
                        </h1>
                    </div>
                </div>

                {/* Filter Controls */}
                <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-end gap-5">
                    <div className="space-y-1.5 flex-1 min-w-[150px] max-w-[200px]">
                        <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase">From</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-4 w-4 text-slate-400" />
                            </div>
                            <input 
                                type="date"
                                name="fromDate"
                                value={filters.fromDate}
                                onChange={handleFilterChange}
                                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-slate-700"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-[150px] max-w-[200px]">
                        <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Upto</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-4 w-4 text-slate-400" />
                            </div>
                            <input 
                                type="date"
                                name="uptoDate"
                                value={filters.uptoDate}
                                onChange={handleFilterChange}
                                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-slate-700"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-[150px] max-w-[250px]">
                        <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase invisible">Select</label>
                        <select 
                            name="searchType"
                            value={filters.searchType}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-slate-700"
                        >
                            <option value="">Select</option>
                            <option value="ID">Reg No</option>
                            <option value="Mobile">Mobile No</option>
                        </select>
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-[150px] max-w-[250px]">
                        <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase invisible">Select User</label>
                        <select 
                            name="user"
                            value={filters.user}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-slate-700"
                        >
                            <option value="">Select User</option>
                            <option value="Admin">Admin</option>
                            <option value="User1">User 1</option>
                        </select>
                    </div>

                    <div>
                        <button 
                            onClick={fetchPatients}
                            className="flex items-center gap-2 mb-0.5 px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                        >
                            View <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                    </div>
                </div>

                {/* Table Data */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-4 py-3 text-xs font-bold text-slate-800 tracking-wide">RefNo</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-800 tracking-wide">Serial No</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-800 tracking-wide">Patient Name</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-800 tracking-wide">Age</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-800 tracking-wide">Mobile</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-800 tracking-wide">Ref Doctor</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-800 tracking-wide">Date</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-800 tracking-wide">Reporting</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-800 tracking-wide text-right">Amount</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-800 tracking-wide text-right">Disc</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-800 tracking-wide text-right">Paid</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-800 tracking-wide text-right">Dues</th>
                                <th className="px-4 py-3 text-xs font-bold text-slate-800 tracking-wide">Remarks</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {patients.length === 0 ? (
                                <tr>
                                    <td colSpan="13" className="px-6 py-12 text-center text-slate-500">
                                        No requests found for the selected dates.
                                    </td>
                                </tr>
                            ) : (
                                patients.map((patient, index) => {
                                    // Generate mock serial number like "07/03-1" logically based on date and index
                                    const serialNo = patient.createdAt ? 
                                        `${new Date(patient.createdAt).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit'})}-${patients.length - index}` 
                                        : `-`;

                                    const discountValue = getDiscountAmount(patient);

                                    return (
                                        <tr 
                                            key={patient._id || patient.id} 
                                            onClick={() => setSelectedPatient(patient)}
                                            className="hover:bg-purple-50/50 transition-colors text-sm text-slate-700 cursor-pointer"
                                        >
                                            <td className="px-4 py-2.5">
                                                <span className={`inline-block px-2.5 py-1 text-xs font-mono font-bold rounded shadow-sm ${
                                                    patient.status === 'Printed' ? 'bg-blue-600 text-white' :
                                                    patient.status === 'Result Filled' ? 'bg-sky-500 text-white' :
                                                    patient.status === 'Deleted' ? 'bg-slate-900 text-white' :
                                                    'bg-yellow-500 text-yellow-950'
                                                }`}>
                                                    {patient.labId || patient.id}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5 text-slate-600 font-medium">
                                                {serialNo}
                                            </td>
                                            <td className="px-4 py-2.5 font-medium text-slate-900">
                                                {patient.prefix} {patient.fullName}
                                            </td>
                                            <td className="px-4 py-2.5">
                                                {patient.age} {patient.ageUnit}
                                            </td>
                                            <td className="px-4 py-2.5 font-mono text-slate-600">
                                                {patient.mobileNo || '-'}
                                            </td>
                                            <td className="px-4 py-2.5 text-slate-600">
                                                {patient.referBy}
                                            </td>
                                            <td className="px-4 py-2.5 text-slate-600">
                                                {formatDate(patient.createdAt)}
                                            </td>
                                            <td className="px-4 py-2.5 text-slate-600">
                                                {formatDateTime(patient.reportingDate, patient.reportingTime)}
                                            </td>
                                            <td className="px-4 py-2.5 text-right font-medium">
                                                {Number(patient.amounts?.totalAmount || 0)}
                                            </td>
                                            <td className="px-4 py-2.5 text-right text-slate-600">
                                                {discountValue}
                                            </td>
                                            <td className="px-4 py-2.5 text-right text-emerald-600 font-medium">
                                                {Number(patient.amounts?.received || 0)}
                                            </td>
                                            <td className="px-4 py-2.5 text-right text-rose-600 font-medium">
                                                {Number(patient.amounts?.dues || 0)}
                                            </td>
                                            <td className="px-4 py-2.5 text-slate-500 max-w-[200px] truncate" title={patient.remarks}>
                                                {patient.remarks || ''}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Status Legend - Fixed at absolute bottom of page */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-300 px-2 py-3 flex flex-wrap items-center justify-center gap-2 md:gap-4 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.1)]">
                <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-[#ffd700] text-black text-[13px] font-bold font-sans shadow-sm border border-[#e5c100]">New ♿</span>
                <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-[#fb0000] text-white text-[13px] font-bold font-sans shadow-sm border border-[#d60000]">Cancel 🚫</span>
                <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-[#8fbc8f] text-white text-[13px] font-bold font-sans shadow-sm border border-[#7ba87b]">Sample 👍</span>
                <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-[#87cefa] text-white text-[13px] font-bold font-sans shadow-sm border border-[#6ab9ed]">Result Fill 🖊️</span>
                <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-[#008000] text-white text-[13px] font-bold font-sans shadow-sm border border-[#006600]">Approved ☑️</span>
                <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-[#0000ff] text-white text-[13px] font-bold font-sans shadow-sm border border-[#0000cc]">Print 🖨️</span>
                <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-[#000000] text-white text-[13px] font-bold font-sans shadow-sm border border-[#333]">Result Deleted 🗑️</span>
            </div>

            {/* Patient Action Modal Overlay */}
            <AnimatePresence>
                {selectedPatient && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white shadow-2xl rounded-xl w-full max-w-sm overflow-hidden border border-slate-200"
                        >
                            {/* Header (Red Theme) */}
                            <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between shadow-sm">
                                <h3 className="font-semibold text-lg tracking-wide">Select Option</h3>
                                <button 
                                    onClick={() => setSelectedPatient(null)}
                                    className="p-1 hover:bg-red-700 rounded-md transition-colors"
                                    title="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            {/* Body */}
                            <div className="p-5 space-y-3.5 bg-slate-50/50">
                                {/* Lab ID Display - Target Red Input aesthetic from request */}
                                <div className="border border-red-500 bg-white rounded flex items-center justify-start p-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                                    <span className="text-slate-800 font-medium tracking-wide">{selectedPatient.labId || selectedPatient.id}</span>
                                </div>
                                
                                <button className="w-full py-2.5 bg-[#e5e7eb] hover:bg-[#d1d5db] text-slate-700 font-medium rounded transition-colors shadow-sm">
                                    Barcode
                                </button>
                                
                                <button 
                                    onClick={() => navigate('/patients/register', { state: { editPatient: selectedPatient } })}
                                    className="w-full py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium rounded transition-colors shadow-sm"
                                >
                                    Edit Registration
                                </button>
                                
                                <button className="w-full py-2.5 bg-[#4b5563] hover:bg-[#374151] text-white font-medium rounded transition-colors shadow-sm">
                                    Print Receipt
                                </button>
                                
                                <button 
                                    onClick={() => { navigate('/patients/result-entry', { state: { patient: selectedPatient } }); setSelectedPatient(null); }}
                                    className="w-full py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-medium rounded transition-colors shadow-sm"
                                >
                                    Result Entry
                                </button>

                                {selectedPatient.results && Object.keys(selectedPatient.results).length > 0 && (
                                    <button
                                        onClick={() => handlePrint(selectedPatient)}
                                        className="w-full py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-medium rounded transition-colors shadow-sm"
                                    >
                                        Print Option
                                    </button>
                                )}
                                
                                {Number(selectedPatient.amounts?.dues || 0) > 0 && (
                                    <button 
                                        onClick={() => {
                                            setTargetDuesPatient(selectedPatient);
                                            setDuesFormData(prev => ({
                                                ...prev, 
                                                amount: Number(selectedPatient.amounts?.dues || 0)
                                            }));
                                            setSelectedPatient(null);
                                        }}
                                        className="w-full py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white font-medium rounded transition-colors shadow-sm"
                                    >
                                        Amount ₹{Number(selectedPatient.amounts?.dues || 0)} Dues
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Premium Dues Payment Modal */}
            <AnimatePresence>
                {targetDuesPatient && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
                        >
                            {/* Premium Header */}
                            <div className="bg-rose-600 text-white px-5 py-4 flex items-center justify-between shadow-sm">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <span className="text-rose-100">₹</span> Dues Payment
                                </h3>
                                <button 
                                    onClick={() => setTargetDuesPatient(null)}
                                    className="p-1.5 bg-rose-700/50 hover:bg-rose-700 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Informational Banner */}
                                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg grid grid-cols-2 gap-y-3 text-sm">
                                    <div>
                                        <span className="text-slate-500 font-medium block text-xs tracking-wide uppercase mb-0.5">Reg Date</span>
                                        <span className="text-slate-800 font-bold">{formatDate(targetDuesPatient.createdAt)}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 font-medium block text-xs tracking-wide uppercase mb-0.5">Reg Number</span>
                                        <span className="text-slate-800 font-bold">{targetDuesPatient.labId || targetDuesPatient.id}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 font-medium block text-xs tracking-wide uppercase mb-0.5">Name</span>
                                        <span className="text-slate-800 font-bold truncate block">{targetDuesPatient.fullName}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 font-medium block text-xs tracking-wide uppercase mb-0.5 text-rose-500">Total Dues</span>
                                        <span className="text-rose-600 font-bold text-base block">₹{Number(targetDuesPatient.amounts?.dues || 0)}</span>
                                    </div>
                                </div>

                                {/* Form Layout */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1 md:col-span-2">
                                        <label className="text-xs font-semibold text-slate-700">Payment Mode</label>
                                        <select 
                                            value={duesFormData.mode}
                                            onChange={(e) => setDuesFormData({...duesFormData, mode: e.target.value})}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm"
                                        >
                                            <option>Cash</option>
                                            <option>UPI / Online</option>
                                            <option>Card</option>
                                            <option>Bank Transfer</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700 flex justify-between">
                                            Amount To Receive <span className="text-slate-400 font-normal">₹</span>
                                        </label>
                                        <input 
                                            type="number" 
                                            value={duesFormData.amount}
                                            onChange={(e) => setDuesFormData({...duesFormData, amount: e.target.value})}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm text-slate-800 font-medium" 
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700 flex justify-between">
                                            Discount <span className="text-slate-400 font-normal">₹</span>
                                        </label>
                                        <input 
                                            type="number" 
                                            value={duesFormData.discount}
                                            onChange={(e) => setDuesFormData({...duesFormData, discount: e.target.value})}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm text-slate-800" 
                                        />
                                    </div>

                                    <div className="space-y-1 md:col-span-2">
                                        <label className="text-xs font-semibold text-slate-700">Transaction ID</label>
                                        <input 
                                            type="text" 
                                            value={duesFormData.transactionId}
                                            onChange={(e) => setDuesFormData({...duesFormData, transactionId: e.target.value})}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm text-slate-800" 
                                        />
                                    </div>

                                    <div className="space-y-1 md:col-span-2">
                                        <label className="text-xs font-semibold text-slate-700">Remarks</label>
                                        <input 
                                            type="text" 
                                            value={duesFormData.remarks}
                                            onChange={(e) => setDuesFormData({...duesFormData, remarks: e.target.value})}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm text-slate-800" 
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700">Receiving Date</label>
                                        <input 
                                            type="date"
                                            value={duesFormData.date}
                                            onChange={(e) => setDuesFormData({...duesFormData, date: e.target.value})}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm text-slate-800" 
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700">Time</label>
                                        <input 
                                            type="time" 
                                            value={duesFormData.time}
                                            onChange={(e) => setDuesFormData({...duesFormData, time: e.target.value})}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm text-slate-800" 
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Action Footer */}
                            <div className="bg-slate-50 border-t border-slate-200 p-4 flex gap-3 flex-wrap sm:flex-nowrap">
                                <button
                                    onClick={async () => {
                                        try {
                                            const amountToRecv = Number(duesFormData.amount || 0);
                                            const additionalDiscount = Number(duesFormData.discount || 0);
                                            const totalToDeductFromDues = amountToRecv + additionalDiscount;
                                            
                                            if (totalToDeductFromDues > Number(targetDuesPatient.amounts?.dues || 0)) {
                                                window.alert("Entered amount + discount cannot exceed the total outstanding dues.");
                                                return;
                                            }

                                            // Calculate current discount absolute value to safely stack new extra discount inputs
                                            const currentTotalDiscount = targetDuesPatient.amounts?.discountType === '₹' 
                                                ? Number(targetDuesPatient.amounts?.discount || 0)
                                                : ((Number(targetDuesPatient.amounts?.totalAmount || 0) * Number(targetDuesPatient.amounts?.discount || 0)) / 100);

                                            const updatedAmounts = {
                                                ...targetDuesPatient.amounts,
                                                received: Number(targetDuesPatient.amounts?.received || 0) + amountToRecv,
                                                dues: Number(targetDuesPatient.amounts?.dues || 0) - totalToDeductFromDues,
                                                discount: currentTotalDiscount + additionalDiscount,
                                                discountType: '₹' // Force to flat absolute rupees when dynamically re-calculating dues mid-flight
                                            };

                                            const payload = {
                                                ...targetDuesPatient,
                                                amounts: updatedAmounts,
                                                remarks: duesFormData.remarks ? `${targetDuesPatient.remarks ? targetDuesPatient.remarks + ' | ' : ''}Dues paid (${duesFormData.mode}): ${duesFormData.remarks}` : targetDuesPatient.remarks
                                            };

                                            const res = await fetch(`http://localhost:5000/api/patients/${targetDuesPatient._id || targetDuesPatient.id}`, {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify(payload)
                                            });

                                            const data = await res.json();
                                            if (data.success) {
                                                // Sync the local Grid state with final server data
                                                setPatients(patients.map(p => (p._id === targetDuesPatient._id || p.id === targetDuesPatient.id) ? data.patient : p));
                                                setTargetDuesPatient(null);
                                            } else {
                                                window.alert('Failed to clear dues from server.');
                                            }
                                        } catch (error) {
                                            console.error("Dues Saving Error:", error);
                                            window.alert('An error occurred while saving dues. Check console for details.');
                                        }
                                    }}
                                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-lg shadow-sm shadow-rose-600/30 transition-colors"
                                >
                                    Save Record
                                </button>
                                <button 
                                    onClick={() => setTargetDuesPatient(null)}
                                    className="px-6 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2.5 rounded-lg transition-colors border border-slate-300"
                                >
                                    Back
                                </button>
                                <button 
                                    onClick={() => setDuesFormData({
                                        mode: 'Cash', amount: Number(targetDuesPatient.amounts?.dues || 0), discount: '0', 
                                        transactionId: '', remarks: '', 
                                        date: new Date().toISOString().split('T')[0], time: new Date().toTimeString().slice(0,5)
                                    })}
                                    className="px-4 bg-white hover:bg-slate-50 text-slate-600 font-medium py-2.5 rounded-lg transition-colors border border-slate-200"
                                >
                                    Reset
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper icon
function MenuIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
    )
}
