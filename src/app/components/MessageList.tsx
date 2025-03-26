'use client'

import React, { FormEventHandler, useEffect, useState, useRef } from 'react'
import Message from '@/app/models/message'
import { useAtom } from 'jotai'
import { messageBoardAtom, socketAtom, testCountAtom, userNameAtom } from '../globalStates/atom'
import { useRouter } from 'next/navigation'
import { SOCKET_CONFIG } from '@/config/socket'

// メッセージの入力と一覧を行うコンポーネント
export default function MessageList() {
  const [message, setMessage] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 各グローバル状態のAtomを用意
  const [messageBoard] = useAtom(messageBoardAtom)
  const [userName] = useAtom(userNameAtom)
  const [socket] = useAtom(socketAtom)
  const [testCount] = useAtom(testCountAtom)
  const router = useRouter()

  // Reference to message list container for auto-scrolling
  const messageListRef = useRef<HTMLDivElement>(null)

  // Check if the user is authenticated (has a username and socket connection)
  useEffect(() => {
    if (!userName || !socket) {
      router.push('/')
    }
  }, [userName, socket, router])

  // Auto-scroll to the bottom of the message list when new messages arrive
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [messageBoard])

  // メッセージの送信
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    if (!message.trim() || !socket || !userName) return

    setIsSubmitting(true)

    // 送信するメッセージを作成
    const sendMessage: Message = {
      id: crypto.randomUUID(), // UUIDを生成して各メッセージに固有のIDを付与
      room: 1,
      author: userName,
      body: message,
    }

    // サーバーにメッセージを送信
    socket.emit(SOCKET_CONFIG.EVENTS.MESSAGE, sendMessage)

    // メッセージ入力欄を空にする
    setMessage('')
    setIsSubmitting(false)
  }

  // Format timestamp to display when hovering over messages
  const formatTime = () => {
    const now = new Date()
    return now.toLocaleTimeString()
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Next.js Chat Room</h1>
          <div className="flex items-center">
            <span className="mr-2">Logged in as:</span>
            <span className="font-medium bg-blue-700 py-1 px-3 rounded-full">{userName}</span>
          </div>
        </div>
      </header>

      {/* Message List */}
      <div ref={messageListRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messageBoard.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
            <br />
            {testCount} messages.
          </div>
        ) : (
          messageBoard.map((msg: Message) => (
            <div
              key={msg.id}
              className={`max-w-3/4 p-3 rounded-lg ${
                msg.author === userName
                  ? 'ml-auto bg-blue-500 text-white rounded-br-none'
                  : 'mr-auto bg-white text-gray-800 rounded-bl-none shadow-sm'
              }`}
              title={formatTime()}
            >
              <div className="font-bold text-sm mb-1">{msg.author}</div>
              <p>{msg.body}</p>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSubmit} className="container mx-auto flex gap-2">
          <input
            className="text-black flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!message.trim() || isSubmitting}
            className={`px-4 py-2 rounded-full font-medium ${
              !message.trim() || isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
