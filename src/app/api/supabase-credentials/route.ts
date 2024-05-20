import { NextResponse } from "next/server";
import path from 'path';
import fs from 'fs';

export async function GET(request: Request) {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  const credentialsPath = path.join(dataDir, 'supabaseCredentials.json');
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

  return NextResponse.json(credentials);
}
