import React from 'react';

export const InputField = ({ label, name, type = "text", value, onChange, placeholder = "", className = "" }) => (
    <div className={`flex flex-col mb-3 ${className}`}>
        <label className="text-xs font-semibold text-slate-600 mb-1">{label}</label>
        <input
            type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 focus:bg-white transition-all outline-none font-medium text-slate-800 text-sm"
        />
    </div>
);

export const SelectField = ({ label, name, value, onChange, options, className = "", inputStyle = {} }) => (
    <div className={`flex flex-col mb-3 ${className}`}>
        <label className="text-xs font-semibold text-slate-600 mb-1">{label}</label>
        <select
            name={name} value={value} onChange={onChange} style={inputStyle}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 focus:bg-white transition-all outline-none font-medium text-slate-800 text-sm appearance-none"
        >
            {options.map((opt, i) => {
                const isObj = typeof opt === 'object';
                const val = isObj ? (opt.value || opt.label) : opt;
                const lab = isObj ? (opt.label || opt.value) : opt;
                const optStyle = isObj && opt.style ? opt.style : {};
                return <option key={i} value={val} style={optStyle}>{lab}</option>;
            })}
        </select>
    </div>
);

export const Checkbox = ({ label, name, checked, onChange }) => (
    <label className="flex items-center gap-2 cursor-pointer group">
        <input
            type="checkbox" name={name} checked={checked} onChange={onChange}
            className="w-4 h-4 rounded border-slate-300 text-fuchsia-600 focus:ring-fuchsia-500 transition-all cursor-pointer"
        />
        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">{label}</span>
    </label>
);
