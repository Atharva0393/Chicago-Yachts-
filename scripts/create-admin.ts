import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function main() {
  console.log("=== Chicago Yachts Admin Bootstrap ===");
  
  const email = process.env.ADMIN_EMAIL || await question("Enter Admin Email: ");
  if (!email || !email.includes('@')) {
    console.error("Invalid email provided.");
    process.exit(1);
  }

  // Check if admin already exists
  const existingUser = await prisma.adminUser.findUnique({ where: { email } });
  if (existingUser) {
    console.error(`AdminUser with email ${email} already exists.`);
    process.exit(1);
  }

  const password = process.env.ADMIN_PASSWORD || await question("Enter Admin Password (min 12 chars): ");
  if (!password || password.length < 12) {
    console.error("Password must be at least 12 characters long.");
    process.exit(1);
  }

  const firstName = process.env.ADMIN_FIRST_NAME || await question("Enter First Name (default 'Admin'): ") || "Admin";
  const lastName = process.env.ADMIN_LAST_NAME || await question("Enter Last Name (default 'User'): ") || "User";

  console.log("Hashing password securely...");
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  console.log("Creating AdminUser in database...");
  const admin = await prisma.adminUser.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      role: "SUPER_ADMIN",
      isActive: true,
    }
  });

  console.log(`\nSuccess! AdminUser created with ID: ${admin.id}`);
  console.log(`You can now log in at /login with the email: ${admin.email}`);
  console.log(`NOTE: Keep your password secure. Do not share it or commit it.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    rl.close();
  });
