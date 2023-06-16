import * as dotenv from "dotenv";
import * as Ably from "ably/promises";
import { HandlerEvent, HandlerContext } from "@netlify/functions";

dotenv.config();

export async function handler(event: HandlerEvent, context: HandlerContext) {

  if (!process.env.ABLY_API_KEY) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(`Missing ABLY_API_KEY environment variable.
        If you're running locally, please ensure you have a ./.env file with a value for ABLY_API_KEY=your-key.
        If you're running in Netlify, make sure you've configured env variable ABLY_API_KEY. 
        Please see README.md for more details on configuring your Ably API Key.`)
    }
  }

  const clientId = event.queryStringParameters["clientId"] || process.env.DEFAULT_CLIENT_ID || "NO_CLIENT_ID";
  const client = new Ably.Rest(process.env.ABLY_API_KEY);
  const tokenRequestData = await client.auth.createTokenRequest({ clientId: clientId });

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(tokenRequestData)
  };

}

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var votes = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
    socket.on('vote message', (msg) => {
      votes.push(msg);
      io.emit('vote message', msg);
    });
    socket.on('show votes', (msg) => {
      io.emit('show votes', votes);
      votes = [];
    });
});


// server.listen(3000, () => {
//   console.log('listening on *:3000');
// });

