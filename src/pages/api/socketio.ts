import type { NextApiRequest, NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'
import type { Server as HTTPServer } from 'http'
import type { Socket as NetSocket } from 'net'

interface SocketIONextApiResponse extends NextApiResponse {
  socket: NetSocket & {
    server: HTTPServer & {
      io: SocketIOServer | undefined
    }
  }
}

const SocketHandler = (req: NextApiRequest, res: SocketIONextApiResponse) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
    res.end()
    return
  }

  console.log('Setting up socket.io server')

  // Create new Socket.IO instance
  const io = new SocketIOServer(res.socket.server, {
    path: '/api/socketio',
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  // Store the Socket.IO instance on the server object
  res.socket.server.io = io

  // Set up event handlers
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`)

    socket.on('message', (data) => {
      console.log('Received message:', data)
      io.emit('message', data)
    })

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`)
    })
  })

  console.log('Socket.io server started successfully')
  res.end()
}

export default SocketHandler
