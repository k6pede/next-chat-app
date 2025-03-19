// Configuration for Socket.IO client and server
export const SOCKET_CONFIG = {
  // The base URL for the Socket.IO server
  SERVER_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000',

  // The path for Socket.IO on the server
  PATH: '/api/socketio',

  // Socket.IO event names
  EVENTS: {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    MESSAGE: 'message',
  },
}
