import PocketBase from "pocketbase";
import si from "systeminformation";
import WebSocket from "ws";

export const pbUrl = "http://127.0.0.1:8090"

export const pb = new PocketBase(pbUrl)

console.log('getting system information...');
const [hardware, cpu] = await Promise.all([
  si.system(), si.cpu()
])

console.log('logging in...');
await pb.collection('users').authWithPassword('node', 'AlertMouse668#')
let node

try {
  node = await pb.collection('nodes').getFirstListItem('serial = "' + hardware.serial + '"')
  console.log("found node record.");
} catch (error) {
  console.log(typeof (error));

  if (error.status == 404) {
    console.log("couldn't find node record, creating new node...");
    node = await pb.collection('nodes').create({
      serial: hardware.serial,
      model: hardware.model,
      manufacturer: hardware.manufacturer
    })
    console.log("new node created.");
  } else console.log(error);
}

let socket = new WebSocket('ws://localhost:8088')
socket.on('message', (message) => {
  let data = JSON.parse(message.toString());
    console.log(data);
})
await new Promise(resolve => socket.once('open', resolve));

socket.send(JSON.stringify({
  type: "worker-connect",
  serial: hardware.serial
}))

socket.send(JSON.stringify({
  type: "worker-update",
  from: hardware.serial,
  status: "Waiting"
}))

