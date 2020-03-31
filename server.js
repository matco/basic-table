const PORT = 1337;

import http from 'http';
import finalhandler from 'finalhandler';
import serve_static from 'serve-static';

//launch HTTP server
const serve = serve_static('.');
const server = http.createServer((request, response) => {
	serve(request, response, finalhandler(request, response));
});
server.listen(PORT);
