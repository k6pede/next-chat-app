'use client'

import { Suspense } from 'react'
import ConnectForm from './components/ConnectForm'

export default function Page() {
  return (
    <>
      <Suspense fallback="Loading...">
        <ConnectForm />
      </Suspense>
    </>
  )
}
