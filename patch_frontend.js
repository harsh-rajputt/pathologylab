const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.jsx')) results.push(file);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'client', 'src'));
const words = [
    'patients', 'patient', 'tests', 'test', 'references', 'reference',
    'items', 'item', 'wings', 'wing', 'units', 'unit',
    'departments', 'department', 'categories', 'category'
];

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let original = content;
    
    words.forEach(w => {
        const regex = new RegExp(`\\bdata\\.${w}\\b`, 'g');
        content = content.replace(regex, `data.data.${w}`);
    });

    if (content !== original) {
        console.log('Patched:', f);
        fs.writeFileSync(f, content, 'utf8');
    }
});
console.log('Done');
