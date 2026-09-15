/**
 * One-off dev utility to create (or reset) an admin user, since there is no
 * account-creation API yet. Run with: npm run seed:admin -- <email> <password>
 * Both args are optional - defaults to admin@school.com with a random
 * generated password printed to the console.
 */
import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../src/user/entities/user.entity';
import { UserRole } from '../src/user/enums/user.enum';

async function main() {
  const email = process.argv[2] ?? 'admin@school.com';
  const generatedPassword = crypto.randomBytes(9).toString('base64url');
  const password = process.argv[3] ?? generatedPassword;

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

  if (!process.argv[3]) {
    console.log(`Generated password: ${password}`);
    console.log('Change it once account creation/password-change endpoints exist.');
  }

  await dataSource.destroy();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
