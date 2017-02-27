// Load the TCP Library
net = require('net');

// Keep track of the chat clients
var clients = [];

// Start a TCP Server
net.createServer(function (socket) {

  // Identify this client
  socket.name = socket.remoteAddress + ":" + socket.remotePort 

  // Put this new client in the list
  clients.push(socket);

  // Send a nice welcome message and announce
  // socket.write("Welcome " + socket.name + "\n");
  // broadcast(socket.name + " joined the chat\n", socket);

  // Handle incoming messages from clients.
  socket.on('data', function (data) {
    // broadcast(socket.name + "> " + data, socket);
    var raw = String(data);
    var input = raw.split('|');
    switch(input[0]){
      case 'login':
        broadcast('history|3|u0001|u0002|u0003|player_data|auction_data');
        break;
      case 'auction':
        broadcast('new_auction|a0001|u0001|fb0001|50M|emo1|60M');
        break;
      default:
        console.log('the input does not match any case');
        break;
    }
  });

  // Remove the client from the list when it leaves
  socket.on('close', function () {
    clients.splice(clients.indexOf(socket), 1);
    broadcast(socket.name + " left the chat.\n");
  });

  socket.on('error', function () {
  });
  
  // Send a message to all clients
  function broadcast(message, sender) {
    clients.forEach(function (client) {
      // Don't want to send it to sender
      //if (client === sender) return;
      client.write(message);
    });
    // Log it to the server output too
    process.stdout.write(message)
  }

}).listen(5000);

// Put a friendly message on the terminal of the server.
console.log("Chat server running at port 5000\n");