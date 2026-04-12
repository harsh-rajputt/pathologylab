import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DatabaseZap, ShieldCheck, RefreshCw,
    AlertTriangle, CheckCircle2, XCircle, Users, FlaskConical,
    Building2, Ruler, Tag, UserPlus, Calendar, FileJson,
    Clock, HardDrive, CloudDownload, CloudUpload, Info, X, Lock, Key, Upload, Download, CreditCard
} from 'lucide-react';

const API = 'http://localhost:5000/api/backup';

// ── small helpers ─────────────────────────────────────────────────────────────
const fmt = (n) => (n ?? 0).toLocaleString();

const COLLECTION_META = {
    patients:            { label: 'Patients',             icon: Users,        color: 'blue'    },
    tests:               { label: 'Tests',                icon: FlaskConical, color: 'violet'  },
    departments:         { label: 'Departments',          icon: Building2,    color: 'emerald' },
    wings:               { label: 'Wings',                icon: Tag,          color: 'amber'   },
    units:               { label: 'Units',                icon: Ruler,        color: 'cyan'    },
    references:          { label: 'Reference Doctors',    icon: UserPlus,     color: 'rose'    },
    ageCategories:       { label: 'Age Categories',       icon: Calendar,     color: 'orange'  },
    abnormalIndications: { label: 'Abnormal Indications', icon: AlertTriangle, color: 'fuchsia'},
};

const COLOR = {
    blue:    { bg: 'bg-blue-50',    icon: 'text-blue-600',    badge: 'bg-blue-100 text-blue-700'   },
    violet:  { bg: 'bg-violet-50',  icon: 'text-violet-600',  badge: 'bg-violet-100 text-violet-700'},
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700'},
    amber:   { bg: 'bg-amber-50',   icon: 'text-amber-600',   badge: 'bg-amber-100 text-amber-700' },
    cyan:    { bg: 'bg-cyan-50',    icon: 'text-cyan-600',    badge: 'bg-cyan-100 text-cyan-700'   },
    rose:    { bg: 'bg-rose-50',    icon: 'text-rose-600',    badge: 'bg-rose-100 text-rose-700'   },
    orange:  { bg: 'bg-orange-50',  icon: 'text-orange-600',  badge: 'bg-orange-100 text-orange-700'},
    fuchsia: { bg: 'bg-fuchsia-50', icon: 'text-fuchsia-600', badge: 'bg-fuchsia-100 text-fuchsia-700'},
};

