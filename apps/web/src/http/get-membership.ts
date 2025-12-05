import { api } from './api-client'

export async function getMembership(slug: string) {
  const response = await api.get(`organization/${slug}/membership`).json<{
    membership: {
      id: string
      role: 'ADMIN' | 'MEMBER' | 'BILLING'
      userId: string
      organizationId: string
    }
  }>()

  return response
}
