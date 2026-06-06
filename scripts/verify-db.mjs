#!/usr/bin/env node
/**
 * Run after completing the Supabase setup:
 *   node scripts/verify-db.mjs
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  console.error("Run: source .env.local && node scripts/verify-db.mjs");
  process.exit(1);
}

const supabase = createClient(url, key);

console.log("Testing Supabase connection...\n");

const tables = ["wardrobe_items", "outfits", "shopping_suggestions"];
let allOk = true;

for (const table of tables) {
  const { error } = await supabase.from(table).select("count").limit(0);
  if (error) {
    if (error.message.includes("Host not in allowlist")) {
      console.error(`❌ Host not in allowlist — go to:\n   https://supabase.com/dashboard/project/fpynewrwgxtkokfjljnd/settings/api\n   and clear or update the Allowed Origins list.\n`);
      allOk = false;
      break;
    } else if (error.message.includes("does not exist")) {
      console.error(`❌ Table '${table}' missing — run the SQL migration in:\n   https://supabase.com/dashboard/project/fpynewrwgxtkokfjljnd/sql/new\n`);
      allOk = false;
    } else {
      console.error(`❌ ${table}: ${error.message}`);
      allOk = false;
    }
  } else {
    console.log(`✅ ${table} — OK`);
  }
}

if (allOk) {
  console.log("\n✅ Supabase is fully configured. Run: npm run dev");
} else {
  console.log("\nFix the issues above, then re-run this script.");
}
