// app/api/tables/[tableName]/route.ts
import { supabase } from "@/utils/supabase/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { tableName: string } }) {
  const { tableName } = params;

  // Fetch the data from the specified table
  const { data, error } = await supabase.from(tableName).select("*");

  if (error) {
    console.error(`Error fetching data from table ${tableName}:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
