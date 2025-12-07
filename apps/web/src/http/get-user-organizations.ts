import { Role } from '@saas/auth'
import { api } from './api-client'

// Tipagem baseada na resposta de apps/api/src/http/routes/orgs/get-organizations.ts
interface GetUserOrganizationsResponse {
  organizations: {
    id: string
    name: string
    slug: string
    avatarUrl: string | null
    role: Role
  }[]
}

export async function getUserOrganizations() {
  const result = await api
    .get('organizations', {
      next: {
        tags: ['organizations'], // Tags para revalidação
      },
    })
    .json<GetUserOrganizationsResponse>()

  return result
}