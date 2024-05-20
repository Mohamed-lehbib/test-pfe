// app/api/upload-file/route.ts
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const revalidate =0;
// Create a route handler for the POST request
export async function POST(request: Request) {
  // Extract the content from the request body
  const { content } = await request.json();

  // Define the directory to save the file in (relative to the project root)
  const directory = path.join(process.cwd(), "src", "data");
  const filename = "supabase.d.ts"; // Always name it as "supabase.d.ts"
  const filePath = path.join(directory, filename);

  // Ensure the directory exists, or create it
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  // Write the file content to the specified path
  try {
    fs.writeFileSync(filePath, content, "utf8");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error writing file:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
