import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()
  await prisma.project.deleteMany()
  await prisma.member.deleteMany()

  const passwordHash = await hash('123456', 1)

  const user = await prisma.user.create({
    data: {
      name: 'Vanessa Gomes',
      email: 'vanessa@acme.com',
      avatarUrl: 'https://github.com/vanessagomes-dev.png',
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

  // função utilitária para criar projetos corretamente
  async function createProjects(orgId: string) {
  const created = []

  for (let i = 0; i < 3; i++) {
    const owner = faker.helpers.arrayElement(users)

    const project = await prisma.project.create({
      data: {
        name: faker.lorem.words(5),
        slug: faker.lorem.slug(5),
        description: faker.lorem.paragraph(),
        avatarUrl: faker.image.avatarGitHub(),
        // conectar a organização existente
        organization: { connect: { id: orgId } },
        // conectar o owner existente
        owner: { connect: { id: owner.id } },
      },
    })

    created.push(project)
  }

  return created
}


  // ---------------------------
// ORG 1 – ADMIN
// ---------------------------

const orgAdmin = await prisma.organization.create({
  data: {
    name: 'Acme Inc (Admin)',
    domain: 'acme.com',
    slug: 'acme-admin',
    avatarUrl: faker.image.avatarGitHub(),
    shouldAttachUsersByDomain: true,

    // relação correta com o owner
    owner: {
      connect: { id: user.id },
    },
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


// ---------------------------
// ORG 2 – BILLING
// ---------------------------

const orgBilling = await prisma.organization.create({
  data: {
    name: 'Acme Inc (Billing)',
    slug: 'acme-billing',
    avatarUrl: faker.image.avatarGitHub(),

    owner: {
      connect: { id: user.id },
    },
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


// ---------------------------
// ORG 3 – MEMBER
// ---------------------------

const orgMember = await prisma.organization.create({
  data: {
    name: 'Acme Inc (Member)',
    slug: 'acme-member',
    avatarUrl: faker.image.avatarGitHub(),

    owner: {
      connect: { id: user.id },
    },
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

  console.log('Database seeded!')
}

seed()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
