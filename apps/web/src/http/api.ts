import { api } from './api-client'
import { getServerToken } from './get-server-token'
import { getClientToken } from './get-client-token'

export async function apiWithAuth() {
  const token =
    typeof window === 'undefined'
      ? await getServerToken()
      : getClientToken()

  return api.extend({
    hooks: {
      beforeRequest: [
        (request) => {
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`)
          }
        },
      ],
    },
  })
}
