import React, { useState, useEffect } from 'react';
import { Settings2, Save, RotateCcw, Layout, FileText, Settings } from 'lucide-react';

export default function PageSetup() {
    const [settings, setSettings] = useState({
        letterPad: {
            topMargin: 100, leftMargin: 25, rightMargin: 15, bottomMargin: 100,
            patientFormat: 'Format19', overlap: 110,
            showFooter1: false, showFooter2: false,
            patientBoxed: true, pageNumber: true,
            resultEndLine: false, removeTime: true,
            symbol: true, testBottomLine: true,
            endOfReport: true,
            signatures: { left: true, mid: false, right: false, fourth: false },
            heights: { left: 85, mid: 85, right: 85, fourth: 40 }
        },
        a4Page: {
            headerHeight: 134, leftMargin: 10, rightMargin: 10, bottomMargin: 100,
            patientFormat: 'Format19', overlap: 134,
            showFooter1: true, showFooter2: false,
            patientBoxed: true, pageNumber: true,
            resultEndLine: true, removeTime: false,
            symbol: true, testBottomLine: true,
            endOfReport: true,
            signatures: { left: true, mid: false, right: false, fourth: false },
            heights: { left: 60, mid: 60, right: 60, fourth: 50 }
        }
    });


    useEffect(() => {
        const saved = localStorage.getItem('pageSettings');
        if (saved) {
            try { setSettings(JSON.parse(saved)); } catch (e) { console.error(e); }
        }
    }, []);

    const handleSave = (section) => {
        localStorage.setItem('pageSettings', JSON.stringify(settings));
        alert(`${section} settings saved successfully!`);
    };

    const updateSetting = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const updateNested = (section, nestedField, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [nestedField]: { ...prev[section][nestedField], [field]: value }
            }
        }));
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <Settings2 className="text-blue-600" size={28} />
                        Report Page Setup
                    </h1>
                    <p className="text-slate-500 mt-1">Configure margins, layouts and document elements for clinical reports</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-semibold"
                    >
                        <RotateCcw size={18} /> Reset All
                    </button>
                </div>
            </div>

            <div className="space-y-8 max-w-7xl">
                
                {/* 1. Letter Pad Setting (Red Header) */}
                <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                    <div className="bg-rose-500 px-6 py-4 flex items-center gap-3 text-white">
                        <Layout size={20} />
                        <h2 className="font-bold uppercase tracking-wider text-sm">Letter Pad Setting</h2>
                    </div>
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {/* Margins */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Top Margin</label>
                                <input 
                                    type="number" 
                                    value={settings.letterPad.topMargin}
                                    onChange={(e) => updateSetting('letterPad', 'topMargin', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none transition-all" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Left Margin</label>
                                <input 
                                    type="number" 
                                    value={settings.letterPad.leftMargin}
                                    onChange={(e) => updateSetting('letterPad', 'leftMargin', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Right Margin</label>
                                <input 
                                    type="number" 
                                    value={settings.letterPad.rightMargin}
                                    onChange={(e) => updateSetting('letterPad', 'rightMargin', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Bottom Margin</label>
                                <input 
                                    type="number" 
                                    value={settings.letterPad.bottomMargin}
                                    onChange={(e) => updateSetting('letterPad', 'bottomMargin', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Patient Format</label>
                                <select 
                                    value={settings.letterPad.patientFormat}
                                    onChange={(e) => updateSetting('letterPad', 'patientFormat', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none bg-white font-medium"
                                >
                                    <option>Format19</option>
                                    <option>Standard</option>
                                    <option>Compact</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Overlap</label>
                                <input 
                                    type="number" 
                                    value={settings.letterPad.overlap}
                                    onChange={(e) => updateSetting('letterPad', 'overlap', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" 
                                />
                            </div>

                            {/* Toggles Row 1 */}
                            <div className="col-span-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 py-4 border-y border-slate-100 mt-2">
                                {[
                                    { id: 'showFooter1', label: 'Footer 1' },
                                    { id: 'showFooter2', label: 'Footer 2' },
                                    { id: 'patientBoxed', label: 'Patient Boxed' },
                                    { id: 'pageNumber', label: 'Page Number' },
                                    { id: 'resultEndLine', label: 'Result End Line' },
                                    { id: 'removeTime', label: 'Remove Time' },
                                    { id: 'symbol', label: 'Symbol' },
                                    { id: 'testBottomLine', label: 'Test Bottom Line' },
                                    { id: 'endOfReport', label: 'End of Report' }
                                ].map(item => (
                                    <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            checked={settings.letterPad[item.id]}
                                            onChange={(e) => updateSetting('letterPad', item.id, e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-300 text-rose-500 focus:ring-rose-500 shadow-sm" 
                                        />
                                        <span className="text-xs font-semibold group-hover:text-rose-600 transition-colors uppercase">{item.label}</span>
                                    </label>
                                ))}
                            </div>

                            {/* Signatures */}
                            <div className="col-span-full grid grid-cols-4 gap-4 mt-2">
                                {['Left', 'Mid', 'Right', 'Fourth'].map(k => (
                                    <div key={k} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <label className="flex items-center gap-3 cursor-pointer mb-2">
                                            <input 
                                                type="checkbox" 
                                                checked={settings.letterPad.signatures[k.toLowerCase()]}
                                                onChange={(e) => updateNested('letterPad', 'signatures', k.toLowerCase(), e.target.checked)}
                                                className="w-4 h-4 rounded accent-rose-500" 
                                            />
                                            <span className="text-xs font-bold uppercase">{k} Signature</span>
                                        </label>
                                        <div>
                                            <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-tight">Sign Height</label>
                                            <input 
                                                type="number" 
                                                value={settings.letterPad.heights[k.toLowerCase()]}
                                                onChange={(e) => updateNested('letterPad', 'heights', k.toLowerCase(), e.target.value)}
                                                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none" 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Row */}
                        <div className="flex justify-end mt-8 pt-6 border-t border-slate-100/50">
                            <button 
                                onClick={() => handleSave('Letter Pad')}
                                className="px-12 py-3 bg-rose-500 hover:bg-rose-600 active:scale-[0.98] text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-rose-500/25"
                            >
                                Submit Letter Pad
                            </button>
                        </div>
                    </div>
                </section>

                {/* 2. A4 Page Setting (Green Header) */}
                <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                    <div className="bg-emerald-500 px-6 py-4 flex items-center gap-3 text-white">
                        <FileText size={20} />
                        <h2 className="font-bold uppercase tracking-wider text-sm">A4 Page Setting</h2>
                    </div>
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Header Height</label>
                                <input 
                                    type="number" 
                                    value={settings.a4Page.headerHeight}
                                    onChange={(e) => updateSetting('a4Page', 'headerHeight', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none px-3" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Left Margin</label>
                                <input 
                                    type="number" 
                                    value={settings.a4Page.leftMargin}
                                    onChange={(e) => updateSetting('a4Page', 'leftMargin', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Right Margin</label>
                                <input 
                                    type="number" 
                                    value={settings.a4Page.rightMargin}
                                    onChange={(e) => updateSetting('a4Page', 'rightMargin', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Bottom Margin</label>
                                <input 
                                    type="number" 
                                    value={settings.a4Page.bottomMargin}
                                    onChange={(e) => updateSetting('a4Page', 'bottomMargin', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Patient Format</label>
                                <select 
                                    value={settings.a4Page.patientFormat}
                                    onChange={(e) => updateSetting('a4Page', 'patientFormat', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
                                >
                                    <option>Format19</option>
                                    <option>Standard</option>
                                    <option>Grid</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Overlap</label>
                                <input 
                                    type="number" 
                                    value={settings.a4Page.overlap}
                                    onChange={(e) => updateSetting('a4Page', 'overlap', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                                />
                            </div>

                            {/* Toggles */}
                            <div className="col-span-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 py-4 border-y border-slate-100 mt-2">
                                {[
                                    { id: 'showFooter1', label: 'Footer 1' },
                                    { id: 'showFooter2', label: 'Footer 2' },
                                    { id: 'patientBoxed', label: 'Patient Boxed' },
                                    { id: 'pageNumber', label: 'Page Number' },
                                    { id: 'resultEndLine', label: 'Result End Line' },
                                    { id: 'removeTime', label: 'Remove Time' },
                                    { id: 'symbol', label: 'Symbol' },
                                    { id: 'testBottomLine', label: 'Test Bottom Line' },
                                    { id: 'endOfReport', label: 'End of Report' }
                                ].map(item => (
                                    <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            checked={settings.a4Page[item.id]}
                                            onChange={(e) => updateSetting('a4Page', item.id, e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 shadow-sm" 
                                        />
                                        <span className="text-xs font-semibold group-hover:text-emerald-600 transition-colors uppercase">{item.label}</span>
                                    </label>
                                ))}
                            </div>

                            {/* Signatures */}
                            <div className="col-span-full grid grid-cols-4 gap-4 mt-2">
                                {['Left', 'Mid', 'Right', 'Fourth'].map(k => (
                                    <div key={k} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <label className="flex items-center gap-3 cursor-pointer mb-2">
                                            <input 
                                                type="checkbox" 
                                                checked={settings.a4Page.signatures[k.toLowerCase()]}
                                                onChange={(e) => updateNested('a4Page', 'signatures', k.toLowerCase(), e.target.checked)}
                                                className="w-4 h-4 rounded accent-emerald-500" 
                                            />
                                            <span className="text-xs font-bold uppercase">{k} Signature</span>
                                        </label>
                                        <div>
                                            <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-tight">Sign Height</label>
                                            <input 
                                                type="number" 
                                                value={settings.a4Page.heights[k.toLowerCase()]}
                                                onChange={(e) => updateNested('a4Page', 'heights', k.toLowerCase(), e.target.value)}
                                                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none" 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Row */}
                        <div className="flex justify-end mt-8 pt-6 border-t border-slate-100/50">
                            <button 
                                onClick={() => handleSave('A4 Page')}
                                className="px-12 py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-emerald-500/25"
                            >
                                Submit A4 Setting
                            </button>
                        </div>
                    </div>
                </section>

                <div className="h-20" /> {/* Page Bottom Spacer */}

            </div>
        </div>
    );
}
