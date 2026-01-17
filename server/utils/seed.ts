import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import { pool } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the json-server db.json file
const dbJsonPath = path.join(__dirname, '../../api/db.json');
const dbJson = JSON.parse(fs.readFileSync(dbJsonPath, 'utf-8'));

interface Project {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  contractTypeId: number;
  contractSignedOn: string;
  budget: number;
  isActive: boolean;
  status: string;
  order?: number;
}

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create default user (if not exists)
    const email = 'demo@keeptrack.dev';
    const password = 'password123';
    const name = 'Demo User';
    const role = 'admin';

    // Check if user exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    let userId: number;

    if (existingUser.rows.length === 0) {
      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      const userResult = await client.query(
        'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id',
        [email, passwordHash, name, role]
      );
      userId = userResult.rows[0].id;
      console.log(`✅ Created demo user: ${email} / ${password}`);
    } else {
      userId = existingUser.rows[0].id;
      console.log(`ℹ️  Demo user already exists: ${email}`);
    }

    // Check if projects already exist for this user
    const existingProjects = await client.query(
      'SELECT COUNT(*) FROM projects WHERE user_id = $1',
      [userId]
    );

    if (parseInt(existingProjects.rows[0].count) > 0) {
      console.log(`ℹ️  Projects already seeded for user ${userId}. Skipping project seeding.`);
      console.log('   (To re-seed, truncate the projects table first)');
    } else {
      // Insert projects
      let insertedCount = 0;
      let skippedCount = 0;

      for (const project of dbJson.projects as Project[]) {
        // Handle missing order field
        const orderValue = project.order ?? 0;

        await client.query(
          `INSERT INTO projects (user_id, name, description, image_url, contract_type_id, contract_signed_on, budget, is_active, status, "order")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            userId,
            project.name,
            project.description || null,
            project.imageUrl || null,
            project.contractTypeId || null,
            project.contractSignedOn || null,
            project.budget || 0,
            project.isActive ?? true,
            project.status || 'backlog',
            orderValue,
          ]
        );
        insertedCount++;
      }

      console.log(`✅ Inserted ${insertedCount} projects`);
      console.log(`   Skipped ${skippedCount} projects`);
    }

    await client.query('COMMIT');
    console.log('\n✅ Seed completed successfully!');
    console.log(`\nDemo credentials:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(console.error);
