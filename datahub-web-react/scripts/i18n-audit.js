#!/usr/bin/env node

/**
 * i18n Translation Audit Script
 *
 * Detects:
 * - Keys used in code but missing from en.json
 * - Unused keys in en.json
 * - Missing keys per non-EN locale
 * - Dynamic/unresolvable keys needing manual review
 * - Hardcoded strings in JSX
 * - Per-folder key usage breakdown
 *
 * Generates: i18n-audit-report.md
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================================
// CONFIGURATION
// ============================================================================

const SRC_DIR = path.join(__dirname, '../src/app');
const LOCALES_DIR = path.join(__dirname, '../src/i18n/locales');
const REPORT_FILE = path.join(__dirname, '../i18n-audit-report.md');

// Folders to exclude from key extraction (older/deprecated versions, if any)
// Newest versioned folder is always included; base folder is included too.
const EXCLUDE_DIRS = [];

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Recursively flatten a nested object to dot-notation keys
 */
function flattenKeys(obj, prefix = '') {
    const keys = [];
    for (const [k, v] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${k}` : k;
        if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
            keys.push(...flattenKeys(v, path));
        } else {
            keys.push(path);
        }
    }
    return keys;
}

/**
 * Read and parse a JSON file
 */
function loadJSON(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/**
 * Walk directory tree and collect all files matching extension
 */
function walkDir(dir, ext, excludeDirs = []) {
    const files = [];

    function walk(current) {
        if (excludeDirs.some(exclude => current.includes(exclude))) {
            return;
        }

        try {
            const entries = fs.readdirSync(current, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(current, entry.name);
                if (entry.isDirectory()) {
                    walk(fullPath);
                } else if (entry.isFile() && entry.name.endsWith(ext)) {
                    files.push(fullPath);
                }
            }
        } catch (err) {
            // Permission denied or other FS errors, skip
        }
    }

    walk(dir);
    return files;
}

/**
 * Extract t() calls from a source file using regex
 */
function extractTranslationKeys(content) {
    const keys = new Set();
    const dynamicKeys = [];

    // Standard t() calls: t('key'), t("key"), t(`key`)
    const standardPattern = /\bt\(\s*['"`]([a-zA-Z0-9._-]+)['"`]/g;
    let match;

    while ((match = standardPattern.exec(content)) !== null) {
        keys.add(match[1]);
    }

    // Dynamic keys with template literals: t(`...${variable}...`)
    const dynamicPattern = /\bt\(\s*`([^`]*)\$\{/g;
    while ((match = dynamicPattern.exec(content)) !== null) {
        const snippet = match[1].length > 50
            ? match[1].substring(0, 50) + '...'
            : match[1];
        dynamicKeys.push(snippet);
    }

    return { keys, dynamicKeys };
}

/**
 * Extract hardcoded strings from JSX
 */
function extractHardcodedStrings(filePath, content) {
    const results = [];
    const lines = content.split('\n');

    // Only check .tsx files
    if (!filePath.endsWith('.tsx')) {
        return results;
    }

    // JSX text content: >Word Word</
    const jsxTextPattern = />\s*([A-Z][a-zA-Z ]{3,}[a-zA-Z])\s*</g;

    // String props: title="...", label="...", etc.
    const propPattern = /(title|label|placeholder|aria-label|tooltip|description)=\{?"([A-Z][^"]{3,})"\}?/g;

    // For JSX text content
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let match;

        // Check JSX text content (only if line has JSX tag-like patterns)
        if (line.includes('>') && line.includes('<')) {
            jsxTextPattern.lastIndex = 0;
            while ((match = jsxTextPattern.exec(line)) !== null) {
                const text = match[1].trim();
                // Skip common false positives
                if (!text.match(/^[A-Z_0-9]+$/) && // not all caps (constants)
                    !text.match(/^\d+$/) &&       // not pure numbers
                    text.length > 3 &&
                    !text.includes('http')) {
                    results.push({
                        line: i + 1,
                        type: 'JSX text',
                        text: text
                    });
                }
            }
        }

        // Check string props
        propPattern.lastIndex = 0;
        while ((match = propPattern.exec(line)) !== null) {
            const text = match[2].trim();
            if (text.length > 3 && !text.includes('http')) {
                results.push({
                    line: i + 1,
                    type: `prop: ${match[1]}`,
                    text: text
                });
            }
        }
    }

    return results;
}

