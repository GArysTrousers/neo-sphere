
import { WebSocket, WebSocketServer } from "ws";

const wsPort = 8088

let wss = new WebSocketServer({
  port: wsPort
})

interface Client {
  type: "connecting" | "master" | "worker";
  serial: string;
  status: string;
}

let clients = new Map<WebSocket, Client>()

wss.on('connection', function (socket: WebSocket) {
  clients.set(socket, {
    type: "connecting",
    serial: "",
    status: ""
  });

  // When you receive a message, send that message to every socket.
  socket.on('message', function (data) {
    let message = JSON.parse(data.toString())

    if (message.type == "master-connect") {
      let client = clients.get(socket)
      if (client) {
        clients.set(socket, { ...client, type: "master" })
        console.log("a master connected");
        socket.send(Buffer.from(JSON.stringify({
          type: "workers-status",
          workers: [...clients.values()].filter((c) => c.type == 'worker').map((w) => ([w.serial, w.status]))
        })))
      }
    }

    else if (message.type == "worker-connect") {
      let client = clients.get(socket)
      if (client) {
        clients.set(socket, { ...client, type: "worker", serial: message.serial })
        console.log("a worker connected");
      }
    }

    else if (message.type == "worker-update") {
      let client = clients.get(socket)
      if (client) clients.set(socket, { ...client, status: message.status })
      clients.forEach((c, s) => {
        if (c.type == 'master') s.send(data)
      });
    }

  });

  // When a socket closes, or disconnects, remove it from the array.
  socket.on('close', function () {
    let client = clients.get(socket)
    if (client) {
      console.log("a " + client.type + " disconnected");
    }
    clients.delete(socket)
    
    clients.forEach((c, s) => {
      if (c.type == 'master') {
        s.send(Buffer.from(JSON.stringify({
          type: "workers-status",
          workers: [...clients.values()].filter((c) => c.type == 'worker').map((w) => ([w.serial, w.status]))
        })))
      }
    });
  });
});

console.log("Websocket server listening on " + wsPort);
