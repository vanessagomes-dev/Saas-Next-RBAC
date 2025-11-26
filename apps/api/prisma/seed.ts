import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  console.log('🔄 Resetando banco...')

  // Ordem correta respeitando constraints
  await prisma.member.deleteMany()
  await prisma.project.deleteMany()
  await prisma.invite.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.account.deleteMany()
  await prisma.token.deleteMany()
  await prisma.user.deleteMany()

  console.log('✨ Criando usuários...')

  const passwordHash = await hash('123456', 1)

  const user = await prisma.user.create({
    data: {
      name: 'Vanessa Gomes',
      email: 'vanessa@acme.com',
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  const anotherUser = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  const anotherUser2 = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  const users = [user, anotherUser, anotherUser2]

  console.log('📁 Função utilitária registrada...')

  async function createProjects(orgId: string) {
    const created: any[] = []

    for (let i = 0; i < 3; i++) {
      const owner = faker.helpers.arrayElement(users)

      const project = await prisma.project.create({
        data: {
          name: faker.commerce.productName(),
          slug: faker.string.alphanumeric(10).toLowerCase(),
          description: faker.lorem.sentence(),
          avatarUrl: faker.image.avatarGitHub(),
          organization: { connect: { id: orgId } },
          owner: { connect: { id: owner.id } },
        },
      })

      created.push(project)
    }

    return created
  }

  // ---------------------------------------------------------
  // ORG 1 – ADMIN
  // ---------------------------------------------------------
  console.log('🏢 Criando organização ADMIN...')

  const orgAdmin = await prisma.organization.create({
    data: {
      name: 'Acme Inc (Admin)',
      domain: 'acme.com',
      slug: 'acme-admin',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      owner: { connect: { id: user.id } },
    },
  })

  await createProjects(orgAdmin.id)

  await prisma.member.createMany({
    data: [
      { userId: user.id, organizationId: orgAdmin.id, role: 'ADMIN' },
      { userId: anotherUser.id, organizationId: orgAdmin.id, role: 'MEMBER' },
      { userId: anotherUser2.id, organizationId: orgAdmin.id, role: 'MEMBER' },
    ],
  })

  // ---------------------------------------------------------
  // ORG 2 – BILLING
  // ---------------------------------------------------------
  console.log('🏢 Criando organização BILLING...')

  const orgBilling = await prisma.organization.create({
    data: {
      name: 'Acme Inc (Billing)',
      slug: 'acme-billing-' + faker.string.alphanumeric(5),
      avatarUrl: faker.image.avatarGitHub(),
      owner: { connect: { id: user.id } },
    },
  })

  await createProjects(orgBilling.id)

  await prisma.member.createMany({
    data: [
      { userId: user.id, organizationId: orgBilling.id, role: 'BILLING' },
      { userId: anotherUser.id, organizationId: orgBilling.id, role: 'ADMIN' },
      { userId: anotherUser2.id, organizationId: orgBilling.id, role: 'MEMBER' },
    ],
  })

  // ---------------------------------------------------------
  // ORG 3 – MEMBER
  // ---------------------------------------------------------
  console.log('🏢 Criando organização MEMBER...')

  const orgMember = await prisma.organization.create({
    data: {
      name: 'Acme Inc (Member)',
      slug: 'acme-member-' + faker.string.alphanumeric(5),
      avatarUrl: faker.image.avatarGitHub(),
      owner: { connect: { id: user.id } },
    },
  })

  await createProjects(orgMember.id)

  await prisma.member.createMany({
    data: [
      { userId: user.id, organizationId: orgMember.id, role: 'MEMBER' },
      { userId: anotherUser.id, organizationId: orgMember.id, role: 'ADMIN' },
      { userId: anotherUser2.id, organizationId: orgMember.id, role: 'MEMBER' },
    ],
  })

  console.log('🌱 Banco populado com sucesso!')
}

seed()
  .catch((err) => {
    console.error('❌ Erro no seed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
