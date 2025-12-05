import React from 'react'
import { auth } from '@/auth/auth'

export default async function AppLayout({
  children,
  teste,
}: Readonly<{
  children: React.ReactNode
  teste: React.ReactNode
}>) {
  await auth() // se não estiver autenticado, redireciona automaticamente

  return (
     <>
      {children}
      {teste}
    </>
  )
}