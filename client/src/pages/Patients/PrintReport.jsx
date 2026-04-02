import React, { useState, useEffect, useRef } from 'react';

export default function PrintReport() {
    const [printData, setPrintData] = useState(null);
    const [allTests, setAllTests]   = useState([]);
    const [rows, setRows]           = useState([]);
    const printed = useRef(false);

    useEffect(() => {
        // Read data passed from ResultPrint (via localStorage — shared across tabs)
        const raw = localStorage.getItem('printData');
        if (raw) {
            try { setPrintData(JSON.parse(raw)); } catch {}
        }
        // Fetch all test definitions
        fetch('http://localhost:5000/api/tests')
            .then(r => r.json())
            .then(data => { if (data.success) setAllTests(data.tests); })
            .catch(console.error);
    }, []);

    // Build flat rows once both printData and allTests are available
    useEffect(() => {
        if (!printData || allTests.length === 0) return;
        const built = [];
        for (const pt of (printData.tests || [])) {
            const def = allTests.find(t => t.testName === pt.name);
            if (def && def.testFormat === 'Multiple' && def.childTests?.length > 0) {
                built.push({ type: 'group', name: pt.name });
                for (const childId of def.childTests) {
                    const childDef = allTests.find(t => t._id === childId || t._id === String(childId));
                    if (childDef) {
                        if (childDef.testFormat === 'Heading') {
                            built.push({ type: 'subheading', name: childDef.testName });
                        } else {
                            built.push({ type: 'param', name: childDef.testName, def: childDef, isChild: true });
                        }
                    }
                }
            } else if (def && def.testFormat === 'Heading') {
                built.push({ type: 'subheading', name: pt.name });
            } else {
                built.push({ type: 'param', name: pt.name, def: def || null, isChild: false });
            }
        }
        setRows(built);
    }, [printData, allTests]);

    // Auto-print once rows are ready
    useEffect(() => {
        if (rows.length > 0 && !printed.current) {
            printed.current = true;
            setTimeout(() => window.print(), 600);
        }
    }, [rows]);

    const getStatus = (def, testName) => {
        if (!printData) return 'none';
        const val = parseFloat(printData.results?.[testName]?.value);
        if (!def || isNaN(val)) return 'none';
        const low  = parseFloat(def.normalLower);
        const high = parseFloat(def.normalHigher);
        if (!isNaN(low)  && val < low)  return 'low';
        if (!isNaN(high) && val > high) return 'high';
        return 'normal';
    };

    if (!printData) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500 font-sans">
                <p>Loading report...</p>
            </div>
        );
    }

    const { patient, results = {}, letterPad } = printData;
    let paramNo = 0;

    return (
        <>
            {/* Print-only styles */}
            <style>{`
                @media print {
                    body { margin: 0; }
                    .no-print { display: none !important; }
                    .page { box-shadow: none !important; margin: 0 !important; }
                }
                @page { size: A4; margin: 10mm; }
                body { font-family: Arial, sans-serif; background: #e5e7eb; }
            `}</style>

            {/* Print Button (hidden on print) */}
            <div className="no-print flex gap-3 p-3 bg-gray-100 border-b border-gray-300">
                <button
                    onClick={() => window.print()}
                    className="px-5 py-2 bg-purple-700 text-white font-bold rounded hover:bg-purple-800"
                >
                    🖨 Print
                </button>
                <button
                    onClick={() => window.close()}
                    className="px-5 py-2 bg-gray-600 text-white font-bold rounded hover:bg-gray-700"
                >
                    ✕ Close
                </button>
            </div>

            {/* A4 Report Page */}
            <div className="page" style={{
                width: '210mm',
                minHeight: '297mm',
                margin: '10px auto',
                background: '#fff',
                boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
                padding: '0',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column'
            }}>

                {/* ── HEADER MARGIN FOR LETTERHEAD ── */}
                <div style={{ height: '40px' }}></div>

                {/* ── PATIENT INFO ── */}
                <div style={{ padding: '0 20px 10px' }}>
                    <div style={{ 
                        border: '1px solid #000', 
                        padding: '8px 12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '11px',
                        fontFamily: 'Arial, sans-serif'
                    }}>
                        {/* LEFT COLUMN */}
                        <div style={{ display: 'grid', gridTemplateColumns: '110px 10px 1fr', gap: '3px 0', lineHeight: '1.2' }}>
                            <div>PATIENT ID</div><div>:</div><div>{patient.labId || patient.id || '—'}</div>
                            <div>PATIENT NAME</div><div>:</div><div>{patient.prefix} {patient.fullName}</div>
                            <div>SEX / AGE</div><div>:</div><div>{patient.gender} / {patient.age} {patient.ageUnit}</div>
                            <div>MOBILE NO.</div><div>:</div><div>{patient.mobileNo || ''}</div>
                            <div>REF. DOCTOR</div><div>:</div><div>{patient.referBy || 'Self'}</div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div style={{ display: 'grid', gridTemplateColumns: '110px 10px 100px', gap: '3px 0', lineHeight: '1.2' }}>
                            <div>COLLECTED ON</div><div>:</div><div>{patient.reportingDate || '—'}</div>
                            <div>RECEIVED ON</div><div>:</div><div>{patient.reportingDate || '—'}</div>
                            <div>REPORTING ON</div><div>:</div><div>{new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}</div>
                            <div>BARCODE</div><div>:</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginTop: '2px' }}>
                                {/* Fake barcode */}
                                <div style={{ display: 'flex', height: '14px', width: '100%' }}>
                                    <div style={{ flex: 1, background: '#000' }}></div>
                                    <div style={{ flex: 0.5, background: '#fff' }}></div>
                                    <div style={{ flex: 2, background: '#000' }}></div>
                                    <div style={{ flex: 1, background: '#fff' }}></div>
                                    <div style={{ flex: 0.5, background: '#000' }}></div>
                                    <div style={{ flex: 2, background: '#fff' }}></div>
                                    <div style={{ flex: 1.5, background: '#000' }}></div>
                                    <div style={{ flex: 1, background: '#fff' }}></div>
                                    <div style={{ flex: 3, background: '#000' }}></div>
                                    <div style={{ flex: 1, background: '#fff' }}></div>
                                    <div style={{ flex: 1.5, background: '#000' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RESULTS TABLE ── */}
                <div style={{ padding: '0 20px', flex: 1 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', fontFamily: 'Arial, sans-serif' }}>
                        <thead>
                            <tr style={{ borderTop: '2px solid #000', borderBottom: '1px solid #000' }}>
                                <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 'bold', width: '40%' }}>Test Name</th>
                                <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 'bold', width: '20%' }}>Result</th>
                                <th style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 'bold', width: '20%' }}>Unit</th>
                                <th style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 'bold', width: '20%' }}>Normal Range</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, i) => {
                                // GROUP header row
                                if (row.type === 'group') {
                                    return (
                                        <tr key={`g-${i}`}>
                                            <td colSpan="4" style={{ padding: '12px 8px 6px', textAlign: 'center', fontWeight: '900' }}>
                                                <div style={{ fontSize: '12px' }}>[ {row.name.toUpperCase()} * ]</div>
                                                <div style={{ fontSize: '11px', marginTop: '2px' }}>HAEMATOLOGY</div>
                                            </td>
                                        </tr>
                                    );
                                }

                                // SUBHEADING row
                                if (row.type === 'subheading') {
                                    return (
                                        <tr key={`s-${i}`}>
                                            <td colSpan="4" style={{ padding: '6px 8px 2px', fontWeight: '900', textTransform: 'uppercase' }}>
                                                {row.name}
                                            </td>
                                        </tr>
                                    );
                                }

                                // PARAM row
                                paramNo++;
                                const def      = row.def;
                                const status   = getStatus(def, row.name);
                                const val      = results[row.name]?.value ?? '';
                                const rangeTxt = def
                                    ? [def.normalLower, def.normalHigher].filter(Boolean).join(' - ')
                                    : '';
                                
                                const groupDef = !row.isChild ? def : (() => {
                                    for (let j = i - 1; j >= 0; j--) {
                                        if (rows[j].type === 'group') return allTests.find(t => t.testName === rows[j].name);
                                    }
                                    return null;
                                })();
                                const next = rows[i + 1];
                                const isLastInGroup = !next || next.type === 'group';
                                const showContentAfter = isLastInGroup && groupDef?.showComment && groupDef?.content;

                                const isBold = !row.isChild;

                                return (
                                    <React.Fragment key={`frag-${i}`}>
                                        <tr>
                                            <td style={{
                                                padding: '4px 8px',
                                                fontWeight: isBold ? '900' : '500',
                                                textTransform: 'uppercase',
                                                color: '#000'
                                            }}>
                                                {row.name}
                                            </td>
                                            <td style={{ padding: '4px 8px', textAlign: 'left' }}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span style={{ width: '16px', fontWeight: '900', display: 'inline-block' }}>
                                                        {status === 'high' ? 'H' : status === 'low' ? 'L' : ''}
                                                    </span>
                                                    <span style={{ fontWeight: (status !== 'normal' && val !== '') || isBold ? '900' : '500' }}>
                                                        {val !== '' ? val : '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '4px 8px', textAlign: 'center', color: '#000' }}>
                                                {def?.unit || ''}
                                            </td>
                                            <td style={{ padding: '4px 8px', textAlign: 'center', color: '#000' }}>
                                                {rangeTxt || ''}
                                            </td>
                                        </tr>
                                        {showContentAfter && (
                                            <tr>
                                                <td colSpan="5" style={{
                                                    padding: '8px 14px',
                                                    background: '#fffbeb',
                                                    borderBottom: '2px solid #fde68a',
                                                    fontSize: '10px',
                                                    color: '#78350f',
                                                }}>
                                                    <div 
                                                        style={{ fontStyle: 'italic', lineHeight: '1.4' }}
                                                        dangerouslySetInnerHTML={{ __html: groupDef.content }}
                                                    />
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}

                            {rows.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
                                        No results available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── FOOTER ── */}
                <div style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    textAlign: 'center',
                    fontWeight: '900',
                    fontSize: '11px',
                    fontFamily: 'Arial, sans-serif'
                }}>
                    <div style={{ borderTop: '2px solid #000', marginBottom: '16px' }}></div>
                    ---End Of The Report---
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    padding: '10px 40px 30px',
                    fontSize: '10px',
                    fontWeight: '900',
                    fontFamily: 'Arial, sans-serif'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '120px', height: '40px', borderBottom: '1px solid #ccc', margin: '0 auto 5px' }}>
                            {/* Signature Mock */}
                            <svg viewBox="0 0 100 40" style={{ width: '100%', height: '100%', opacity: 0.8 }}>
                                <path d="M10,30 Q25,10 40,30 T70,5" fill="none" stroke="#000" strokeWidth="1.5" />
                                <path d="M40,20 L60,40" fill="none" stroke="#000" strokeWidth="1" />
                            </svg>
                        </div>
                        <div>DR. ARUN KUMAR GUPTA</div>
                        <div>MD. (PATH.)</div>
                    </div>
                    
                    <div style={{ width: '70px', height: '70px' }}>
                        {/* Mock QR Code */}
                        <svg viewBox="0 0 10 10" width="100%" height="100%">
                            <rect width="10" height="10" fill="#000" />
                            <rect width="8" height="8" fill="#fff" x="1" y="1" />
                            <rect width="3" height="3" fill="#000" x="2" y="2" />
                            <rect width="3" height="3" fill="#000" x="5" y="5" />
                            <rect width="2" height="2" fill="#000" x="6" y="2" />
                            <rect width="2" height="2" fill="#000" x="2" y="6" />
                        </svg>
                    </div>
                </div>

            </div>
        </>
    );
}
