import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, UploadCloud, Clock, ImagePlus, UserCheck, FileText, Type } from 'lucide-react';
import { InputField, SelectField, Checkbox } from '../../components/UI/FormControls';
import { Country, State, City } from 'country-state-city';

export default function Profile() {
    const [activeTopTab, setActiveTopTab] = useState('Basic Information');
    const [activeSideTab, setActiveSideTab] = useState('Personal info');
    const [labName, setLabName] = useState('Harsh Diagnostic Services');

    // Geo-Dropdown States
    const [formData, setFormData] = useState({
        country: 'IN', // Default to India ISO code
        state: '',
        city: ''
    });
    const [logoUrl, setLogoUrl] = useState(null);
    const [stampUrl, setStampUrl] = useState(null);
    const [headerUrl, setHeaderUrl] = useState(null);
    const [footerUrl, setFooterUrl] = useState(null);

    const headerInputRef = React.useRef(null);
    const footerInputRef = React.useRef(null);
    const logoInputRef = React.useRef(null);

    const handleFileChange = (e, setUrl) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const saveLabProfile = () => {
        const profile = {
            labName,
            logoUrl,
            stampUrl,
            headerUrl,
            footerUrl,
            signatureName: 'Dr. Pathologist', // Default or from state
            signatureDetail: 'M.B.B.S, M.D.'
        };
        localStorage.setItem('labProfile', JSON.stringify(profile));
        alert('Lab Profile branding saved successfully!');
    };

    useEffect(() => {
        const profileRaw = localStorage.getItem('labProfile');
        if (profileRaw) {
            try {
                const p = JSON.parse(profileRaw);
                setLabName(p.labName || 'Harsh Diagnostic Services');
                setLogoUrl(p.logoUrl || null);
                setStampUrl(p.stampUrl || null);
                setHeaderUrl(p.headerUrl || null);
                setFooterUrl(p.footerUrl || null);
            } catch (err) {}
        }
    }, []);

    const [designData, setDesignData] = useState({
        testHeading: 'Test Name',
        findingHeader: 'Result',
        findingAlign: 'Left',
        unitHeader: 'Unit',
        unitAlign: 'Left',
        rangeHeader: 'Normal Range',
        rangeAlign: 'Left',
        fontFamily: 'Outfit',
        gapBetween: '17',
        fontSize: '14',
        methodFontSize: '8',
        deptStyle: 'Center',
        printBorder: false,
        hideNotDetected: true,
        highlightBold: true,
        showDept: true,
        showPackage: true,
        showQRTop: false,
        showQRBottom: true,
        showBarcode: true,
        multiUnderline: false,
        profileUnderline: false,
        
        // Receipt Specific Data
        receiptLandscape: false,
        receiptFont: 'Arial',
        receiptFontSize: '13',
        labFullTime: 'Time - Monday to Sunday - 07 : 00 AM to 11 : 00 PM',
        receiptBottom: "India's Largest Diagnostics Network Trusted by Millions",
        displayTime: true,
        marginTop: '45',
        marginBottom: '0',
        marginLeft: '0',
        marginRight: '0',

        // Global Settings Data
        printReceiptAfterReg: true,
        enableMobileSearch: false,
        makeMobileMandatory: false,
        printDateTimeOnReport: true,
        enableFormulaEntry: true,
        preventPrintWhenDues: false,
        preventBackDateEntry: false,
        saveReceiptOnZero: true,
        sendSmsAfterReg: true,
        sendSmsAfterRegUpdate: false,
        sendSmsAfterReportPrepared: true,
        preventResultUpdate: false,
        preventResultDelete: false
    });

    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([{ value: '', label: 'Select State' }]);
    const [districtOptions, setDistrictOptions] = useState([{ value: '', label: 'Select District' }]);

    // Initialize Countries
    useEffect(() => {
        const allCountries = Country.getAllCountries().map(c => ({ value: c.isoCode, label: c.name }));
        setCountryOptions([{ value: '', label: 'Select Country' }, ...allCountries]);
    }, []);

    // Update States when Country changes
    useEffect(() => {
        if (formData.country) {
            const countryStates = State.getStatesOfCountry(formData.country).map(s => ({ value: s.isoCode, label: s.name }));
            setStateOptions([{ value: '', label: 'Select State' }, ...countryStates]);
        } else {
            setStateOptions([{ value: '', label: 'Select State' }]);
        }
    }, [formData.country]);

    // Update Cities/Districts when State changes
    useEffect(() => {
        if (formData.country && formData.state) {
            const stateCities = City.getCitiesOfState(formData.country, formData.state).map(c => ({ value: c.name, label: c.name }));
            setDistrictOptions([{ value: '', label: 'Select District' }, ...stateCities]);
        } else {
            setDistrictOptions([{ value: '', label: 'Select District' }]);
        }
    }, [formData.country, formData.state]);

    const handleDesignChange = (name, value) => {
        setDesignData(prev => ({ ...prev, [name]: value }));
    };

    const saveDesignPreferences = () => {
        localStorage.setItem('reportDesignSettings', JSON.stringify(designData));
        alert('Design preferences saved successfully! Your reports will now reflect these styles.');
    };

    const handleGeoChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            if (name === 'country') return { ...prev, country: value, state: '', city: '' };
            if (name === 'state') return { ...prev, state: value, city: '' };
            return { ...prev, [name]: value };
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8 font-sans">

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full bg-white shadow-xl shadow-slate-200/40 border border-slate-200"
            >
                {/* Header */}
                <div className="p-5 border-b border-slate-200 bg-white">
                    <h1 className="text-2xl font-normal text-slate-800">
                        {labName.trim() ? `${labName} Profile` : 'Lab Settings Profile'}
                    </h1>
                </div>

                {/* Top Tabs */}
                <div className="flex border-b border-slate-200 px-4 pt-2 bg-slate-50/50 overflow-x-auto">
                    {['Basic Information', 'Pathology Report Setting', 'Test Detail Design', 'Image Upload'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTopTab(tab)}
                            className={`px-6 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-[1.5px] whitespace-nowrap ${activeTopTab === tab ? 'border-sky-500 text-slate-800 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row bg-white">
                    {/* Left Sidebar Tabs */}
                    <div className="w-full md:w-64 border-r border-slate-200 bg-slate-50/30 flex flex-col pt-4 shrink-0">
                        {['Personal info', 'Settings', 'Accounts and Tax', 'Receipt'].map((tab, idx) => (
                            <button
                                key={tab}
                                onClick={() => setActiveSideTab(tab)}
                                className={`text-left px-5 py-3 text-sm flex items-center gap-3 transition-colors ${activeSideTab === tab
                                    ? 'bg-sky-500 text-white font-medium shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100 font-medium'
                                    }`}
                            >
                                <Settings size={16} className={activeSideTab === tab ? "opacity-100" : "opacity-40"} />
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 p-6 lg:p-8 overflow-x-hidden">
                        {activeTopTab === 'Basic Information' && activeSideTab === 'Personal info' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">

                                {/* Left Column: Identity & Legal */}
                                <div className="space-y-8">
                                    {/* Brand Identity Card */}
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Brand Identity</h3>
                                        </div>
                                        <div className="p-6 space-y-5">
                                            {/* Beautiful Upload Center */}
                                            <div className="flex items-center gap-5 pb-2">
                                                <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 border-dashed flex items-center justify-center shrink-0 overflow-hidden relative group">
                                                    {logoUrl ? (
                                                        <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                                    ) : (
                                                        <UploadCloud className="text-indigo-400" size={28} />
                                                    )}
                                                    <input 
                                                        type="file" 
                                                        className="absolute inset-0 opacity-0 cursor-pointer" 
                                                        onChange={(e) => handleFileChange(e, setLogoUrl)}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800 mb-1">Company Logo / Signature</p>
                                                    <p className="text-xs text-slate-500 mb-3">Upload a clean PNG or JPG image</p>
                                                    <div className="relative inline-block">
                                                        <button className="px-4 py-1.5 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md shadow-sm transition-all pointer-events-none">
                                                            Browse Files
                                                        </button>
                                                        <input 
                                                            type="file" 
                                                            className="absolute inset-0 opacity-0 cursor-pointer" 
                                                            onChange={(e) => handleFileChange(e, setLogoUrl)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <InputField 
                                                    label="Registered Lab Name" 
                                                    value={labName}
                                                    onChange={(e) => setLabName(e.target.value)}
                                                    name="labName"
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <InputField label="Name To Print" />
                                                <InputField label="Name In Report" />
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <InputField label="Lab ID Code" />
                                                <InputField label="Web URI / Portal" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Legal & Compliance Card */}
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Legal Compliance</h3>
                                        </div>
                                        <div className="p-6 grid grid-cols-2 gap-4">
                                            <InputField label="Registration No." />
                                            <InputField label="ISO Certification" />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Geography & Operations */}
                                <div className="space-y-8 flex flex-col">
                                    {/* Contact & Location Card */}
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1">
                                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Contact & Geography</h3>
                                        </div>
                                        <div className="p-6 space-y-5">
                                            <div className="grid grid-cols-2 gap-4">
                                                <InputField label="Official Email" type="email" />
                                                <div>
                                                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Primary Contact Numbers</label>
                                                    <div className="grid grid-cols-2 gap-0 border border-slate-300 rounded-lg overflow-hidden focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500">
                                                        <input type="number" className="w-full px-3 py-2 bg-white outline-none border-r border-slate-300 font-medium text-slate-800 text-sm" placeholder="Phone 1" />
                                                        <input type="number" className="w-full px-3 py-2 bg-white outline-none font-medium text-slate-800 text-sm" placeholder="Phone 2" />
                                                    </div>
                                                </div>
                                            </div>

                                            <InputField label="Address Line 1" placeholder="Building, Street Name" />
                                            <InputField label="Address Line 2" placeholder="Landmark, Area" />
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <SelectField 
                                                    label="Country" 
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={handleGeoChange}
                                                    options={countryOptions} 
                                                />
                                                <SelectField 
                                                    label="State / Province" 
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleGeoChange}
                                                    options={stateOptions} 
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <SelectField 
                                                    label="City / District" 
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleGeoChange}
                                                    options={districtOptions} 
                                                />
                                                <InputField label="PIN / Zip Code" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Checkboxes & Action */}
                                    <div className="pt-2 pb-4">
                                        <div className="flex flex-wrap gap-x-8 gap-y-3 mb-8">
                                            <Checkbox label="Print Address 1" />
                                            <Checkbox label="Print Address 2" />
                                            <Checkbox label="Print Both in Receipt" />
                                        </div>
                                        <button 
                                            onClick={saveLabProfile}
                                            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm shadow-sm transition-colors flex items-center gap-2"
                                        >
                                            Save Setting
                                        </button>
                                    </div>

                                </div>
                            </motion.div>
                        )}

                        {/* Precise Global Settings (Based on Screenshot) */}
                        {activeTopTab === 'Basic Information' && activeSideTab === 'Settings' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-10"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 max-w-5xl bg-white p-2 text-slate-700">
                                    
                                    {/* Left Column */}
                                    <div className="space-y-4">
                                        <Checkbox 
                                            label="Print receipt after Patient Registration" 
                                            checked={designData.printReceiptAfterReg}
                                            onChange={(e) => handleDesignChange('printReceiptAfterReg', e.target.checked)}
                                        />
                                        <Checkbox 
                                            label="Enable mobile number search" 
                                            checked={designData.enableMobileSearch}
                                            onChange={(e) => handleDesignChange('enableMobileSearch', e.target.checked)}
                                        />
                                        <Checkbox 
                                            label="Make mobile number mandatory" 
                                            checked={designData.makeMobileMandatory}
                                            onChange={(e) => handleDesignChange('makeMobileMandatory', e.target.checked)}
                                        />
                                        <Checkbox 
                                            label="Print Current Date Time on Report" 
                                            checked={designData.printDateTimeOnReport}
                                            onChange={(e) => handleDesignChange('printDateTimeOnReport', e.target.checked)}
                                        />
                                        <Checkbox 
                                            label="Enable Formula in Result Entry" 
                                            checked={designData.enableFormulaEntry}
                                            onChange={(e) => handleDesignChange('enableFormulaEntry', e.target.checked)}
                                        />
                                        <Checkbox 
                                            label="Prevent Print When Amount is Dues" 
                                            checked={designData.preventPrintWhenDues}
                                            onChange={(e) => handleDesignChange('preventPrintWhenDues', e.target.checked)}
                                        />
                                        <Checkbox 
                                            label="Prevent Back Date Entry" 
                                            checked={designData.preventBackDateEntry}
                                            onChange={(e) => handleDesignChange('preventBackDateEntry', e.target.checked)}
                                        />
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-4">
                                        <Checkbox 
                                            label="Save Receipt on Zero Amount" 
                                            checked={designData.saveReceiptOnZero}
                                            onChange={(e) => handleDesignChange('saveReceiptOnZero', e.target.checked)}
                                        />
                                        <Checkbox 
                                            label="Send SMS after registration" 
                                            checked={designData.sendSmsAfterReg}
                                            onChange={(e) => handleDesignChange('sendSmsAfterReg', e.target.checked)}
                                        />
                                        <Checkbox 
                                            label="Send SMS after registration update" 
                                            checked={designData.sendSmsAfterRegUpdate}
                                            onChange={(e) => handleDesignChange('sendSmsAfterRegUpdate', e.target.checked)}
                                        />
                                        <Checkbox 
                                            label="Send SMS after report prepared" 
                                            checked={designData.sendSmsAfterReportPrepared}
                                            onChange={(e) => handleDesignChange('sendSmsAfterReportPrepared', e.target.checked)}
                                        />
                                        <Checkbox 
                                            label="Prevent result update" 
                                            checked={designData.preventResultUpdate}
                                            onChange={(e) => handleDesignChange('preventResultUpdate', e.target.checked)}
                                        />
                                        <Checkbox 
                                            label="Prevent result delete" 
                                            checked={designData.preventResultDelete}
                                            onChange={(e) => handleDesignChange('preventResultDelete', e.target.checked)}
                                        />
                                    </div>

                                </div>

                                {/* Submit Button */}
                                <div className="pt-4 flex justify-start">
                                    <button 
                                        onClick={saveDesignPreferences}
                                        className="px-10 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded shadow-md transition-all active:scale-95"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Premium Accounts and Tax Redesign */}
                        {activeTopTab === 'Basic Information' && activeSideTab === 'Accounts and Tax' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="max-w-4xl space-y-8"
                            >
                                {/* Bank Details Card */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Bank Account Details</h3>
                                    </div>
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField label="Bank Name" placeholder="e.g. HDFC Bank" />
                                        <InputField label="Account No." placeholder="Enter Account Number" />
                                        <InputField label="IFSC Code" placeholder="e.g. HDFC0001234" />
                                        <InputField label="Branch Name" placeholder="e.g. Main Branch" />
                                    </div>
                                </div>

                                {/* Digital Payments & Tax Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                    {/* Digital Payments (UPI) */}
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Digital Payments</h3>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <InputField label="UPI ID" placeholder="e.g. 12345xxxxx@upi" />
                                            <InputField label="Receiver Name" placeholder="e.g. example Diagnostic" />
                                            <SelectField label="Vendor / App" options={['Paytm', 'Google Pay', 'PhonePe', 'BharatPe', 'Other']} />
                                        </div>
                                    </div>

                                    {/* Tax & Legal */}
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Tax Information</h3>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <InputField label="GSTIN Number" placeholder="Enter 15-digit GSTIN" />
                                        </div>

                                        {/* Action Area */}
                                        <div className="p-6 pt-0 mt-auto flex justify-end">
                                            <button 
                                                onClick={saveLabProfile}
                                                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Save size={18} />
                                                Save Financial Settings
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </motion.div>
                        )}

                        {/* Pathology Report Setting Tab */}
                        {activeTopTab === 'Pathology Report Setting' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ duration: 0.4 }}
                                className="space-y-8"
                            >
                                <div className="max-w-5xl mx-auto space-y-8">
                                    
                                    {/* Report Header Branding Area */}
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">1. Letterhead / Report Header</h3>
                                            {headerUrl && (
                                                <button 
                                                    onClick={() => {
                                                        setHeaderUrl(null);
                                                        if (headerInputRef.current) headerInputRef.current.value = '';
                                                    }} 
                                                    className="text-[10px] text-red-500 font-bold hover:underline"
                                                >
                                                    Remove Header
                                                </button>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <div className="relative group border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 p-4 transition-all hover:border-sky-300 hover:bg-sky-50/20 overflow-hidden">
                                                {headerUrl ? (
                                                    <img src={headerUrl} alt="Header Preview" className="w-full h-auto max-h-48 object-contain" />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center min-h-[140px] text-center">
                                                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                            <ImagePlus size={24} className="text-slate-400 group-hover:text-sky-500" />
                                                        </div>
                                                        <p className="text-sm font-bold text-slate-700">Drop brand header here or click to upload</p>
                                                        <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-tight">Rec: 2000px x 400px (Max 2MB)</p>
                                                    </div>
                                                )}
                                                <input 
                                                    ref={headerInputRef}
                                                    type="file" 
                                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                                    onChange={(e) => handleFileChange(e, setHeaderUrl)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Signature Workflow Area */}
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">2. Medical Signature Matrix (Footer)</h3>
                                        </div>
                                        <div className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                {[1, 2, 3, 4].map(num => (
                                                    <div key={num} className="space-y-3">
                                                        <div className="relative aspect-[4/3] rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden group hover:border-sky-400 transition-colors">
                                                            <div className="text-center p-3 opacity-40 group-hover:opacity-100 transition-opacity">
                                                                <UserCheck size={28} className="mx-auto mb-2 text-slate-400 group-hover:text-sky-500" />
                                                                <p className="text-[10px] font-bold uppercase tracking-tighter">Sign {num}</p>
                                                            </div>
                                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                                                        </div>
                                                        <InputField label={`Sign Text ${num}`} placeholder={num === 1 ? "e.g. Dr. Arun Kumar" : "Designation..."} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footnote Branding Areas */}
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">3. Graphic Report Footer</h3>
                                            {footerUrl && (
                                                <button 
                                                    onClick={() => {
                                                        setFooterUrl(null);
                                                        if (footerInputRef.current) footerInputRef.current.value = '';
                                                    }} 
                                                    className="text-[10px] text-red-500 font-bold hover:underline"
                                                >
                                                    Remove Footer Image
                                                </button>
                                            )}
                                        </div>
                                        <div className="p-6 space-y-4">
                                            {/* Graphic Footer upload (Matching Header UI) */}
                                            <div className="relative group border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 p-4 transition-all hover:border-sky-300 hover:bg-sky-50/20 overflow-hidden">
                                                {footerUrl ? (
                                                    <img src={footerUrl} alt="Footer Preview" className="w-full h-auto max-h-32 object-contain" />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center min-h-[100px] text-center">
                                                        <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                            <UploadCloud size={20} className="text-slate-400 group-hover:text-sky-500" />
                                                        </div>
                                                        <p className="text-xs font-bold text-slate-700">Drop brand footer here or click to upload</p>
                                                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">Full width banner for report bottom</p>
                                                    </div>
                                                )}
                                                <input 
                                                    ref={footerInputRef}
                                                    type="file" 
                                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                                    onChange={(e) => handleFileChange(e, setFooterUrl)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Centered Save Button at bottom */}
                                    <div className="pt-4 flex justify-center">
                                        <button 
                                            onClick={saveLabProfile}
                                            className="px-12 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-xl shadow-sky-600/20 transition-all flex items-center gap-3 active:scale-95"
                                        >
                                            <Save size={20} /> Save All Settings
                                        </button>
                                    </div>

                                </div>
                            </motion.div>
                        )}

                        {/* Test Detail Design Tab */}
                        {activeTopTab === 'Test Detail Design' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ duration: 0.4 }}
                                className="max-w-6xl mx-auto space-y-8"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    
                                    {/* Left Card: Typography & Layout */}
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                            <Type size={18} className="text-sky-500" />
                                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Typography & Layout</h3>
                                        </div>
                                        <div className="p-6 space-y-7">
                                            <InputField 
                                                label="General Test Heading" 
                                                placeholder="e.g. Test Name" 
                                                value={designData.testHeading}
                                                onChange={(e) => handleDesignChange('testHeading', e.target.value)}
                                            />
                                            
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
                                                {/* Pair 1 */}
                                                <div className="grid grid-cols-12 gap-3 items-end">
                                                    <div className="col-span-8">
                                                        <InputField 
                                                            label="Finding Value Header" 
                                                            placeholder="Result" 
                                                            value={designData.findingHeader}
                                                            onChange={(e) => handleDesignChange('findingHeader', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-span-4">
                                                        <SelectField 
                                                            label="Align" 
                                                            options={['Left', 'Center', 'Right']} 
                                                            value={designData.findingAlign}
                                                            onChange={(e) => handleDesignChange('findingAlign', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                {/* Pair 2 */}
                                                <div className="grid grid-cols-12 gap-3 items-end">
                                                    <div className="col-span-8">
                                                        <InputField 
                                                            label="Unit Header" 
                                                            placeholder="Unit" 
                                                            value={designData.unitHeader}
                                                            onChange={(e) => handleDesignChange('unitHeader', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-span-4">
                                                        <SelectField 
                                                            label="Align" 
                                                            options={['Left', 'Center', 'Right']} 
                                                            value={designData.unitAlign}
                                                            onChange={(e) => handleDesignChange('unitAlign', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                {/* Pair 3 */}
                                                <div className="grid grid-cols-12 gap-3 items-end">
                                                    <div className="col-span-8">
                                                        <InputField 
                                                            label="Normal Range Header" 
                                                            placeholder="Normal Range" 
                                                            value={designData.rangeHeader}
                                                            onChange={(e) => handleDesignChange('rangeHeader', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-span-4">
                                                        <SelectField 
                                                            label="Align" 
                                                            options={['Left', 'Center', 'Right']} 
                                                            value={designData.rangeAlign}
                                                            onChange={(e) => handleDesignChange('rangeAlign', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                {/* Font Stack */}
                                                <div className="grid grid-cols-1 gap-1">
                                                    <SelectField 
                                                        label="Report Font Family" 
                                                        options={[
                                                            'Outfit', 'Inter', 'Roboto', 'Microsoft Sans Serif', 'Arial', 
                                                            'Times New Roman', 'Calibri', 'Verdana', 'Tahoma', 
                                                            'Segoe UI', 'Georgia', 'Courier New', 'Trebuchet MS', 
                                                            'Helvetica', 'Open Sans', 'Lato'
                                                        ]} 
                                                        value={designData.fontFamily}
                                                        onChange={(e) => handleDesignChange('fontFamily', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                                <div className="relative">
                                                    <InputField 
                                                        label="Gap Between Test" 
                                                        placeholder="17" 
                                                        value={designData.gapBetween}
                                                        onChange={(e) => handleDesignChange('gapBetween', e.target.value)}
                                                    />
                                                    <span className="absolute right-3 bottom-[11px] text-[10px] font-bold text-slate-400">PX</span>
                                                </div>
                                                <div className="relative">
                                                    <InputField 
                                                        label="Font Size" 
                                                        placeholder="14" 
                                                        value={designData.fontSize}
                                                        onChange={(e) => handleDesignChange('fontSize', e.target.value)}
                                                    />
                                                    <span className="absolute right-3 bottom-[11px] text-[10px] font-bold text-slate-400">PX</span>
                                                </div>
                                                <div className="relative">
                                                    <InputField 
                                                        label="Method Font Size" 
                                                        placeholder="8" 
                                                        value={designData.methodFontSize}
                                                        onChange={(e) => handleDesignChange('methodFontSize', e.target.value)}
                                                    />
                                                    <span className="absolute right-3 bottom-[11px] text-[10px] font-bold text-slate-400">PX</span>
                                                </div>
                                            </div>

                                            <SelectField 
                                                label="Department Header Styling" 
                                                options={['Left', 'Center', 'Right', 'Underline Only']} 
                                                value={designData.deptStyle}
                                                onChange={(e) => handleDesignChange('deptStyle', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Right Card: Print & Logic Controls */}
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-fit">
                                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                            <Settings size={18} className="text-sky-500" />
                                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Report View Controls</h3>
                                        </div>
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                            <Checkbox 
                                                label="Report Print With Border" 
                                                checked={designData.printBorder}
                                                onChange={(e) => handleDesignChange('printBorder', e.target.checked)}
                                            />
                                            <Checkbox 
                                                label="Hide 'Not Detected' Tests" 
                                                checked={designData.hideNotDetected}
                                                onChange={(e) => handleDesignChange('hideNotDetected', e.target.checked)}
                                            />
                                            <Checkbox 
                                                label="Highlight Abnormal Value (Bold)" 
                                                checked={designData.highlightBold}
                                                onChange={(e) => handleDesignChange('highlightBold', e.target.checked)}
                                            />
                                            <Checkbox 
                                                label="Show Clinical Department" 
                                                checked={designData.showDept}
                                                onChange={(e) => handleDesignChange('showDept', e.target.checked)}
                                            />
                                            <Checkbox 
                                                label="Show Package Information" 
                                                checked={designData.showPackage}
                                                onChange={(e) => handleDesignChange('showPackage', e.target.checked)}
                                            />
                                            <Checkbox 
                                                label="Show Scancode On Top" 
                                                checked={designData.showQRTop}
                                                onChange={(e) => handleDesignChange('showQRTop', e.target.checked)}
                                            />
                                            <Checkbox 
                                                label="Show Scancode On Bottom" 
                                                checked={designData.showQRBottom}
                                                onChange={(e) => handleDesignChange('showQRBottom', e.target.checked)}
                                            />
                                            <Checkbox 
                                                label="Show Barcode / Ref ID" 
                                                checked={designData.showBarcode}
                                                onChange={(e) => handleDesignChange('showBarcode', e.target.checked)}
                                            />
                                            <Checkbox 
                                                label="Multi-Test Section Underline" 
                                                checked={designData.multiUnderline}
                                                onChange={(e) => handleDesignChange('multiUnderline', e.target.checked)}
                                            />
                                            <Checkbox 
                                                label="Profile Section Underline" 
                                                checked={designData.profileUnderline}
                                                onChange={(e) => handleDesignChange('profileUnderline', e.target.checked)}
                                            />
                                        </div>
                                    </div>

                                </div>

                                {/* Shared Bottom Action Area */}
                                <div className="pt-6 flex justify-center border-t border-slate-100">
                                    <button 
                                        onClick={saveDesignPreferences}
                                        className="px-16 py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl shadow-xl shadow-sky-600/30 transition-all flex items-center gap-3 active:scale-95 group"
                                    >
                                        <Save size={20} className="group-hover:rotate-12 transition-transform" /> 
                                        Save Design Preferences
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Precise Receipt Configuration (Based on Screenshot) */}
                        {activeTopTab === 'Basic Information' && activeSideTab === 'Receipt' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    
                                    {/* Left Column: Logo & Stamp (Col 3) */}
                                    <div className="lg:col-span-3 space-y-6">
                                        {/* Logo Upload */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-emerald-700 uppercase">Logo</label>
                                            <div className="border border-slate-300 rounded bg-white p-4 aspect-video flex flex-col items-center justify-center gap-3 group relative hover:border-sky-500 transition-colors overflow-hidden cursor-pointer">
                                                {logoUrl ? (
                                                    <img src={logoUrl} alt="Logo Preview" className="h-full w-full object-contain" />
                                                ) : (
                                                    <div className="text-center group-hover:scale-105 transition-transform">
                                                        <ImagePlus size={32} className="mx-auto text-slate-300 mb-2" />
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Upload Logo</span>
                                                    </div>
                                                )}
                                                <div className="flex gap-2 mt-auto">
                                                    <button className="px-3 py-1 bg-sky-50 border border-sky-100 text-sky-600 text-[10px] font-bold hover:bg-sky-500 hover:text-white transition-all uppercase rounded">Browse Logo</button>
                                                </div>
                                                <input type="file" onChange={(e) => handleFileChange(e, setLogoUrl)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            </div>
                                        </div>

                                        {/* Stamp Upload */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-emerald-700 uppercase">Stamp/Sign</label>
                                            <div className="border border-slate-300 rounded bg-white p-4 aspect-video flex flex-col items-center justify-center gap-3 group relative hover:border-indigo-400 transition-colors overflow-hidden">
                                                {stampUrl ? (
                                                    <img src={stampUrl} alt="Stamp Preview" className="h-full w-auto object-contain" />
                                                ) : (
                                                    <div className="w-full h-full border border-dashed border-slate-200 flex items-center justify-center">
                                                        <ImagePlus size={24} className="text-slate-200" />
                                                    </div>
                                                )}
                                                <div className="flex gap-2">
                                                    <button className="px-2 py-1 bg-slate-100 border border-slate-300 text-[10px] font-medium hover:bg-slate-200">Choose File</button>
                                                    <span className="text-[10px] text-slate-400 self-center">No file chosen</span>
                                                </div>
                                                <input type="file" onChange={(e) => handleFileChange(e, setStampUrl)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Settings (Col 9) */}
                                    <div className="lg:col-span-9 space-y-6">
                                        
                                        <div className="flex flex-col gap-5 bg-white p-2">
                                            <Checkbox 
                                                label="Landscape Double Copy Print" 
                                                checked={designData.receiptLandscape}
                                                onChange={(e) => handleDesignChange('receiptLandscape', e.target.checked)}
                                            />

                                            <div className="grid grid-cols-12 gap-3 items-end max-w-2xl">
                                                <div className="col-span-12">
                                                    <label className="text-xs font-bold text-slate-700 mb-1 block">Font and Size</label>
                                                </div>
                                                <div className="col-span-7">
                                                    <SelectField 
                                                        options={['Arial', 'Times New Roman', 'Verdana', 'Outfit', 'Inter']} 
                                                        value={designData.receiptFont}
                                                        onChange={(e) => handleDesignChange('receiptFont', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-span-5">
                                                    <InputField 
                                                        value={designData.receiptFontSize}
                                                        onChange={(e) => handleDesignChange('receiptFontSize', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <InputField 
                                                label="Lab Full Time" 
                                                value={designData.labFullTime}
                                                onChange={(e) => handleDesignChange('labFullTime', e.target.value)}
                                            />

                                            <InputField 
                                                label="Receipt Bottom" 
                                                value={designData.receiptBottom}
                                                onChange={(e) => handleDesignChange('receiptBottom', e.target.value)}
                                            />

                                            <Checkbox 
                                                label="Display Time" 
                                                checked={designData.displayTime}
                                                onChange={(e) => handleDesignChange('displayTime', e.target.checked)}
                                            />

                                            {/* Margins */}
                                            <div className="space-y-3 pt-2">
                                                <h4 className="text-xs font-bold text-slate-900 uppercase">Set Bill Margin</h4>
                                                <div className="grid grid-cols-4 gap-4">
                                                    <InputField 
                                                        label="Top Margin" 
                                                        value={designData.marginTop}
                                                        onChange={(e) => handleDesignChange('marginTop', e.target.value)}
                                                    />
                                                    <InputField 
                                                        label="Bottom Margin" 
                                                        value={designData.marginBottom}
                                                        onChange={(e) => handleDesignChange('marginBottom', e.target.value)}
                                                    />
                                                    <InputField 
                                                        label="Left Margin" 
                                                        value={designData.marginLeft}
                                                        onChange={(e) => handleDesignChange('marginLeft', e.target.value)}
                                                    />
                                                    <InputField 
                                                        label="Right Margin" 
                                                        value={designData.marginRight}
                                                        onChange={(e) => handleDesignChange('marginRight', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                                {/* Save Button */}
                                <div className="pt-8 flex justify-start">
                                    <button 
                                        onClick={saveDesignPreferences}
                                        className="px-8 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded shadow-md transition-all active:scale-95"
                                    >
                                        Save Setting
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Placeholder for unbuilt tabs */}
                        {(activeTopTab !== 'Basic Information' && activeTopTab !== 'Pathology Report Setting' && activeTopTab !== 'Test Detail Design') && (
                            <div className="h-64 flex items-center justify-center text-slate-400 font-medium">
                                Content for {activeTopTab} - {activeSideTab} will appear here.
                            </div>
                        )}
                        
                        {(activeTopTab === 'Basic Information' && activeSideTab !== 'Personal info' && activeSideTab !== 'Accounts and Tax' && activeSideTab !== 'Receipt' && activeSideTab !== 'Settings') && (
                            <div className="h-64 flex items-center justify-center text-slate-400 font-medium">
                                Sidebar Sub-content for {activeSideTab} will appear here.
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}


