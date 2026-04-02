import React, { useState, useEffect } from 'react';

export const OrderInput = ({ currentIndex, max, onReorder }) => {
    const [val, setVal] = useState(currentIndex + 1);

    useEffect(() => {
        setVal(currentIndex + 1);
    }, [currentIndex]);

    const handleBlur = () => {
        let num = parseInt(val);
        if (isNaN(num) || num < 1) num = 1;
        if (num > max) num = max;
        setVal(num);
        if (num - 1 !== currentIndex) {
            onReorder(currentIndex, num - 1);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
        }
    };

    return (
        <input 
            type="number"
            min="1"
            max={max}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-12 text-center text-sm font-bold border border-slate-300 rounded bg-slate-50 focus:ring-1 focus:ring-red-500 outline-none hover:bg-slate-100 py-0.5"
            title="Type Position and Press Enter or Click Away"
        />
    );
};
