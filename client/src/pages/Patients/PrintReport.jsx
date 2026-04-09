import React, { useState, useEffect, useRef } from 'react';

export default function PrintReport() {
    const [printData, setPrintData] = useState(null);
    const [allTests, setAllTests]   = useState([]);
    const [rows, setRows]           = useState([]);
    const [design, setDesign]       = useState({
        testHeading: 'Test Name',
        findingHeader: 'Result',
        findingAlign: 'Left',
        unitHeader: 'Unit',
        unitAlign: 'Left',
        rangeHeader: 'Normal Range',
        rangeAlign: 'Left',
        fontFamily: 'Arial',
        gapBetween: '17',
        fontSize: '12',
        methodFontSize: '8',
        deptStyle: 'Center',
        printBorder: false
    });
    const [abnormalList, setAbnormalList] = useState([]);
    const [profile, setProfile] = useState(null);
    const [pageSettings, setPageSettings] = useState({
        letterPad: {
            topMargin: 100, leftMargin: 25, rightMargin: 15, bottomMargin: 100,
            patientFormat: 'Format19', overlap: 110,
            showFooter1: false, showFooter2: false,
            patientBoxed: true, pageNumber: true,
            resultEndLine: false, removeTime: true,
            symbol: true, testBottomLine: true,
            endOfReport: true,
            signatures: { left: true, mid: false, right: false, fourth: false }
        },
        a4Page: {
            headerHeight: 134, leftMargin: 10, rightMargin: 10, bottomMargin: 100,
            patientFormat: 'Format19', overlap: 134,
            showFooter1: true, showFooter2: false,
            patientBoxed: true, pageNumber: true,
            resultEndLine: true, removeTime: false,
            symbol: true, testBottomLine: true,
            endOfReport: true,
            signatures: { left: true, mid: false, right: false, fourth: false }
        }
    });
    const [isLetterPad, setIsLetterPad] = useState(false);
    const printed = useRef(false);

    useEffect(() => {
        // 1. Load Design Settings
        const designRaw = localStorage.getItem('reportDesignSettings');
        if (designRaw) {
            try { setDesign(JSON.parse(designRaw)); } catch (_err) { /* use defaults */ }
        }

        // 2. Load Profile (Logo, Margins, etc)
        const profileRaw = localStorage.getItem('labProfile');
        if (profileRaw) {
            try { setProfile(JSON.parse(profileRaw)); } catch (_err) { /* use defaults */ }
        }

        // 3. Load Print Data
        const raw = localStorage.getItem('printData');
        if (raw) {
            try { 
                const pRaw = JSON.parse(raw);
                setPrintData(pRaw); 
                if (pRaw.letterPad !== undefined) {
                    setIsLetterPad(pRaw.letterPad);
                }
            } catch (_err) { /* use defaults */ }
        }

        // 3.5 Load Page Setup
        const pageRaw = localStorage.getItem('pageSettings');
        if (pageRaw) {
            try { setPageSettings(JSON.parse(pageRaw)); } catch (_err) { /* use defaults */ }
        }

        // 4. Fetch Master Data
        const fetchMasters = async () => {
            try {
                const [testsRes, abnormalRes] = await Promise.all([
                    fetch('http://localhost:5000/api/tests').then(r => r.json()),
                    fetch('http://localhost:5000/api/abnormal-indications').then(r => r.json())
                ]);
                
                if (testsRes.success) setAllTests(testsRes.data.tests);
                if (abnormalRes.success) setAbnormalList(abnormalRes.data.items);
            } catch (err) {
                console.error("Master Fetch Error:", err);
            }
        };
        fetchMasters();
    }, []);

    // Build flat rows once both printData and allTests are available
    useEffect(() => {
        if (!printData || allTests.length === 0) return;
        const built = [];
        for (const pt of (printData.tests || [])) {
            const def = allTests.find(t => t.testName === pt.name);
            if (def && def.testFormat === 'Multiple' && def.childTests?.length > 0) {
                built.push({ type: 'group', name: pt.name, department: def.department });
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

    const getAbnormalConfig = (def, testName) => {
        if (!printData || !def) return null;
        const val = parseFloat(printData.results?.[testName]?.value);
        if (isNaN(val)) return null;

        const lowBound  = parseFloat(def.normalLower);
        const highBound = parseFloat(def.normalHigher);

        let type = 'normal';
        if (!isNaN(lowBound) && val < lowBound) type = 'low';
        if (!isNaN(highBound) && val > highBound) type = 'high';

        if (type === 'normal') return null;

        // Find matching indicator from DB
        const match = abnormalList.find(item => item.isDefault) || abnormalList[0];
        if (!match) return { symbol: type === 'low' ? 'L' : 'H', color: '#DC2626' };
        
        return {
            symbol: type === 'low' ? match.low : match.high,
            color: match.color
        };
    };

    if (!printData) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500 font-sans">
                <p>Loading report...</p>
            </div>
        );
    }

    const { patient, results = {} } = printData;
    const config = isLetterPad ? pageSettings.letterPad : pageSettings.a4Page;

    return (
        <div className="min-h-screen bg-transparent">
            {/* Print-only styles */}
            <style>{`
                @media print {
                    @page { margin: 0; }
                    .no-print { display: none !important; }
                    body { margin: 0; padding: 0; background: #fff !important; }
                }
                body { font-family: '${design.fontFamily}', sans-serif; background: #e5e7eb; }
            `}</style>

            {/* Simple Print Toolbar (hidden on print) */}
            <div className="no-print flex gap-3 p-3 bg-gray-100 border-b border-gray-300">
                <button
                    onClick={() => window.print()}
                    className="px-5 py-2 bg-purple-700 text-white font-bold rounded hover:bg-purple-800 shadow-sm"
                >
                    🖨 Print Report
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
                paddingTop: isLetterPad ? `${config.topMargin || 100}px` : `${config.headerHeight || 0}px`,
                paddingLeft: `${config.leftMargin || 0}px`,
                paddingRight: `${config.rightMargin || 0}px`,
                paddingBottom: `${config.bottomMargin || 50}px`,
                fontSize: `${design.fontSize}px`,
                fontFamily: `'${design.fontFamily}', sans-serif`,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                border: design.printBorder ? '1px solid #000' : 'none'
            }}>

                {/* ── HEADER / LETTERHEAD ── */}
                {!isLetterPad && (
                    <>
                        {profile?.headerUrl ? (
                            <div style={{ width: '100%', marginBottom: '15px' }}>
                                <img 
                                    src={profile.headerUrl} 
                                    alt="Letterhead" 
                                    style={{ 
                                        width: '100%', 
                                        display: 'block',
                                        objectFit: 'contain'
                                    }} 
                                />
                            </div>
                        ) : (
                            <div style={{ 
                                padding: '30px 40px 15px', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                borderBottom: '2.5px solid #000',
                                marginBottom: '15px',
                                margin: '0 40px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    {profile?.logoUrl && (
                                        <img src={profile.logoUrl} alt="Logo" style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
                                    )}
                                    <div>
                                        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#000', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            {profile?.labName || 'LABORATORY REPORT'}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ── PATIENT INFO TRADITIONAL ── */}
                <div style={{ padding: '0 40px 15px' }}>
                    <div style={{ 
                        border: '1.5px solid #000', 
                        padding: '10px 15px',
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 0.8fr',
                        gap: '0 40px',
                        fontSize: '12px',
                        lineHeight: '1.3'
                    }}>
                        {/* LEFT COLUMN */}
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 5px 1fr', gap: '3px 0' }}>
                            <div style={{ fontWeight: '500' }}>PATIENT ID</div><div>:</div><div>{patient.labId || patient.id || '—'}</div>
                            <div style={{ fontWeight: '500' }}>PATIENT NAME</div><div>:</div><div>{patient.prefix} {patient.fullName}</div>
                            <div style={{ fontWeight: '500' }}>SEX / AGE</div><div>:</div><div>{patient.gender} / {patient.age} {patient.ageUnit}</div>
                            <div style={{ fontWeight: '500' }}>MOBILE NO.</div><div>:</div><div>{patient.mobileNo || '—'}</div>
                            <div style={{ fontWeight: '500' }}>REF. DOCTOR</div><div>:</div><div>{patient.referBy || 'Self'}</div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 5px 1fr', gap: '3px 0' }}>
                            <div style={{ fontWeight: '500' }}>COLLECTED ON</div><div>:</div><div>{patient.reportingDate || '—'}</div>
                            <div style={{ fontWeight: '500' }}>RECEIVED ON</div><div>:</div><div>{patient.reportingDate || '—'}</div>
                            <div style={{ fontWeight: '500' }}>REPORTING ON</div><div>:</div><div>{new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}</div>
                            <div style={{ fontWeight: '500' }}>BARCODE</div><div>:</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginTop: '2px' }}>
                                <div style={{ display: 'flex', height: '18px', width: '100%', background: '#fff' }}>
                                    {[2, 1, 4, 1, 3, 2, 5, 2, 4, 1, 3].map((w, idx) => (
                                        <div key={idx} style={{ flex: w, background: idx % 2 === 0 ? '#000' : '#fff' }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RESULTS TABLE ── */}
                <div style={{ padding: '0 40px', flex: 1 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: `${design.fontSize}px` }}>
                        <thead>
                            <tr style={{ borderTop: '2.5px solid #000', borderBottom: '1.5px solid #000' }}>
                                <th style={{ padding: '8px 5px', textAlign: 'left', fontWeight: 'bold', width: '40%' }}>{design.testHeading}</th>
                                <th style={{ padding: '8px 5px', textAlign: 'center', fontWeight: 'bold', width: '20%' }}>{design.findingHeader}</th>
                                <th style={{ padding: '8px 5px', textAlign: 'left', fontWeight: 'bold', width: '20%' }}>{design.unitHeader}</th>
                                <th style={{ padding: '8px 5px', textAlign: 'left', fontWeight: 'bold', width: '20%' }}>{design.rangeHeader}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, i) => {
                                // GROUP header row (Department/Wing)
                                if (row.type === 'group') {
                                    return (
                                        <React.Fragment key={`g-${i}`}>
                                            <tr>
                                                <td colSpan="4" style={{ padding: '15px 5px 2px', textAlign: 'center', fontWeight: 'bold', border: 'none' }}>
                                                    <div style={{ fontSize: '14px', textTransform: 'uppercase' }}>[ {row.name} * ]</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="4" style={{ padding: '0 5px 12px', textAlign: 'center', fontWeight: 'bold' }}>
                                                    <div style={{ fontSize: '13px', textTransform: 'uppercase', textDecoration: 'underline' }}>
                                                        {row.department || 'LABORATORY'}
                                                    </div>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    );
                                }

                                // SUBHEADING row (e.g., Differential Count)
                                if (row.type === 'subheading') {
                                    return (
                                        <tr key={`s-${i}`}>
                                            <td colSpan="4" style={{ padding: '10px 5px 2px', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}>
                                                {row.name}
                                            </td>
                                        </tr>
                                    );
                                }

                                // PARAM row (Individual test values)
                                const def       = row.def;
                                const abnormal  = getAbnormalConfig(def, row.name);
                                const val       = results[row.name]?.value ?? '';
                                const rangeTxt  = def
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
                                        <tr style={{ borderBottom: design.multiUnderline && !row.isChild ? '1px solid #eee' : 'none' }}>
                                            <td style={{
                                                padding: '5px 8px',
                                                fontWeight: isBold ? '800' : '500',
                                                textTransform: 'uppercase',
                                                color: '#1e293b'
                                            }}>
                                                {row.name}
                                            </td>
                                            <td style={{ padding: '5px 8px', textAlign: design.findingAlign.toLowerCase() }}>
                                                <div style={{ 
                                                    display: 'inline-flex', 
                                                    alignItems: 'center', 
                                                    gap: '8px',
                                                    position: 'relative',
                                                    paddingLeft: abnormal ? '15px' : '0'
                                                }}>
                                                    {abnormal && (
                                                        <span style={{ 
                                                            position: 'absolute', 
                                                            left: '-2px',
                                                            fontWeight: '900', 
                                                            color: abnormal.color,
                                                            fontSize: '11px'
                                                        }}>
                                                            {abnormal.symbol}
                                                        </span>
                                                    )}
                                                    <span style={{ 
                                                        fontWeight: (abnormal || isBold) ? '800' : '500',
                                                        color: abnormal ? abnormal.color : '#1e293b'
                                                    }}>
                                                        {val !== '' ? val : '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '4px 8px', textAlign: design.unitAlign.toLowerCase(), color: '#000' }}>
                                                {def?.unit || ''}
                                            </td>
                                            <td style={{ padding: '4px 8px', textAlign: design.rangeAlign.toLowerCase(), color: '#000' }}>
                                                {rangeTxt || ''}
                                            </td>
                                        </tr>
                                        {showContentAfter && (
                                            <tr>
                                                <td colSpan="5" style={{
                                                    padding: '8px 14px',
                                                    background: '#fafafa',
                                                    borderBottom: '1px solid #eee',
                                                    fontSize: `${parseInt(design.fontSize) - 2}px`,
                                                    color: '#333',
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

                {/* ── FOOTER / DISCLAIMER ── */}
                {!isLetterPad && (config.showFooter1 || config.endOfReport) && (
                    <div style={{ 
                        marginTop: '30px', 
                        pageBreakInside: 'avoid',
                        breakInside: 'avoid'
                    }}>
                        {profile?.footerUrl && config.showFooter1 ? (
                            <div style={{ width: '100%' }}>
                                <img 
                                    src={profile.footerUrl} 
                                    alt="Footer Banner" 
                                    style={{ width: '100%', display: 'block', objectFit: 'contain' }} 
                                />
                            </div>
                        ) : (
                            config.endOfReport && (
                                <div style={{
                                    padding: '10px 40px 30px',
                                    textAlign: 'center',
                                    fontWeight: '900',
                                    fontSize: '11px',
                                    color: '#000'
                                }}>
                                    <div style={{ borderTop: '2px solid #000', marginBottom: '10px', margin: '0 40px' }}></div>
                                    --- End Of The Report ---
                                </div>
                            )
                        )}
                    </div>
                )}

                {/* Page Numbering */}
                {config.pageNumber && (
                    <div style={{ 
                        position: 'absolute', 
                        bottom: '15px', 
                        right: '40px', 
                        fontSize: '10px', 
                        color: '#64748b', 
                        fontWeight: '600' 
                    }}>
                        Page 1 of 1
                    </div>
                )}

            </div>
        </div>
    );
}
