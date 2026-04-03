import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, RefreshCw, Save, Edit2, Trash2 } from 'lucide-react';
import { InputField, SelectField } from '../../components/UI/FormControls';

export default function ReferenceDoctor() {
    const [formData, setFormData] = useState({
        name: '',
        typeOf: 'Doctor/Agent/Staff/Pathologist...',
        centerName: 'Main Franchisee',
        hospital: 'Select Hospital',
        pathology: '',
        radiology: '',
        address: '',
        email: '',
        contactNumber: '',
        profession: 'Select Profession',
        state: 'Select State',
        city: 'Select Your District'
    });

    const [doctors, setDoctors] = useState([]);

    const fetchDoctors = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/references');
            const data = await res.json();
            if (data.success) {
                setDoctors(data.references);
            }
        } catch (error) {
            console.error("Failed to load references", error);
        }
    };

    React.useEffect(() => {
        fetchDoctors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            refByName: formData.name,
            typeOf: formData.typeOf.includes('/') ? 'Doctor' : formData.typeOf,
            centerName: formData.centerName,
            hospital: formData.hospital !== 'Select Hospital' ? formData.hospital : '',
            pathology: formData.pathology,
            radiology: formData.radiology,
            address: formData.address,
            email: formData.email,
            contactNumber: formData.contactNumber,
            profession: formData.profession !== 'Select Profession' ? formData.profession : '',
            state: formData.state !== 'Select State' ? formData.state : '',
            city: formData.city !== 'Select Your District' ? formData.city : ''
        };

        try {
            const res = await fetch('http://localhost:5000/api/references', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                fetchDoctors();
                setFormData(prev => ({ ...prev, name: '', email: '', contactNumber: '', address: '', pathology: '', radiology: '' }));
            }
        } catch (error) {
            console.error("Save failed:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this reference?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/references/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) fetchDoctors();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8 font-sans">
            <header className="mb-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-fuchsia-100 text-fuchsia-600 rounded-xl shadow-sm border border-fuchsia-200">
                            <UserPlus size={24} className="stroke-[2.5]" />
                        </div>
                        Reference & Doctor Management
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Add and manage referring doctors, staff, and collection centers.</p>
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
                        <UserPlus size={20} strokeWidth={2.5} />
                        <h2 className="text-lg font-bold tracking-wide">Refer And Doctor</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button type="button" onClick={() => window.location.reload()} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSave} className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 mb-6">
                        
                        {/* Column 1 */}
                        <div className="space-y-4">
                            <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
                            <SelectField label="Type Of" name="typeOf" value={formData.typeOf} onChange={handleChange} options={['Doctor/Agent/Staff/Pathologist...', 'Doctor', 'Agent', 'Staff']} />
                            <SelectField label="Center Name" name="centerName" value={formData.centerName} onChange={handleChange} options={['Main Franchisee', 'Branch 1']} />
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-4">
                            <SelectField label="Hospital" name="hospital" value={formData.hospital} onChange={handleChange} options={['Select Hospital', 'City Care', 'Metro Hospital']} />
                            <div className="grid grid-cols-2 gap-3">
                                <InputField label="Pathology" name="pathology" value={formData.pathology} onChange={handleChange} />
                                <InputField label="Radiology" name="radiology" value={formData.radiology} onChange={handleChange} />
                            </div>
                            <InputField label="Address" name="address" value={formData.address} onChange={handleChange} />
                        </div>

                        {/* Column 3 */}
                        <div className="space-y-4">
                            <InputField label="Email ID" name="email" type="email" value={formData.email} onChange={handleChange} />
                            <div className="grid grid-cols-2 gap-3">
                                <InputField label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
                                <div>{/* Spacer placeholder for the visual split seen in the screenshot UI layout */}</div>
                            </div>
                            <SelectField label="Profession" name="profession" value={formData.profession} onChange={handleChange} options={['Select Profession', 'Physician', 'Surgeon', 'Dermatologist']} />
                        </div>

                        {/* Column 4 */}
                        <div className="space-y-4 h-full flex flex-col justify-between">
                            <div className="space-y-4">
                                <SelectField label="State" name="state" value={formData.state} onChange={handleChange} options={['Select State', 'Delhi', 'Maharashtra', 'Karnataka']} />
                                <SelectField label="City" name="city" value={formData.city} onChange={handleChange} options={['Select Your District', 'New Delhi', 'Mumbai', 'Bangalore']} />
                            </div>
                            
                            <div className="pt-2">
                                <button type="submit" className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-all focus:ring-4 focus:ring-emerald-500/30 flex items-center gap-2">
                                    <Save size={18} /> Save
                                </button>
                            </div>
                        </div>

                    </div>
                </form>

                {/* Table Data */}
                <div className="border-t border-slate-200">
                    <table className="w-full text-left table-auto whitespace-normal">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-800 text-xs font-extrabold uppercase tracking-wide">
                                <th className="px-4 py-3">Action</th>
                                <th className="px-4 py-3">RefByName</th>
                                <th className="px-4 py-3">RefType</th>
                                <th className="px-4 py-3">Profession</th>
                                <th className="px-4 py-3">HospitalName</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">ContactNo</th>
                                <th className="px-4 py-3">WhatsApp</th>
                                <th className="px-4 py-3">Address1</th>
                                <th className="px-4 py-3">StateName</th>
                                <th className="px-4 py-3">City</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-600">
                            {doctors.map((doc, idx) => (
                                <tr key={doc._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors" title="Edit">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(doc._id)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md transition-colors" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-900">{doc.refByName}</td>
                                    <td className="px-4 py-3">{doc.typeOf}</td>
                                    <td className="px-4 py-3">{doc.profession}</td>
                                    <td className="px-4 py-3">{doc.hospital}</td>
                                    <td className="px-4 py-3">{doc.email}</td>
                                    <td className="px-4 py-3">{doc.contactNumber}</td>
                                    <td className="px-4 py-3"></td>
                                    <td className="px-4 py-3">{doc.address}</td>
                                    <td className="px-4 py-3">{doc.state}</td>
                                    <td className="px-4 py-3">{doc.city}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </motion.div>
        </div>
    );
}
