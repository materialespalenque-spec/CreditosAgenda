// Copia index.html a www/ y cambia Firebase del CDN a copias locales,
// para que la app abra aunque no haya internet.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), www = path.join(root, 'www'), lib = path.join(www, 'lib');
fs.mkdirSync(lib, { recursive: true });
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const m of ['app', 'auth', 'firestore']) {
  const f = `firebase-${m}-compat.js`;
  fs.copyFileSync(path.join(root, 'node_modules', 'firebase', f), path.join(lib, f));
  const re = new RegExp(`https://www\\.gstatic\\.com/firebasejs/[^/"]+/${f}`);
  if (!re.test(html)) throw new Error(`No encontré ${f} en index.html`);
  html = html.replace(re, `lib/${f}`);
}
fs.writeFileSync(path.join(www, 'index.html'), html);
console.log('www/ listo');
