var app = require('./server.js');

var port = process.env.port || 4568;

app.listen(port);

console.log('Server now listening on port ' + port);
