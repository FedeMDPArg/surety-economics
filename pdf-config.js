/**
 * md-to-pdf config — executive style matching the app's Nick-brand aesthetic.
 * Run: npx md-to-pdf DOCUMENTO_MAESTRO.md --config-file pdf-config.js
 */
module.exports = {
  pdf_options: {
    format: "A4",
    margin: {
      top: "20mm",
      right: "18mm",
      bottom: "20mm",
      left: "18mm",
    },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-size:8px; color:#94a3b8; width:100%; padding:0 18mm; display:flex; justify-content:space-between;">
        <span>Surety Bond Unit Economics Platform</span>
        <span>Documento Maestro · Federico Scarcella × Nick 60 Days</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-size:8px; color:#94a3b8; width:100%; padding:0 18mm; display:flex; justify-content:space-between;">
        <span>Cierre 15/04/2026</span>
        <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
      </div>
    `,
  },
  css: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

    :root {
      --amber: #f59e0b;
      --amber-dark: #d97706;
      --amber-light: #fbbf24;
      --emerald: #10b981;
      --emerald-light: #34d399;
      --rose: #f43f5e;
      --sky: #0ea5e9;
      --slate-900: #0f172a;
      --slate-800: #1e293b;
      --slate-700: #334155;
      --slate-600: #475569;
      --slate-500: #64748b;
      --slate-400: #94a3b8;
      --slate-300: #cbd5e1;
      --slate-200: #e2e8f0;
      --slate-100: #f1f5f9;
      --slate-50: #f8fafc;
    }

    * { box-sizing: border-box; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 10.5pt;
      line-height: 1.55;
      color: var(--slate-800);
      background: white;
      max-width: none;
      margin: 0;
      padding: 0;
    }

    /* Headings */
    h1 {
      font-size: 26pt;
      font-weight: 800;
      color: var(--slate-900);
      margin-top: 0;
      margin-bottom: 14pt;
      padding-bottom: 10pt;
      border-bottom: 3px solid var(--amber);
      letter-spacing: -0.02em;
      page-break-before: always;
      page-break-after: avoid;
    }
    h1:first-of-type {
      page-break-before: avoid;
    }

    h2 {
      font-size: 18pt;
      font-weight: 700;
      color: var(--slate-900);
      margin-top: 28pt;
      margin-bottom: 10pt;
      padding-left: 12pt;
      border-left: 4px solid var(--amber);
      letter-spacing: -0.015em;
      page-break-after: avoid;
    }

    h3 {
      font-size: 14pt;
      font-weight: 700;
      color: var(--slate-800);
      margin-top: 22pt;
      margin-bottom: 8pt;
      letter-spacing: -0.01em;
      page-break-after: avoid;
    }

    h4 {
      font-size: 11.5pt;
      font-weight: 600;
      color: var(--amber-dark);
      margin-top: 16pt;
      margin-bottom: 6pt;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      page-break-after: avoid;
    }

    /* Paragraphs */
    p {
      margin: 0 0 10pt 0;
      orphans: 3;
      widows: 3;
    }

    /* Lead paragraph after h1 */
    h1 + p, h1 + blockquote {
      font-size: 11.5pt;
      color: var(--slate-600);
    }

    /* Strong */
    strong {
      color: var(--slate-900);
      font-weight: 600;
    }

    em {
      color: var(--slate-600);
    }

    /* Links */
    a {
      color: var(--amber-dark);
      text-decoration: none;
      border-bottom: 1px solid rgba(217, 119, 6, 0.3);
    }

    /* Lists */
    ul, ol {
      margin: 0 0 12pt 0;
      padding-left: 22pt;
    }
    li {
      margin-bottom: 4pt;
    }
    ol li::marker {
      color: var(--amber);
      font-weight: 700;
    }
    ul li::marker {
      color: var(--amber);
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12pt 0;
      font-size: 9.5pt;
      page-break-inside: auto;
    }
    thead {
      background: var(--slate-900);
      color: white;
    }
    th {
      padding: 8pt 10pt;
      text-align: left;
      font-weight: 600;
      font-size: 9pt;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border: none;
    }
    td {
      padding: 7pt 10pt;
      border-bottom: 1px solid var(--slate-200);
      vertical-align: top;
    }
    tbody tr:nth-child(even) {
      background: var(--slate-50);
    }
    tbody tr:hover {
      background: rgba(245, 158, 11, 0.05);
    }
    /* Tables shouldn't break in the middle of a row */
    tr {
      page-break-inside: avoid;
    }

    /* Blockquotes */
    blockquote {
      margin: 14pt 0;
      padding: 12pt 16pt;
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.06), rgba(245, 158, 11, 0.02));
      border-left: 4px solid var(--amber);
      border-radius: 0 6px 6px 0;
      color: var(--slate-700);
      font-style: normal;
    }
    blockquote p {
      margin-bottom: 6pt;
    }
    blockquote p:last-child {
      margin-bottom: 0;
    }

    /* Code */
    code {
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      font-size: 9pt;
      background: var(--slate-100);
      color: var(--amber-dark);
      padding: 1pt 5pt;
      border-radius: 3px;
      border: 1px solid var(--slate-200);
    }

    pre {
      background: var(--slate-900);
      color: var(--slate-100);
      padding: 12pt 14pt;
      border-radius: 6px;
      overflow-x: auto;
      font-size: 9pt;
      line-height: 1.5;
      margin: 12pt 0;
      page-break-inside: avoid;
      border-left: 4px solid var(--amber);
    }
    pre code {
      background: transparent;
      color: inherit;
      padding: 0;
      border: none;
      font-size: 9pt;
    }

    /* Horizontal rule */
    hr {
      border: none;
      border-top: 1px solid var(--slate-200);
      margin: 22pt 0;
    }

    /* Images */
    img {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
      margin: 8pt 0;
    }

    /* Special emoji headings — make them pop */
    h1:has(em),
    h2:has(em) {
      /* keep as is */
    }

    /* First page (cover) styling */
    body > h1:first-child {
      font-size: 32pt;
      text-align: left;
      padding-bottom: 16pt;
      margin-bottom: 18pt;
    }

    /* Long URL wrap */
    a, code {
      word-break: break-word;
    }

    /* Print optimization */
    @media print {
      h1, h2, h3, h4 { page-break-after: avoid; }
      p, li, blockquote { orphans: 3; widows: 3; }
      pre, table, blockquote { page-break-inside: avoid; }
    }
  `,
};
