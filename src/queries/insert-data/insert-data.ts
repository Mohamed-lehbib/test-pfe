import { getSupabaseClient } from "@/utils/supabase/supabaseClient";

export const revalidate = 0
export default async function insertData(
  tableName: string,
  attributes: Record<string, any>
) {
  // Get a resolved Supabase client instance
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase.from(tableName).insert([attributes]);
  if (error) {
    console.error(`Error inserting into ${tableName}:`, error);
    return null;
  }
  return data;
}
