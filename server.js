const http = require('http');
const startTime = new Date().toString()
console.log(startTime, 'server created')
http.createServer((req, res) => {
  res.writeHead(200);
  res.end(startTime);
}).listen(8000);
