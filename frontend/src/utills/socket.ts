import { io } from 'socket.io-client';
import { API_URL } from './constants';

export const socket = io(API_URL);
export let socketID = '';
socket.on('connect', () => {
    socketID = socket.id;
});
