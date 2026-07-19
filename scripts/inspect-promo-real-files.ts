const message = [
  'inspect-promo-real-files.ts ถูกปิดใช้งาน',
  'สคริปต์เดิมใช้ OCR crop และ grouping โดยไม่มี Product Master, ราคา หรือ Promotion Family',
  'ผลจากสคริปต์จึงไม่ตรงกับ Preview text-first ปัจจุบันและห้ามใช้เป็นเกณฑ์ผ่าน/ไม่ผ่าน',
  'ให้ทดสอบผ่าน promo-admin-new.html?dryrun=1 ด้วย PDF และ XLSM จริงในเบราว์เซอร์',
].join('\n');

console.error(message);
process.exitCode = 1;
