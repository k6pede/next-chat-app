'use client'
import { Suspense } from 'react'
import MessageList from '../components/MessageList'

export default function Rooms() {
  return (
    <Suspense fallback="Loading">
      <MessageList />
    </Suspense>
  )
}
