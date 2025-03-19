'use client'

import { ChangeEventHandler, FormEventHandler, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAtom } from 'jotai'
import Message from '../models/message'
import { messageBoardAtom, socketAtom, userNameAtom } from '../globalStates/atom'
import { initializeSocket } from '@/config/socketClient'
import { SOCKET_CONFIG } from '@/config/socket'

export default function ConnectForm() {
  const [userName, setUserName] = useAtom(userNameAtom)
  const [, setMessageBoard] = useAtom(messageBoardAtom)
  const [, setSocket] = useAtom(socketAtom)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // フォームの送信
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    if (!userName.trim()) {
      setError('Please enter your name')
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Initialize the Socket.IO connection
      const socket = await initializeSocket()

      // Set up event listeners
      socket.on(SOCKET_CONFIG.EVENTS.MESSAGE, (newMessage: Message) => {
        // Update the message board with the new message
        setMessageBoard((messageBoard) => {
          // Remove duplicates (just in case)
          const uniqueMessages = Array.from(
            new Map(messageBoard.map((message) => [message.id, message])).values()
          )
          // Add the new message
          return [...uniqueMessages, newMessage]
        })
      })

      // Save the socket in global state
      setSocket(socket)

      // Navigate to the chat room
      router.push('/rooms')
    } catch (error) {
      console.error('Connection error:', error)
      setError('Failed to connect to chat server. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setUserName(event.target.value)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Join Chat</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              id="name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="name"
              placeholder="Enter your name"
              value={userName}
              onChange={handleChange}
              autoComplete="off"
              required
              disabled={isConnecting}
            />
          </div>
          <button
            type="submit"
            className={`w-full font-medium py-2 px-4 rounded-md transition duration-200 ${
              isConnecting
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect to Chat'}
          </button>
        </form>
      </div>
    </div>
  )
}
