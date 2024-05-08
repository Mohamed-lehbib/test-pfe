import { supabase } from "@/utils/supabase/supabaseClient";

export default async function insertData(tableName: string, attributes: Record<string, any>) {
    const { data, error } = await supabase.from(tableName).insert([attributes]);
    if (error) {
      console.error(`Error inserting into ${tableName}:`, error);
      return null;
    }
    return data;
  }
