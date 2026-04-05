import { createClient } from '@libsql/client';

const client = createClient({ url: 'file:local.db' });
async function check() {
  try {
    const res = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log("Tables:", res.rows);
  } catch (e) {
    console.error("Error:", e);
  }
}
check();
