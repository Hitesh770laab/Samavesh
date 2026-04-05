import { createClient } from '@libsql/client';
import fs from 'fs';

const client = createClient({ url: 'file:local.db' });
async function run() {
  try {
    const sql = fs.readFileSync('drizzle/0000_open_gamora.sql', 'utf8');
    // executeMultiple can run multiple statements separated by semicolons
    const statements = sql.split('--> statement-breakpoint').map(s => s.trim()).filter(s => s.length > 0);
    
    for (const stmt of statements) {
      await client.execute(stmt);
      console.log('Executed:', stmt.slice(0, 50) + '...');
    }
    console.log("Migration successful!");
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
