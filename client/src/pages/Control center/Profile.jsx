import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, UploadCloud } from 'lucide-react';
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
                                                <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 border-dashed flex items-center justify-center shrink-0">
                                                    <UploadCloud className="text-indigo-400" size={28} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800 mb-1">Company Logo / Signature</p>
                                                    <p className="text-xs text-slate-500 mb-3">Upload a clean PNG or JPG image</p>
                                                    <button className="px-4 py-1.5 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md shadow-sm transition-all">
                                                        Browse Files
                                                    </button>
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
                                        <button className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm shadow-sm transition-colors flex items-center gap-2">
                                            Save Setting
                                        </button>
                                    </div>

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
                                            <button className="w-full mt-10 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2">
                                                <Save size={18} />
                                                Save Financial Settings
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </motion.div>
                        )}

                        {/* Placeholder for unbuilt tabs */}
                        {(activeTopTab !== 'Basic Information' || (activeSideTab !== 'Personal info' && activeSideTab !== 'Accounts and Tax')) && (
                            <div className="h-64 flex items-center justify-center text-slate-400 font-medium">
                                Content for {activeTopTab} - {activeSideTab} will appear here.
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
