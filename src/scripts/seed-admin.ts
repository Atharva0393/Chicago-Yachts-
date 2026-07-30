import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = "admin@chicagoyachts.com"
  
  // Check if admin already exists
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email }
  })
  
  if (existingAdmin) {
    console.log(`Admin user ${email} already exists.`)
    return
  }

  const passwordHash = await bcrypt.hash("admin123", 12)

  const admin = await prisma.adminUser.create({
    data: {
      firstName: "Super",
      lastName: "Admin",
      email: email,
      passwordHash: passwordHash,
      role: "SUPER_ADMIN"
    }
  })

  console.log(`Successfully created admin user: ${admin.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
