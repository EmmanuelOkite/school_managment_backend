/**
 * One-off dev utility to create (or reset) an admin user, since there is no
 * account-creation API yet. Run with: npm run seed:admin
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from .env - never hardcode real
 * credentials in this file or pass them on the command line, where they'd
 * land in shell history.
 */
import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../src/user/entities/user.entity';
import { UserRole } from '../src/user/enums/user.enum';

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in your .env file.');
    process.exit(1);
  }

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'innovation2?',
    database: process.env.DB_NAME || 'school_db',
    entities: [User],
    synchronize: true,
  });

  await dataSource.initialize();
  const userRepo = dataSource.getRepository(User);

  const passwordHash = await bcrypt.hash(password, 10);
  let user = await userRepo.findOne({ where: { email } });

  if (user) {
    user.password = passwordHash;
    user.role = UserRole.ADMIN;
    user.isActive = true;
    await userRepo.save(user);
    console.log(`Updated existing user "${email}".`);
  } else {
    user = userRepo.create({ email, password: passwordHash, role: UserRole.ADMIN, isActive: true });
    await userRepo.save(user);
    console.log(`Created new admin user "${email}".`);
  }

  await dataSource.destroy();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
