import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';

const params = new URLSearchParams(window.location.search);
const apiKey = params.get('key') || localStorage.apiKey || '';

// const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:2020' : 'https://api.coding.garden';
const API_URL = 'https://api.coding.garden';

const socket = io(`${API_URL}?key=${apiKey}`, {
  upgrade: false,
  transports: ['websocket'],
});
const client = feathers();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
client.configure(socketio(socket), {
  timeout: 30_000,
});

export default client;
