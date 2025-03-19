'use client'

import React, { FormEventHandler, useState } from 'react'
import Message from '@/app/models/message'
import { useAtom } from 'jotai'
import { messageBoardAtom, socketAtom, userNameAtom } from '../globalStates/atom'
// メッセージの入力と一覧を行うコンポーネント
export default function MessageList() {
  const [message, setMessage] = useState<string>('')
  // 各グローバル状態のAtomを用意
  const [messageBoard] = useAtom(messageBoardAtom)
  const [userName] = useAtom(userNameAtom)
  const [socket] = useAtom(socketAtom)

  // メッセージの送信
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    // 送信するメッセージを作成
    const sendMessage: Message = {
      id: crypto.randomUUID(), // UUIDを生成して各メッセージに固有のIDを付与
      room: 1,
      author: userName,
      body: message,
    }
    // サーバーにメッセージを送信
    socket.emit('message', sendMessage)
    //　メッセージ入力欄を空にする
    setMessage('')
  }

  return (
    <>
      <section>
        <form onSubmit={handleSubmit}>
          {/* メッセージ本文の入力欄 */}
          <input
            className="border border-gray-400 p-2"
            name="message"
            placeholder="enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoComplete="off"
          />
          {/* メッセージ送信ボタン */}
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Send
          </button>
        </form>
      </section>
      <section>
        <ul>
          {/* メッセージ一覧を表示 */}
          {messageBoard.map((message: Message) => (
            <li key={message.id}>
              {message.author}:{message.body}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
