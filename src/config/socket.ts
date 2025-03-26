export const SOCKET_CONFIG = {
  SERVER_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000',

  // client とserver側でパスを共通化
  PATH: '/api/socketio',

  // websocketのイベント定義
  EVENTS: {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    MESSAGE: 'message',
  },
}
