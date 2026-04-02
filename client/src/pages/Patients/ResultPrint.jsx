import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft } from 'lucide-react';

export default function ResultPrint() {
    const location = useLocation();
    const navigate = useNavigate();
    const { patient, results } = location.state || {};

    const [letterPad, setLetterPad]        = useState(true);
    const [selectedTests, setSelectedTests] = useState([]);
    const [allTests, setAllTests]           = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/tests')
            .then(r => r.json())
            .then(data => { if (data.success) setAllTests(data.tests); })
            .catch(err => console.error(err));
    }, []);

    if (!patient) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-lg font-semibold text-gray-600">No patient data found.</p>
                <button onClick={() => navigate('/patients/list')} className="px-6 py-2 bg-purple-600 text-white rounded font-bold hover:bg-purple-700">
                    Go to Patient List
                </button>
            </div>
        );
    }

    const tests = patient.tests || [];

    // Format date/time
    const formatDateTime = (dateStr, timeStr) => {
        if (!dateStr) return '';
        try {
            const d = new Date(`${dateStr}T${timeStr || '00:00'}`);
            return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
                '/' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase();
        } catch { return dateStr; }
    };

    const toggleSelect = (testName) => {
        setSelectedTests(prev =>
            prev.includes(testName) ? prev.filter(t => t !== testName) : [...prev, testName]
        );
    };

    const toggleAll = (e) => {
        setSelectedTests(e.target.checked ? tests.map(t => t.name) : []);
    };

    const handlePrint = (testsToP) => {
        const printData = {
            patient,
            results,
            letterPad,
            tests: testsToP,
        };
        localStorage.setItem('printData', JSON.stringify(printData));
        window.open('/print-report', '_blank');
    };

    const handlePatientWhatsapp = () => {
        const mobile = patient.mobileNo ? patient.mobileNo.replace(/\D/g, '') : '';
        const msg = `*Your Lab Report is Ready*\nDear ${patient.prefix} ${patient.fullName},\nYour lab report (Lab ID: ${patient.labId || ''}) dated ${patient.reportingDate} is ready for collection.`;
        const url = mobile
            ? `https://wa.me/91${mobile}?text=${encodeURIComponent(msg)}`
            : `https://wa.me/?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    };

    const handleDrWhatsapp = () => {
        const msg = `*Lab Report — Doctor Copy*\nPatient: ${patient.prefix} ${patient.fullName}\nLab ID: ${patient.labId || ''}\nDate: ${patient.reportingDate}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-200 font-sans">

            {/* Purple Info Header */}
            <div style={{ background: '#7b2d8b' }} className="px-4 py-2 text-white text-sm font-bold flex items-center gap-3 flex-wrap">
                <Printer size={16} />
                <span>{patient.labId || patient.id || 'N/A'}</span>
                <span>|</span>
                <span>{patient.reportingDate}</span>
                <span>|</span>
                <span>{patient.prefix} {patient.fullName}</span>
                <span>|</span>
                <span>{formatDateTime(patient.reportingDate, patient.reportingTime)}</span>
            </div>

            {/* Action Toolbar */}
            <div className="bg-white border-b border-gray-300 px-4 py-2.5 flex items-center gap-2 flex-wrap">

                {/* Letter Pad Toggle */}
                <label className="flex items-center gap-1.5 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded cursor-pointer hover:bg-green-700 select-none">
                    <input
                        type="checkbox"
                        checked={letterPad}
                        onChange={e => setLetterPad(e.target.checked)}
                        className="accent-white w-3.5 h-3.5"
                    />
                    Print On Letter Pad
                </label>

                <button
                    onClick={() => handlePrint(tests)}
                    className="px-4 py-1.5 bg-gray-700 text-white text-xs font-bold rounded hover:bg-gray-800 transition-colors"
                >
                    Print All Test
                </button>

                <button
                    onClick={() => handlePrint(tests.filter(t => selectedTests.includes(t.name)))}
                    disabled={selectedTests.length === 0}
                    className="px-4 py-1.5 bg-gray-700 text-white text-xs font-bold rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Print Selected Test
                </button>

                {/* WhatsApp buttons */}
                <button
                    onClick={handlePatientWhatsapp}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600 transition-colors"
                >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.122 1.535 5.854L.057 23.527a.5.5 0 00.611.611l5.737-1.501A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.812 9.812 0 01-5.045-1.394l-.361-.214-3.737.979.997-3.647-.235-.374A9.818 9.818 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/></svg>
                    Patient Whatsapp
                </button>
                <button
                    onClick={handleDrWhatsapp}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-700 text-white text-xs font-bold rounded hover:bg-green-800 transition-colors"
                >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.122 1.535 5.854L.057 23.527a.5.5 0 00.611.611l5.737-1.501A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.812 9.812 0 01-5.045-1.394l-.361-.214-3.737.979.997-3.647-.235-.374A9.818 9.818 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/></svg>
                    Dr. Whatsapp
                </button>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Reg Number Search */}
                <div className="flex items-center gap-1">
                    <input
                        type="text"
                        placeholder="Reg Number"
                        className="border border-red-500 px-2 py-1.5 text-xs rounded outline-none w-32 focus:ring-1 focus:ring-red-400"
                    />
                    <button className="px-3 py-1.5 bg-gray-700 text-white text-xs font-bold rounded hover:bg-gray-800">
                        Find
                    </button>
                </div>
            </div>

            {/* Tests Table */}
            <div className="p-3">
                <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-300">
                                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700">Test Name</th>
                                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 w-32">Type</th>
                                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 w-40">Department</th>
                                <th className="px-3 py-2 text-center text-xs font-bold text-gray-700 w-24">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center text-gray-400 text-sm">
                                        No tests found for this patient.
                                    </td>
                                </tr>
                            ) : (
                                tests.map((test, i) => (
                                    <tr key={test.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-3 py-2.5 font-bold text-red-700 text-xs uppercase tracking-wide">
                                            {test.name} <span className="text-red-400">*</span>
                                        </td>
                                        <td className="px-3 py-2.5 text-xs font-semibold"
                                            style={{ color:
                                                (() => {
                                                    const def = allTests.find(t => t.testName === test.name);
                                                    const fmt = def?.testFormat || 'Single';
                                                    return fmt === 'Multiple' ? '#2563eb' : fmt === 'Heading' ? '#7c3aed' : '#16a34a';
                                                })()
                                            }}
                                        >
                                            {allTests.find(t => t.testName === test.name)?.testFormat || 'Single'}
                                        </td>
                                        <td className="px-3 py-2.5 text-xs font-bold text-gray-700 uppercase tracking-wide">
                                            {allTests.find(t => t.testName === test.name)?.department || allTests.find(t => t.testName === test.name)?.wings || '—'}
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            <button
                                                onClick={() => handlePrint([test])}
                                                className="px-4 py-1 bg-purple-600 text-white text-xs font-bold rounded hover:bg-purple-700 transition-colors"
                                            >
                                                Print
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-600 text-white text-sm font-bold rounded hover:bg-gray-700"
                >
                    <ArrowLeft size={16} /> Back
                </button>
            </div>
        </div>
    );
}
