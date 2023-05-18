import { Server } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { debounce } from './debounce';

let io: SocketServer;

export function initSocket(server: Server) {
  io = new SocketServer(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('Client connected via WebSocket');
    emitProgressUpdate('Conexión establecida con Buswork REST API');

    socket.on('disconnect', () => {
      console.log('Client disconnected from WebSocket');
      emitProgressUpdate('Client disconnected from WebSocket');
    });
  });
}

const debouncedEmitProgressUpdate = debounce(emitProgressUpdate, 200);

export function emitProgressUpdate(message: string) {
  io?.emit('progressUpdate', { message });
}

export function emitDebouncedProgressUpdate(message: string) {
  debouncedEmitProgressUpdate(message);
}
