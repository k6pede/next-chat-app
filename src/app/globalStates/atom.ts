import { atom } from 'jotai'
import { Socket } from 'socket.io-client'
import Message from '../models/message'

// グローバルな状態を管理するためのatomを定義

// State: WebSocketコネクション
export const socketAtom = atom(null as unknown as Socket)

// State: メッセージ一覧
export const messageBoardAtom = atom<Array<Message>>([])

// State: ユーザー名
export const userNameAtom = atom('')
