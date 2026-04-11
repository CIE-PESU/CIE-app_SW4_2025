import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const files = [
  "CIE PAML Workshop Feedback (1st class) - Jan 2026 semester (Responses).xlsx",
  "CIE PAML Workshop Feedback_2nd class_4th Feb 2026.xlsx",
  "CIE PAML Workshop Feedback (3rd class - 11th Feb 2026) (Responses).xlsx",
  "CIE PAML Workshop Feedback (5th class - 11th March 2026) (Responses).xlsx",
  "CIE PAML Workshop Feedback (6th class - 25th March 2026) (Responses).xlsx",
];

const downloadsDir = "C:\\Users\\Lenovo\\Downloads";

for (const file of files) {
  const fullPath = path.join(downloadsDir, file);
  console.log(`\n=== ${file} ===`);
  try {
    const wb = XLSX.readFile(fullPath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
    console.log('Headers:', JSON.stringify(rows[0]));
    console.log('Sample row 2:', JSON.stringify(rows[1]));
    console.log('Total rows (incl header):', rows.length);
  } catch (e) {
    console.error('Error reading file:', e.message);
  }
}
