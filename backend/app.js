const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3000;

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: 'GET, PUT, PATCH, POST, DELETE',
    },
});

const rooms = [];

app.use(cors());

app.get('/rooms', (req, res) => {
    res.json(rooms);
});

io.on('connection', (socket) => {
    io.emit('rooms-list', rooms);
    socket.on('join-board', (boardId) => {
        let room = rooms.find((room) => room.name === boardId);
        if (!room) {
            room = { name: boardId, users: [], canvasState: '' };
            rooms.push(room);
        }

        socket.join(boardId);

        const usersInRoom = room.users;
        usersInRoom.push(socket.id);

        socket.emit('canvas-state-from-server', room.canvasState);

        socket.broadcast.to(boardId).emit('get-canvas-state');
    });

    socket.on('canvas-state', ({ state, boardId }) => {
        const room = rooms.find((room) => room.name === boardId);
        if (room) {
            room.canvasState = state;
            socket.broadcast
                .to(boardId)
                .emit('canvas-state-from-server', state);
        }
    });

    socket.on(
        'draw-line',
        ({ prevPoint, currentPoint, color, brushWidth, boardId }) => {
            io.to(boardId).emit('draw-line', {
                prevPoint,
                currentPoint,
                color,
                brushWidth,
            });
        }
    );

    socket.on('clear', (boardId) => {
        io.to(boardId).emit('clear');
        const room = rooms.find((room) => room.name === boardId);
        if (room) room.canvasState = '';
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
