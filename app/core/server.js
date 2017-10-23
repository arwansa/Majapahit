const restify = require("restify");
const server = restify.createServer({
    name: 'majapahit',
    version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

restify.CORS.ALLOW_HEADERS.push('x-access-token');

module.exports = server;
