import { Server } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';

let io: SocketServer;

export function initSocket(server: Server) {
  io = new SocketServer(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket: Socket) => {
    emitProgressUpdate('Client connected via WebSocket');
    console.log('Client connected via WebSocket');
    socket.on('disconnect', () => {
      emitProgressUpdate('Client disconnected from WebSocket');
      console.log('Client disconnected from WebSocket');
    });
  });
}

export function emitProgressUpdate(message: string) {
  io?.emit('progressUpdate', { message });
}