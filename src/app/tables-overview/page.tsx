// src/app/tables-overview/page.tsx
import fs from "fs";
import path from "path";
import { TableAttributes } from "@/utils/tableParser";
import TablesOverviewClient from "@/components/tables-overview-client";

// Helper function to read and parse the JSON files
async function loadTablesAndCredentials() {
  const dataDir = path.join(process.cwd(), "src", "data");
  const tablesPath = path.join(dataDir, "tablesData.json");
  const credentialsPath = path.join(dataDir, "supabaseCredentials.json");

  const tables: TableAttributes[] = JSON.parse(
    fs.readFileSync(tablesPath, "utf8")
  );
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));

  return { tables, credentials };
}

// Server component
export default async function TablesOverviewPage() {
  // Fetch data
  const { tables, credentials } = await loadTablesAndCredentials();

  // Pass data to the client component
  return <TablesOverviewClient tables={tables} credentials={credentials} />;
}
