import { env } from '@saas/env'
import ky from 'ky'
import { cookies as nextCookies } from 'next/headers'

export const api = ky.create({
prefixUrl: env.NEXT_PUBLIC_API_URL,
 hooks: {
 beforeRequest: [
 async (request) => {
 let token: string | undefined

// 1. Lógica para Server Component (SSR)
if (typeof window === 'undefined') {
//  Usamos o método nativo 'cookies()' do Next.js, que garante 
// a leitura do cookie recém-setado na Server Action.
const cookieStore = nextCookies()
 token = (await cookieStore).get('token')?.value
 } 
// 2. Lógica para Client Component (Browser)
 else {
  // Para o lado do cliente, lemos diretamente do documento (Padrão JS)
 token = document.cookie
 .split('; ')
.find((row) => row.startsWith('token='))
 ?.split('=')[1]
 }

if (token) {
request.headers.set('Authorization', `Bearer ${token}`)
}
 },
 ],
 },
})