// ── Confirm-restore modal ──────────────────────────────────────────────────────
function RestoreConfirmModal({ file, onConfirm, onCancel }) {
    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onCancel}
                />
                <motion.div
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 20 }}
                >
                    {/* Header */}
                    <div className="bg-rose-600 px-6 py-4 flex items-center gap-3 text-white">
                        <AlertTriangle size={22} strokeWidth={2.5} />
                        <h3 className="text-lg font-bold">Confirm Database Restore</h3>
                        <button onClick={onCancel} className="ml-auto hover:bg-white/20 p-1 rounded-lg transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                            <AlertTriangle size={20} className="text-rose-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-rose-800 font-medium leading-relaxed">
                                This action will <strong>permanently replace all current data</strong> with
                                the data from the selected backup file. This cannot be undone.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <FileJson size={18} className="text-slate-500 shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-slate-500 font-medium">Selected file</p>
                                <p className="text-sm font-bold text-slate-800 truncate">{file?.name}</p>
                                <p className="text-xs text-slate-400">{file ? (file.size / 1024).toFixed(1) + ' KB' : ''}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                            <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-800 leading-relaxed">
                                Make sure to take a <strong>backup of current data first</strong> before restoring, in case you need to roll back.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6 flex gap-3 justify-end">
                        <button
                            onClick={onCancel}
                            className="px-5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-5 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow transition-colors flex items-center gap-2"
                        >
                            <CloudUpload size={16} />
                            Yes, Restore Now
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function DatabaseServices() {
    // ── Support Auth State ───────────────────────────────────────────────────
    const [isAuthorized, setIsAuthorized]   = useState(false);
    const [passcode, setPasscode]           = useState('');
    const [authError, setAuthError]         = useState('');
    const [isAuthLoading, setIsAuthLoading] = useState(false);

    const [dbInfo, setDbInfo]               = useState(null);
    const [loadingInfo, setLoadingInfo]     = useState(true);
    const [backupStatus, setBackupStatus]   = useState(null); // null | 'loading' | 'done' | 'error'
    const [restoreStatus, setRestoreStatus] = useState(null); // null | 'loading' | 'done' | 'error'
    const [restoreMsg, setRestoreMsg]       = useState('');
    const [restoreSummary, setRestoreSummary] = useState(null);

    const [pendingFile, setPendingFile]     = useState(null); // file awaiting confirmation
    const [showConfirm, setShowConfirm]     = useState(false);
    const [isDragOver, setIsDragOver]       = useState(false);

    const fileInputRef = useRef(null);

    // ── License Management ───────────────────────────────────────────────────
    const [licenseInfo, setLicenseInfo]         = useState(null);
    const [loadingLicense, setLoadingLicense]   = useState(true);
    const [activationKey, setActivationKey]     = useState('');
    const [activationStatus, setActivationStatus] = useState(null);
    const [activationMsg, setActivationMsg]     = useState('');

    const fetchLicenseInfo = async () => {
        setLoadingLicense(true);
        try {
            const res = await fetch(`http://localhost:5000/api/license/status`);
            const data = await res.json();
            setLicenseInfo(data);
        } catch (err) {
            console.error('Failed to fetch license', err);
        }
        setLoadingLicense(false);
    };

    const handleActivateLicense = async () => {
        if (!activationKey.trim()) return;
        setActivationStatus('loading');
        try {
            const res = await fetch(`http://localhost:5000/api/license/activate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: activationKey.trim() })
            });
            const data = await res.json();
            setActivationStatus(data.success ? 'success' : 'error');
            setActivationMsg(data.message);
            if (data.success) {
                setActivationKey('');
                fetchLicenseInfo();
            }
        } catch (err) {
            setActivationStatus('error');
            setActivationMsg('Could not connect to server.');
        }
        setTimeout(() => setActivationStatus(null), 5000);
    };

    // ── fetch live DB stats ──────────────────────────────────────────────────
    const fetchInfo = async () => {
        setLoadingInfo(true);
        try {
            const res  = await fetch(`${API}/info`);
            const data = await res.json();
            if (data.success) setDbInfo(data);
        } catch (_err) {
            /* server offline – show empty state */
        } finally {
            setLoadingInfo(false);
        }
    };

    useEffect(() => { fetchInfo(); fetchLicenseInfo(); }, []);

    // ── Backup (download) ────────────────────────────────────────────────────
    const handleBackup = async () => {
        setBackupStatus('loading');
        try {
            const res = await fetch(API);
            if (!res.ok) throw new Error('Server error');

            const blob     = await res.blob();
            const url      = URL.createObjectURL(blob);
            const link     = document.createElement('a');
            const today    = new Date().toISOString().slice(0, 10);
            link.href      = url;
            link.download  = `pathlab-backup-${today}.json`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
            setBackupStatus('done');
        } catch (_err) {
            setBackupStatus('error');
        }
        setTimeout(() => setBackupStatus(null), 4000);
    };

    // ── Restore — step 1: pick file ──────────────────────────────────────────
    const handleFilePick = (file) => {
        if (!file || !file.name.endsWith('.json')) {
            setRestoreMsg('Please select a valid .json backup file.');
            setRestoreStatus('error');
            setTimeout(() => setRestoreStatus(null), 4000);
            return;
        }
        setPendingFile(file);
        setShowConfirm(true);
    };

    // ── Restore — step 2: confirmed ──────────────────────────────────────────
    const handleRestoreConfirmed = async () => {
        setShowConfirm(false);
        setRestoreStatus('loading');
        setRestoreSummary(null);
        try {
            const text = await pendingFile.text();
            const json = JSON.parse(text);

            const res  = await fetch(`${API}/restore`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(json),
            });
            const data = await res.json();

            if (data.success) {
                setRestoreStatus('done');
                setRestoreMsg(data.message);
                setRestoreSummary(data.summary);
                fetchInfo(); // refresh stats
            } else {
                setRestoreStatus('error');
                setRestoreMsg(data.error || 'Restore failed.');
            }
        } catch (_err) {
            setRestoreStatus('error');
            setRestoreMsg('Could not parse backup file. Make sure it was created by this software.');
        }
        setPendingFile(null);
    };

    const totalRecords = dbInfo
        ? Object.values(dbInfo.counts).reduce((a, b) => a + b, 0)
        : 0;

    const handleAuth = async (e) => {
        e.preventDefault();
        setIsAuthLoading(true);
        setAuthError('');
        
        try {
            const res = await fetch(`${API}/verify-passcode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ passcode })
            });
            const data = await res.json();
            
            if (data.success) {
                setIsAuthorized(true);
                setAuthError('');
            } else {
                setAuthError('Incorrect support passcode. Access denied.');
                setPasscode('');
            }
        } catch (err) {
            setAuthError('Server error verifying passcode. Make sure server is running.');
        } finally {
            setIsAuthLoading(false);
        }
    };

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-md w-full text-center"
                >
                    <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock size={32} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-2">Restricted Access</h2>
                    <p className="text-slate-500 text-sm mb-8">
                        Database migration tools are reserved for the company support team to prevent unauthorized data cloning.
                    </p>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div>
                            <div className="relative">
                                <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="password"
                                    placeholder="Enter Support Passcode"
                                    value={passcode}
                                    onChange={(e) => setPasscode(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-slate-700 font-medium"
                                    autoFocus
                                />
                            </div>
                            {authError && (
                                <motion.p 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }} 
                                    className="text-rose-600 text-xs font-semibold mt-2 text-left px-1"
                                >
                                    {authError}
                                </motion.p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={isAuthLoading}
                            className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
                        >
                            {isAuthLoading ? (
                                <><RefreshCw size={18} className="animate-spin" /> Verifying...</>
                            ) : (
                                <><ShieldCheck size={18} /> Unlock Database Services</>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8 font-sans">

            {/* ── Page Header ──────────────────────────────────────────────── */}
            <motion.header
                className="mb-8"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm border border-indigo-200">
                        <DatabaseZap size={24} className="stroke-[2.5]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Database Services
                        </h1>
                        <p className="text-slate-500 mt-0.5 font-medium">
                            Backup your data and restore it on a new system — never lose patient records again.
                        </p>
                    </div>
                </div>
            </motion.header>

            {/* ── Grid Layout ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── LEFT: Live DB Stats (2/3 width) ─────────────────────── */}
                <motion.div
                    className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                >
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                            <HardDrive size={20} strokeWidth={2.5} />
                            <h2 className="text-lg font-bold">Current Database Stats</h2>
                        </div>
                        <button
                            onClick={fetchInfo}
                            disabled={loadingInfo}
                            className="hover:bg-white/20 p-1.5 rounded-lg transition-colors disabled:opacity-50"
                            title="Refresh stats"
                        >
                            <RefreshCw size={18} className={loadingInfo ? 'animate-spin' : ''} />
                        </button>
                    </div>

                    <div className="p-6">
                        {/* Total banner */}
                        <div className="mb-5 p-4 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">Total Records</p>
                                <p className="text-4xl font-extrabold text-indigo-700 mt-0.5">
                                    {loadingInfo ? '—' : fmt(totalRecords)}
                                </p>
                            </div>
                            <div className="p-3 bg-indigo-100 rounded-xl">
                                <DatabaseZap size={28} className="text-indigo-600" />
                            </div>
                        </div>

                        {/* Per-collection grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {Object.entries(COLLECTION_META).map(([key, meta]) => {
                                const Icon    = meta.icon;
                                const c       = COLOR[meta.color];
                                const count   = dbInfo?.counts?.[key] ?? 0;
                                return (
                                    <div
                                        key={key}
                                        className={`${c.bg} rounded-2xl p-4 flex flex-col gap-2 border border-white`}
                                    >
                                        <div className={`${c.icon} w-fit`}>
                                            <Icon size={18} strokeWidth={2.5} />
                                        </div>
                                        <p className="text-xs font-semibold text-slate-500 leading-tight">{meta.label}</p>
                                        <p className={`text-2xl font-extrabold ${c.icon}`}>
                                            {loadingInfo ? '—' : fmt(count)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {dbInfo && (
                            <p className="mt-4 text-xs text-slate-400 text-right flex items-center justify-end gap-1">
                                <Clock size={11} /> Last fetched: {new Date(dbInfo.fetchedAt).toLocaleTimeString()}
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* ── RIGHT: Actions column ────────────────────────────────── */}
                <div className="flex flex-col gap-6">

                    {/* LICENSE card */}
                    <motion.div
                        className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.08 }}
                    >
                        <div className="bg-slate-900 px-5 py-4 text-white flex items-center gap-2">
                            <CreditCard size={20} className="text-amber-400" strokeWidth={2.5} />
                            <h2 className="text-lg font-bold">Software License (AMC)</h2>
                        </div>
                        <div className="p-5 space-y-4">
                            {loadingLicense ? (
                                <div className="animate-pulse flex space-x-4">
                                    <div className="h-10 bg-slate-200 rounded w-full"></div>
                                </div>
                            ) : (
                                <div>
                                    <div className={`p-3 rounded-xl border mb-4 flex items-start gap-3 ${licenseInfo?.status === 'locked' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                                        {licenseInfo?.status === 'locked' ? <AlertTriangle size={18} className="mt-0.5 text-rose-600" /> : <ShieldCheck size={18} className="mt-0.5 text-emerald-600" />}
                                        <div>
                                            <p className="text-sm font-bold">{licenseInfo?.message}</p>
                                            <div className="flex gap-4 mt-2 text-xs font-semibold opacity-80">
                                                <span>Tier: {licenseInfo?.type || 'N/A'}</span>
                                                <span>Limit: {licenseInfo?.limits?.maxPatients >= 999999 ? 'Unlimited' : licenseInfo?.limits?.maxPatients} Pts</span>
                                                <span>Expiry: {licenseInfo?.limits?.validUntil ? new Date(licenseInfo?.limits?.validUntil).toLocaleDateString() : 'Never'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Apply Product Key</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                                    placeholder="Paste License JWT Key here..."
                                    value={activationKey}
                                    onChange={e => setActivationKey(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={handleActivateLicense}
                                disabled={activationStatus === 'loading' || !activationKey.trim()}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                {activationStatus === 'loading' ? (
                                    <><RefreshCw size={16} className="animate-spin" /> VerifyingKey…</>
                                ) : (
                                    <><Key size={16} /> Activate License</>
                                )}
                            </button>

                            <AnimatePresence>
                                {activationStatus === 'success' && (
                                    <motion.div className="flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                        <CheckCircle2 size={16} /> {activationMsg}
                                    </motion.div>
                                )}
                                {activationStatus === 'error' && (
                                    <motion.div className="flex items-center gap-2 text-sm font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                        <XCircle size={16} /> {activationMsg}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* BACKUP card */}
                    <motion.div
                        className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4 text-white flex items-center gap-2">
                            <CloudDownload size={20} strokeWidth={2.5} />
                            <h2 className="text-lg font-bold">Create Backup</h2>
                        </div>
                        <div className="p-5 space-y-4">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Download a complete snapshot of <strong>all patient records, tests, references, 
                                and settings</strong> as a single JSON file. Store it safely on a USB drive or cloud storage.
                            </p>
                            <ul className="space-y-2">
                                {['All patient records & reports', 'Tests, departments & wings', 'Reference doctors', 'Age categories & abnormal ranges'].map(item => (
                                    <li key={item} className="flex items-center gap-2 text-xs text-slate-600">
                                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={handleBackup}
                                disabled={backupStatus === 'loading'}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                {backupStatus === 'loading' ? (
                                    <><RefreshCw size={16} className="animate-spin" /> Generating…</>
                                ) : (
                                    <><Download size={16} /> Download Backup (.json)</>
                                )}
                            </button>

                            {/* Backup status */}
                            <AnimatePresence>
                                {backupStatus === 'done' && (
                                    <motion.div
                                        className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3"
                                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    >
                                        <CheckCircle2 size={16} /> Backup downloaded successfully!
                                    </motion.div>
                                )}
                                {backupStatus === 'error' && (
                                    <motion.div
                                        className="flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3"
                                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    >
                                        <XCircle size={16} /> Backup failed. Is the server running?
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* RESTORE card */}
                    <motion.div
                        className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                    >
                        <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-4 text-white flex items-center gap-2">
                            <CloudUpload size={20} strokeWidth={2.5} />
                            <h2 className="text-lg font-bold">Restore Backup</h2>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                                    Restoring will <strong>replace all existing data</strong>. Only use a backup file
                                    downloaded from this software.
                                </p>
                            </div>

                            {/* Drag-and-drop zone */}
                            <div
                                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer transition-all ${
                                    isDragOver
                                        ? 'border-rose-400 bg-rose-50'
                                        : 'border-slate-200 hover:border-rose-300 hover:bg-rose-50/30'
                                }`}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                                onDragLeave={() => setIsDragOver(false)}
                                onDrop={e => {
                                    e.preventDefault();
                                    setIsDragOver(false);
                                    handleFilePick(e.dataTransfer.files?.[0]);
                                }}
                            >
                                <div className="p-3 bg-rose-100 rounded-xl">
                                    <FileJson size={24} className="text-rose-600" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-slate-700">
                                        {restoreStatus === 'loading' ? 'Restoring…' : 'Drop backup file here'}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">or click to browse (.json)</p>
                                </div>
                                {restoreStatus === 'loading' && (
                                    <RefreshCw size={20} className="animate-spin text-rose-500" />
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json"
                                className="hidden"
                                onChange={e => handleFilePick(e.target.files?.[0])}
                            />

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={restoreStatus === 'loading'}
                                className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                <Upload size={16} />
                                Choose Backup File
                            </button>

                            {/* Restore status */}
                            <AnimatePresence>
                                {restoreStatus === 'done' && (
                                    <motion.div
                                        className="space-y-2"
                                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    >
                                        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                                            <CheckCircle2 size={16} className="shrink-0" />
                                            <span>{restoreMsg}</span>
                                        </div>
                                        {restoreSummary && (
                                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
                                                <p className="text-xs font-bold text-slate-600 mb-2">Restored records:</p>
                                                {Object.entries(restoreSummary).map(([k, v]) => (
                                                    <div key={k} className="flex justify-between text-xs text-slate-600">
                                                        <span>{COLLECTION_META[k]?.label ?? k}</span>
                                                        <span className="font-bold text-slate-800">{fmt(v)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                                {restoreStatus === 'error' && (
                                    <motion.div
                                        className="flex items-start gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3"
                                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    >
                                        <XCircle size={16} className="shrink-0 mt-0.5" />
                                        <span>{restoreMsg}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── HOW IT WORKS section ─────────────────────────────────────── */}
            <motion.div
                className="mt-6 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 p-6"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                <div className="flex items-center gap-2 mb-5">
                    <ShieldCheck size={18} className="text-indigo-600" />
                    <h3 className="text-base font-bold text-slate-800">How to Migrate to a New System</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {[
                        { step: '1', color: 'emerald', title: 'Take Backup',      desc: 'On the old system click "Download Backup". Save the .json file on a USB drive or email it to yourself.' },
                        { step: '2', color: 'blue',    title: 'Install Software', desc: 'Install this software on the new system and start the server. The database will be empty at first.' },
                        { step: '3', color: 'rose',    title: 'Restore Data',     desc: 'Open Database Services, click "Choose Backup File", select the .json file and confirm the restore.' },
                        { step: '4', color: 'violet',  title: 'Continue Work',    desc: 'All patients, tests, references and configurations will be restored exactly as they were.' },
                    ].map(({ step, color, title, desc }) => (
                        <div key={step} className="flex gap-3">
                            <div className={`shrink-0 w-8 h-8 rounded-full bg-${color}-100 text-${color}-700 flex items-center justify-center text-sm font-extrabold`}>
                                {step}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800 mb-1">{title}</p>
                                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── Confirm modal ────────────────────────────────────────────── */}
            {showConfirm && (
                <RestoreConfirmModal
                    file={pendingFile}
                    onConfirm={handleRestoreConfirmed}
                    onCancel={() => { setShowConfirm(false); setPendingFile(null); }}
                />
            )}
        </div>
    );
}
