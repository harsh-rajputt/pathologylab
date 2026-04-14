/**
 * OBFUSCATE.js
 * Run this via: node obfuscate.js
 * 
 * Reads all .js files from /src, obfuscates them,
 * and writes the scrambled output to /dist-obfuscated
 * ready for delivery to clients.
 */

import JavaScriptObfuscator from 'javascript-obfuscator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const INPUT_DIRS  = ['src', 'app.js', 'server.js'];
const OUTPUT_DIR  = path.join(__dirname, 'dist-obfuscated');

// Only CONTROLLERS contain sensitive business logic (license checks, etc.)
// Models and Routes use Mongoose/Express internals that break when obfuscated
const OBFUSCATE_ONLY_DIRS = ['src/controllers'];

function shouldObfuscate(filePath) {
    const rel = path.relative(__dirname, filePath).replace(/\\/g, '/');
    return OBFUSCATE_ONLY_DIRS.some(dir => rel.startsWith(dir));
}

// Obfuscation strength settings
const OBFUSCATION_OPTIONS = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,         // keep false for ES module compat
    selfDefending: true,          // code resists formatting/beautifying
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
    unicodeEscapeSequence: false
};

let filesProcessed = 0;

function obfuscateFile(inputPath, outputPath) {
    const code = fs.readFileSync(inputPath, 'utf8');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    if (!shouldObfuscate(inputPath)) {
        // Copy as-is (models, routes, utils — must not be obfuscated)
        fs.copyFileSync(inputPath, outputPath);
        filesProcessed++;
        console.log(`  [COPY] ${path.relative(__dirname, inputPath)}`);
        return;
    }

    try {
        const obfuscated = JavaScriptObfuscator.obfuscate(code, OBFUSCATION_OPTIONS);
        fs.writeFileSync(outputPath, obfuscated.getObfuscatedCode(), 'utf8');
        filesProcessed++;
        console.log(`  [OBFUSCATED] ${path.relative(__dirname, inputPath)}`);
    } catch (err) {
        console.warn(`  [WARN] Could not obfuscate ${path.basename(inputPath)}, copying as-is`);
        fs.copyFileSync(inputPath, outputPath);
    }
}

function walkDir(inputDir, outputDir) {
    if (!fs.existsSync(inputDir)) return;
    const entries = fs.readdirSync(inputDir, { withFileTypes: true });
    for (const entry of entries) {
        const inputPath  = path.join(inputDir, entry.name);
        const outputPath = path.join(outputDir, entry.name);
        if (entry.isDirectory()) {
            walkDir(inputPath, outputPath);
        } else if (entry.name.endsWith('.js')) {
            obfuscateFile(inputPath, outputPath);
        }
    }
}

// Clean and recreate output directory
if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

console.log('\n🔒 Obfuscating server source code...\n');

for (const item of INPUT_DIRS) {
    const inputPath = path.join(__dirname, item);
    if (item.endsWith('.js')) {
        // Root-level file
        obfuscateFile(inputPath, path.join(OUTPUT_DIR, item));
    } else {
        // Directory
        walkDir(inputPath, path.join(OUTPUT_DIR, item));
    }
}

// Copy package.json unchanged (it's just config, not source logic)
fs.copyFileSync(
    path.join(__dirname, 'package.json'),
    path.join(OUTPUT_DIR, 'package.json')
);

// Copy package-lock.json if present
const lockPath = path.join(__dirname, 'package-lock.json');
if (fs.existsSync(lockPath)) {
    fs.copyFileSync(lockPath, path.join(OUTPUT_DIR, 'package-lock.json'));
}

console.log(`\n✅ Done! ${filesProcessed} files obfuscated.`);
console.log(`📁 Output: ${OUTPUT_DIR}`);
console.log('\nWARNING: Do NOT commit dist-obfuscated/ to GitHub!\n');
