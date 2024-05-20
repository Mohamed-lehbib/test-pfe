import { getSupabaseClient } from "@/utils/supabase/supabaseClient";
import { NextResponse } from "next/server";

export const revalidate = 0
export async function DELETE(
  request: Request,
  { params }: { params: { tableName: string; rowId: string } }
) {
  const { tableName, rowId } = params;

  try {
    // Get a resolved Supabase client instance
    const supabase = await getSupabaseClient();
    // Delete the row from the specified table using the unique identifier
    const { error } = await supabase.from(tableName).delete().eq("id", rowId);

    if (error) {
      console.error(
        `Error deleting row ${rowId} from table ${tableName}:`,
        error
      );
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Row deleted successfully",
    });
  } catch (error) {
    console.error(`Error occurred while deleting row ${rowId}:`, error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
