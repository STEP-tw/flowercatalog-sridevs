const handleRequests = require('./serverLib.js').handleRequests;
const http = require('http');
let portNumber = 2000;

// Create a server
http.createServer(handleRequests).listen(portNumber);
console.log('server is listening to portNumber ' + portNumber);
