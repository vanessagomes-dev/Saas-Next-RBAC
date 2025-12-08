import { compare } from 'bcryptjs'
import type { FastifyInstance, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { BadRequestError } from '@/http/routes/_errors/bad-request-error.js'
import { prisma } from '@/lib/prisma.js'

export async function authenticateWithPassword(app: FastifyInstance) {
 app.withTypeProvider<ZodTypeProvider>().post(
'/sessions/password',
 {
 schema: {
 tags: ['Auth'],
 summary: 'Authenticate with e-mail & password',
body: z.object({
email: z.string().email(),
 password: z.string(),
}),
 response: {
201: z.object({
 token: z.string(),
 }),
},
},
},
 async (
request: FastifyRequest<{
Body: { email: string; password: string }
 }>,
 reply,
 ) => {
 const { email, password } = request.body

 // 1. Buscar usuário no DB
 const userFromEmail = await prisma.user.findUnique({
 where: { email },
 })

if (!userFromEmail) {
// Credenciais inválidas (para segurança, não diga que o e-mail não existe)
throw new BadRequestError('Invalid credentials.')
 }

 if (userFromEmail.passwordHash === null) {
 throw new BadRequestError(
'User does not have a password, use social login.',
)
}

// 2. Comparar a senha (operação INTENSIVA)
const isPasswordValid = await compare(password, userFromEmail.passwordHash)

if (!isPasswordValid) {
 throw new BadRequestError('Invalid credentials.')
}

 // 3. Gerar o token JWT real
 const token = await reply.jwtSign(
 { sub: userFromEmail.id }, // O 'sub' (subject) identifica o usuário
 { sign: { expiresIn: '7d' } }, // Token válido por 7 dias
 )

 return reply.status(201).send({ token })
 },
)
}