// NDev 2019
const WebSocket = require('ws');
const PORT = process.env.PORT || 8080;
const net = require('net');
const ValidHostnameRegex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
const wss = new WebSocket.Server({ port: PORT });

function checkInput(ws, host, port) {
	if(!ValidHostnameRegex.test(host)) return false;
	if (!Number.isInteger(port) || port < 1 || port > 65535) return false;
	return true;
}

function connect(ws, host, port) {
	let client = net.connect(port, host);
	client.setEncoding('utf8');
	client.on('data', function(data) {
		ws.send(data);
	});
    client.on('timeout', function(e) {
		ws.send("timeout");
		ws.close();
        client.end();
    });       
    client.on('close', function(e) {
		ws.send("closed");
		ws.close();
    });
	client.on('error', function(e) {
		ws.send("error");
		ws.close();
    });
	return client;
}

wss.on('connection', function connection(ws) {
	var client;
    ws.on('message', function incoming(message) {
      if(!message) return;
      if(!addr) {
        var addr = message.split(":");
        if(addr.length > 2) return ws.close();
        var host = addr[0];
        var port = (addr.length === 2) ? port = addr[1] : 23;
	if(checkInput(ws, host, port)) {
	  client = connect(ws, host, port);
	} else {
	  ws.send("BadInput");
	  ws.close();
	}
    } else {
	client.write(chunk);
    }
  });
});
