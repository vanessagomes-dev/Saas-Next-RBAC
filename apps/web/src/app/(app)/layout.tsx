import { redirect } from 'next/navigation'
import { auth } from '@/auth/auth'
import React from 'react'

export default function AppLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode
   sheet: React.ReactNode
}>) {
  if (!auth()) {
    redirect('/auth/sign-in')
     }

  return (
    <>
      {children}
      {sheet}
    </>
  )
}