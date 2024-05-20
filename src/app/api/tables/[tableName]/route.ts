import { getSupabaseClient } from "@/utils/supabase/supabaseClient";
import { NextResponse } from "next/server";

export const revalidate = 0
export async function GET(request: Request, { params }: { params: { tableName: string } }) {
  const { tableName } = params;

  // Get a resolved Supabase client instance
  const supabase = await getSupabaseClient();

  // Fetch the data from the specified table
  const { data, error } = await supabase.from(tableName).select("*");

  if (error) {
    console.error(`Error fetching data from table ${tableName}:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

// import { NextResponse } from "next/server";
// import { getSupabaseClient } from "@/utils/supabase/supabaseClient";

// export async function GET(request: Request, { params }: { params: { tableName: string } }) {
//   const { tableName } = params;

//   // Get a resolved Supabase client instance
//   const supabase = await getSupabaseClient();

//   // Fetch data from the specified table
//   const { data, error } = await supabase.from(tableName).select("*");

//   if (error) {
//     console.error(`Error fetching data from table ${tableName}:`, error);
//     const response = NextResponse.json({ success: false, error: error.message }, { status: 500 });
//     response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
//     response.headers.set("Pragma", "no-cache");
//     response.headers.set("Expires", "0");
//     return response;
//   }

//   // Set cache control headers to prevent caching
//   const response = NextResponse.json({ success: true, data });
//   response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
//   response.headers.set("Pragma", "no-cache");
//   response.headers.set("Expires", "0");
//   return response;
// }