/**
 * Get top-level folder from a file path
 */
function getTopFolder(filePath) {
    const relative = path.relative(SRC_DIR, filePath);
    const parts = relative.split(path.sep);
    return parts[0] || 'root';
}

/**
 * Format size nicely
 */
function formatSize(bytes) {
    if (bytes > 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    if (bytes > 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return bytes + ' B';
}

// ============================================================================
// MAIN AUDIT
// ============================================================================

console.log('🔍 Scanning for translation keys in source files...');

// Walk source files
const sourceFiles = walkDir(SRC_DIR, '.ts', EXCLUDE_DIRS)
    .concat(walkDir(SRC_DIR, '.tsx', EXCLUDE_DIRS))
    .filter(f => !f.includes('__tests__') && !f.includes('.test.'));

// Extract keys from all files
const codeKeys = new Map();  // key -> array of file paths
const dynamicKeysMap = new Map();  // filePath -> array of dynamic key snippets
const hardcodedMap = new Map();  // filePath -> array of hardcoded findings
const folderStats = new Map();  // folder -> { files, keys, dynamicKeys }

for (const file of sourceFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const { keys, dynamicKeys } = extractTranslationKeys(content);
    const hardcoded = extractHardcodedStrings(file, content);

    const folder = getTopFolder(file);
    if (!folderStats.has(folder)) {
        folderStats.set(folder, { files: 0, keys: new Set(), dynamicKeys: 0 });
    }

    const stats = folderStats.get(folder);
    stats.files++;
    stats.dynamicKeys += dynamicKeys.length;

    // Add to codeKeys map
    for (const key of keys) {
        stats.keys.add(key);
        if (!codeKeys.has(key)) {
            codeKeys.set(key, []);
        }
        codeKeys.get(key).push(file);
    }

    // Track dynamic keys
    if (dynamicKeys.length > 0) {
        dynamicKeysMap.set(file, dynamicKeys);
    }

    // Track hardcoded strings
    if (hardcoded.length > 0) {
        hardcodedMap.set(file, hardcoded);
    }
}

console.log(`✓ Found ${codeKeys.size} unique translation keys used in ${sourceFiles.length} files`);

// Load locale files
console.log('\n📚 Loading locale files...');
const locales = {
    en: flattenKeys(loadJSON(path.join(LOCALES_DIR, 'en.json'))),
    de: flattenKeys(loadJSON(path.join(LOCALES_DIR, 'de.json'))),
    es: flattenKeys(loadJSON(path.join(LOCALES_DIR, 'es.json'))),
    fr: flattenKeys(loadJSON(path.join(LOCALES_DIR, 'fr.json'))),
    'pt-br': flattenKeys(loadJSON(path.join(LOCALES_DIR, 'pt-br.json')))
};

const localeNames = Object.keys(locales);
console.log(`✓ Loaded locale files: ${localeNames.join(', ')}`);

// Convert to sets for analysis
const localeSets = {};
for (const [locale, keys] of Object.entries(locales)) {
    localeSets[locale] = new Set(keys);
}

// ============================================================================
// ANALYSIS
// ============================================================================

console.log('\n🔎 Analyzing coverage...');

const analysis = {
    codeKeysSet: new Set(codeKeys.keys()),
    enKeysSet: localeSets.en,

    missingFromEn: null,  // codeKeys - enKeys
    unusedInEn: null,     // enKeys - codeKeys
    missingPerLocale: {},  // per locale: enKeys - localeKeys
    extraPerLocale: {},    // per locale: localeKeys - enKeys
    coverage: {}            // per locale: (enKeys ∩ localeKeys) / enKeys
};

// Missing from en.json
analysis.missingFromEn = Array.from(analysis.codeKeysSet)
    .filter(k => !analysis.enKeysSet.has(k))
    .sort();

// Unused in en.json
analysis.unusedInEn = Array.from(analysis.enKeysSet)
    .filter(k => !analysis.codeKeysSet.has(k))
    .sort();

// Per-locale analysis
for (const locale of localeNames) {
    if (locale === 'en') continue;

    const localeSet = localeSets[locale];
    const missing = Array.from(analysis.enKeysSet)
        .filter(k => !localeSet.has(k))
        .sort();
    const extra = Array.from(localeSet)
        .filter(k => !analysis.enKeysSet.has(k))
        .sort();
    const coverage = Math.round((localeSet.size / analysis.enKeysSet.size) * 100);

    analysis.missingPerLocale[locale] = missing;
    analysis.extraPerLocale[locale] = extra;
    analysis.coverage[locale] = coverage;
}

// ============================================================================
// REPORT GENERATION
// ============================================================================

console.log('\n📝 Generating report...');

let report = '# i18n Translation Audit Report\n\n';
report += `Generated: ${new Date().toISOString()}\n\n`;

// Summary table
report += '## Summary\n\n';
report += '| Locale | Total Keys | Keys Present | Coverage |\n';
report += '|--------|------------|--------------|----------|\n';

const enSize = analysis.enKeysSet.size;
report += `| **EN (source)** | **${enSize}** | **${enSize}** | **100%** |\n`;

for (const locale of localeNames) {
    if (locale === 'en') continue;
    const coverage = analysis.coverage[locale];
    const presented = analysis.enKeysSet.size - analysis.missingPerLocale[locale].length;
    report += `| ${locale.toUpperCase()} | ${enSize} | ${presented} | ${coverage}% |\n`;
}

report += '\n';

// Missing from en.json
report += '## Keys Used in Code but Missing from en.json\n\n';
if (analysis.missingFromEn.length === 0) {
    report += '✅ All keys used in code are present in en.json\n\n';
} else {
    report += `⚠️ **${analysis.missingFromEn.length} keys** are used in code but not in en.json:\n\n`;
    for (const key of analysis.missingFromEn) {
        const files = codeKeys.get(key);
        report += `- \`${key}\` (${files.length} file${files.length > 1 ? 's' : ''})\n`;
        files.forEach(f => {
            report += `  - ${path.relative(SRC_DIR, f)}\n`;
        });
    }
    report += '\n';
}

// Unused keys in en.json
report += '## Unused Keys in en.json\n\n';
if (analysis.unusedInEn.length === 0) {
    report += '✅ All keys in en.json are used in code\n\n';
} else {
    report += `⚠️ **${analysis.unusedInEn.length} keys** are in en.json but not used in code:\n\n`;

    // Group by top-level namespace
    const grouped = {};
    for (const key of analysis.unusedInEn) {
        const namespace = key.split('.')[0];
        if (!grouped[namespace]) {
            grouped[namespace] = [];
        }
        grouped[namespace].push(key);
    }

    for (const [namespace, keys] of Object.entries(grouped).sort()) {
        report += `### ${namespace}\n\n`;
        keys.forEach(k => {
            report += `- \`${k}\`\n`;
        });
        report += '\n';
    }
}

// Missing per locale
report += '## Missing Keys Per Non-EN Locale\n\n';
let anyMissing = false;
for (const locale of localeNames) {
    if (locale === 'en') continue;
    if (analysis.missingPerLocale[locale].length === 0) {
        report += `### ${locale.toUpperCase()}\n\n✅ Complete\n\n`;
    } else {
        anyMissing = true;
        report += `### ${locale.toUpperCase()}\n\n⚠️ **${analysis.missingPerLocale[locale].length} keys missing**:\n\n`;
        analysis.missingPerLocale[locale].forEach(k => {
            report += `- \`${k}\`\n`;
        });
        report += '\n';
    }
}

if (!anyMissing) {
    report = report.replace('## Missing Keys Per Non-EN Locale\n\n', '## Missing Keys Per Non-EN Locale\n\n✅ All non-EN locales are complete\n\n');
}

// Dynamic/unresolvable keys
report += '## Dynamic/Unresolvable Keys (Manual Review Needed)\n\n';
if (dynamicKeysMap.size === 0) {
    report += '✅ No dynamic keys detected\n\n';
} else {
    report += `⚠️ **${dynamicKeysMap.size} files** contain dynamic translation keys:\n\n`;
    for (const [file, snippets] of Array.from(dynamicKeysMap.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
        report += `- ${path.relative(SRC_DIR, file)}\n`;
        snippets.forEach(snippet => {
            report += `  - `` t(\`${snippet}...\`) ``\n`;
        });
    }
    report += '\n';
}

// Hardcoded strings
report += '## Hardcoded Strings in JSX\n\n';
if (hardcodedMap.size === 0) {
    report += '✅ No obvious hardcoded strings detected\n\n';
} else {
    report += `⚠️ **${hardcodedMap.size} files** contain potential hardcoded strings:\n\n`;
    for (const [file, findings] of Array.from(hardcodedMap.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
        report += `### ${path.relative(SRC_DIR, file)}\n\n`;
        findings.forEach(f => {
            report += `- Line ${f.line}: \`${f.type}\` — "${f.text}"\n`;
        });
        report += '\n';
    }
}

// Folder breakdown
report += '## Per-Folder Key Usage Breakdown\n\n';
report += '| Folder | Files | Keys | Dynamic Keys |\n';
report += '|--------|-------|------|---------------|\n';

const sortedFolders = Array.from(folderStats.entries()).sort((a, b) => a[0].localeCompare(b[0]));
for (const [folder, stats] of sortedFolders) {
    report += `| ${folder} | ${stats.files} | ${stats.keys.size} | ${stats.dynamicKeys} |\n`;
}
report += '\n';

// Locale file sizes
report += '## Locale File Sizes\n\n';
for (const locale of localeNames) {
    const filePath = path.join(LOCALES_DIR, locale === 'pt-br' ? 'pt-br.json' : `${locale}.json`);
    const size = fs.statSync(filePath).size;
    report += `- **${locale.toUpperCase()}**: ${formatSize(size)} (${locales[locale].length} keys)\n`;
}
report += '\n';

// ============================================================================
// WRITE REPORT
// ============================================================================

fs.writeFileSync(REPORT_FILE, report);
console.log(`✓ Report written to ${REPORT_FILE}`);

// ============================================================================
// PRINT SUMMARY
// ============================================================================

console.log('\n' + '='.repeat(70));
console.log('AUDIT SUMMARY');
console.log('='.repeat(70));
console.log(`\n📊 Coverage:`);
console.log(`   EN (source):    ${analysis.enKeysSet.size} keys`);
for (const locale of localeNames) {
    if (locale === 'en') continue;
    console.log(`   ${locale.toUpperCase()}:             ${analysis.coverage[locale]}% (${analysis.enKeysSet.size - analysis.missingPerLocale[locale].length}/${enSize})`);
}

console.log(`\n⚠️  Issues:`);
console.log(`   Missing from en.json:    ${analysis.missingFromEn.length}`);
console.log(`   Unused in en.json:       ${analysis.unusedInEn.length}`);
console.log(`   Dynamic keys:            ${dynamicKeysMap.size} files`);
console.log(`   Hardcoded strings:       ${hardcodedMap.size} files`);

console.log(`\n📁 Source files scanned:    ${sourceFiles.length}`);
console.log(`   Top-level folders:       ${folderStats.size}`);
console.log(`\n✅ Report saved to: ${path.relative(process.cwd(), REPORT_FILE)}\n`);
