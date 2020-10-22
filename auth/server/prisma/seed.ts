import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  for (let name of ['Alice', 'Bob', 'Emily']) {
    await prisma.user.create({
      data: {
        name,
        email: `${name}@g.com`,
        password: 'password',
      },
    })
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
