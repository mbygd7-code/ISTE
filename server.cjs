const http = require('http');
const fs = require('fs');
const path = require('path');
const root = __dirname;
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
  '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const fp = path.join(root, p);
  fs.readFile(fp, (e, data) => {
    console.log(`${req.method} ${req.url} -> ${e ? 404 : 200}`);
    if (e) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'content-type': types[path.extname(fp)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(8765, '0.0.0.0', () => console.log('ExpoScan preview on http://127.0.0.1:8765'));
