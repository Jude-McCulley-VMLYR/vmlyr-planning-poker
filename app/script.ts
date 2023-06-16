import { Types } from "ably/promises";
import * as Ably from "ably/promises";
import { io } from "socket.io-client";

(async () => {

    console.log("Oh hai! 🖤");

    const optionalClientId = "optionalClientId"; // When not provided in authUrl, a default will be used.
    const ably = new Ably.Realtime.Promise({ authUrl: `/api/ably-token-request?clientId=${optionalClientId}` });
    const channel = ably.channels.get("some-channel-name");

    await channel.subscribe((msg: Types.Message) => {
        console.log("Ably message received", msg);
        document.getElementById("response").innerHTML += "<br />" + JSON.stringify(msg);
    });

    channel.publish("hello-world-message", { message: "Hello world!" });
})();

export { };

const socket = io();
    
var messages = document.getElementById('messages');
var form = document.getElementById('form');
var voteForm = document.getElementById('vote-form');
var voteNumber = <HTMLInputElement>document.getElementById('vote-number');
var input = <HTMLInputElement>document.getElementById('input');
var username = <HTMLInputElement>document.getElementById('username');


form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', username.value + ": " + input.value);
    input.value = '';
  }
});

voteForm.addEventListener('submit', function(e) {
  e.preventDefault();
    socket.emit('chat message', username.value + " has voted");
    socket.emit('vote message', username.value + ": " + voteNumber.value);
});

function showVotes () {
  socket.emit('show votes', '');
}

socket.on('chat message', function(msg) {
  var item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('vote message', function(msg) {
  // add to vote array on the server
  console.log(username.value + ": " + voteNumber.value);
});

socket.on('show votes', function(msg) {
  var item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);      });
