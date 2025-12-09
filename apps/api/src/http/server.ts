import 'dotenv/config'

import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { env } from '@saas/env'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from '@/http/error-handler.js'
import { authenticateWithGithub } from '@/http/routes/auth/authenticate-with-github.js'

import { authenticateWithPassword } from '@/http/routes/auth/authenticate-with-password.js'
import { getProfile } from '@/http/routes/auth/get-profile.js'
import { requestPasswordRecover } from '@/http/routes/auth/request-password-recover.js'
import { resetPassword } from '@/http/routes/auth/reset-password.js'
import { getOrganizationBilling } from '@/http/routes/billing/get-organization-billing.js'
import { createInvite } from '@/http/routes/invites/create-invite.js'
import { getInvite } from '@/http/routes/invites/get-invite.js'
import { getInvites } from './routes/invites/get-invites.js'
import { acceptInvite } from '@/http/routes/invites/accept-invite.js'
import { rejectInvite } from '@/http/routes/invites/reject-invite.js'
import { revokeInvite } from '@/http/routes/invites/revoke-invite.js'
import { getPendingInvites } from '@/http/routes/invites/get-pending-invites.js'

import { getMembers } from '@/http/routes/members/get-members.js'
import { updateMember } from '@/http/routes/members/update-member.js'
import { removeMember } from '@/http/routes/members/remove-member.js'

import { createOrganization } from '@/http/routes/orgs/create-organization.js'
import { getMembership } from '@/http/routes/orgs/get-membership.js'
import { getOrganization } from '@/http/routes/orgs/get-organization.js'
import { getOrganizations } from '@/http/routes/orgs/get-organizations.js'
import { shutdownOrganization } from '@/http/routes/orgs/shutdown-organization.js'
import { transferOrganization } from '@/http/routes/orgs/transfer-organization.js'
import { updateOrganization } from '@/http/routes/orgs/update-organization.js'
import { createProject } from '@/http/routes/projects/create-project.js'
import { deleteProject } from '@/http/routes/projects/delete-project.js'
import { getProject } from '@/http/routes/projects/get-project.js'
import { getProjects } from '@/http/routes/projects/get-projects.js'
import { updateProject } from '@/http/routes/projects/update-project.js'

import { createAccount } from './routes/auth/create-account.js'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description: 'Full-stack SaaS with multi-tenant & RBAC.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors)

app.register(createAccount)

app.register(authenticateWithPassword)
app.register(authenticateWithGithub)
app.register(getProfile)
app.register(requestPasswordRecover)
app.register(resetPassword)

app.register(createOrganization)
app.register(getMembership)
app.register(getOrganization)
app.register(getOrganizations)
app.register(updateOrganization)
app.register(shutdownOrganization)
app.register(transferOrganization)

app.register(createProject)
app.register(deleteProject)
app.register(getProject)
app.register(getProjects)
app.register(updateProject)

app.register(getMembers)
app.register(updateMember)
app.register(removeMember)

app.register(createInvite)
app.register(getInvite)
app.register(getInvites)
app.register(acceptInvite)
app.register(rejectInvite)
app.register(revokeInvite)
app.register(getPendingInvites)

app.register(getOrganizationBilling)

app.ready().then(() => {
  console.log(app.printRoutes());
});


app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log('HTTP server running!')
})