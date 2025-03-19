import { io, Socket } from 'socket.io-client'
import { SOCKET_CONFIG } from '../config/socket'

let socket: Socket | null = null

/**
 * Initializes the Socket.IO client connection
 * @returns A Promise that resolves to the Socket.IO client
 */
export const initializeSocket = async (): Promise<Socket> => {
  // If we already have a socket instance and it's connected, return it
  if (socket && socket.connected) {
    return socket
  }

  try {
    // First, we need to initialize the Socket.IO server on the API route
    await fetch(`${SOCKET_CONFIG.SERVER_URL}/api/socketio`, {
      method: 'POST',
    })

    // Now create the Socket.IO client
    socket = io(SOCKET_CONFIG.SERVER_URL, {
      path: SOCKET_CONFIG.PATH,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'],
    })

    // Return a Promise that resolves when the connection is established
    return new Promise((resolve, reject) => {
      if (!socket) {
        return reject(new Error('Failed to create socket instance'))
      }

      socket.on('connect', () => {
        console.log(`Socket connected with ID: ${socket?.id}`)
        resolve(socket as Socket)
      })

      socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err)
        reject(err)
      })

      socket.connect()
    })
  } catch (error) {
    console.error('Error initializing socket:', error)
    throw error
  }
}

/**
 * Gets the current Socket.IO instance or initializes a new one
 * @returns The Socket.IO client instance
 */
export const getSocket = async (): Promise<Socket> => {
  if (!socket || !socket.connected) {
    return initializeSocket()
  }
  return socket
}

/**
 * Disconnects the Socket.IO client
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
