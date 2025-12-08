import { setCookie } from 'nookies'
import { api } from './api-client'

interface SignInWithPasswordRequest {
  email: string
  password: string
}

interface SignInWithPasswordResponse {
  token: string
}

export async function signInWithPassword({
  email,
  password,
}: SignInWithPasswordRequest) {
  const result = await api
    .post('sessions/password', {
      json: {
        email,
        password,
      },
    })
    .json<SignInWithPasswordResponse>()

    setCookie(null, 'token', result.token, {
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/',
 })

  return result
}