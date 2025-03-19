import type { NextApiRequest, NextApiResponse } from 'next'
import cors from 'cors'

import type { Socket as NetSocket } from 'net'
import type { Server as HttpServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

// 交差型の作成 : https://qiita.com/suema0331/items/a145909db0bcbcc3f949
// ioプロパティを持つオブジェクト型
// + serverプロパティを持つオブジェクト型
// + socketプロパティを持つオブジェクト型
// + NextApiResponse
type ResponseWebSocket = NextApiResponse & {
  socket: NetSocket & { server: HttpServer & { io?: SocketIOServer } }
}

const MESSAGE_CONNECTED = 'connection'
const MESSAGE_DISCONNECTED = 'disconnected'
const EVENT_MESSAGE = 'message'

const corsMiddleware = cors()

export default function SocketHandler(req: NextApiRequest, res: ResponseWebSocket) {
  console.log('リクエスト', req)

  if (req.method !== 'POST') return res.status(405).end()
  if (res.socket.server.io) return res.send('already set up')

  // Socket.IOのサーバを作成する
  const io = new SocketIOServer(res.socket.server, {
    addTrailingSlash: false,
  })

  // クライアントが接続してきたらコネクションを確立する
  io.on(MESSAGE_CONNECTED, (socket) => {
    const clientId = socket.id
    console.log(`A client connected. ID: ${clientId}`)

    // メッセージを受信したら、全クライアントに送信する
    socket.on(EVENT_MESSAGE, (data) => {
      io.emit(EVENT_MESSAGE, data)
      console.log('Received message:', data)
    })

    // クライアントが切断した場合の処理
    socket.on(MESSAGE_DISCONNECTED, () => {
      console.log('A client disconnected')
    })

    // CORS対策を有効にした上でサーバを設定する
    // 参考記事のSocket.ioバージョンでは必要だが、このバージョンではすでに不要。
    // 学習用なので残している
    corsMiddleware(req, res, () => {
      res.socket.server.io = io
      res.end()
    })
  })
}
