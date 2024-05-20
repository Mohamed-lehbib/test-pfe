// pages/api/store-data.ts
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const revalidate = 0;
export async function POST(request: Request) {
  const { url, key, tables } = await request.json();

  // Define the data storage directory and file paths
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const credentialsPath = path.join(dataDir, 'supabaseCredentials.json');
  const tablesPath = path.join(dataDir, 'tablesData.json');

  // Ensure the directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Save credentials and parsed tables to separate files
  fs.writeFileSync(credentialsPath, JSON.stringify({ url, key }, null, 2), 'utf8');
  fs.writeFileSync(tablesPath, JSON.stringify(tables, null, 2), 'utf8');

  return NextResponse.json({ success: true });
}
