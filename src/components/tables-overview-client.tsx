"use client";

import { useState } from "react";
import { Modal, Button, List, message } from "antd";
import { TableAttributes } from "@/utils/tableParser";
import DynamicForm from "./dynamique-form";
import TableView from "./table-view";

// Define the props for this client component
interface TablesOverviewClientProps {
  tables: TableAttributes[];
  credentials: { url: string; key: string };
}

// Client component that handles interactions and state
export default function TablesOverviewClient({
  tables,
  credentials,
}: TablesOverviewClientProps) {
  const [selectedTable, setSelectedTable] = useState<TableAttributes | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const handleSelectTable = (table: TableAttributes) => {
    setSelectedTable(table);
  };

  // Callback function to handle successful form submission
  const handleFormSuccess = () => {
    setIsModalVisible(false);
    message.success("New row has been added!");
    setShouldRefetch((prev) => !prev); // Trigger a refetch of the table data
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-1/5 bg-gray-100 p-4 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Tables</h2>
        <List
          dataSource={tables}
          renderItem={(table: TableAttributes) => (
            <List.Item
              onClick={() => handleSelectTable(table)}
              style={{
                cursor: "pointer",
                padding: "10px",
                borderRadius: "5px",
                background:
                  selectedTable?.tableName === table.tableName
                    ? "#e0f7fa"
                    : "white",
              }}
              className="hover:bg-blue-50 transition duration-150 ease-in-out"
            >
              {table.tableName}
            </List.Item>
          )}
        />
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          className="mt-4 w-full"
        >
          Add New Row
        </Button>
      </aside>

      {/* Main content */}
      <main className="w-4/5 p-8 flex flex-col items-center justify-center">
        {selectedTable ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              {selectedTable.tableName}
            </h2>
            <TableView
              tableName={selectedTable.tableName}
              refetchTrigger={shouldRefetch}
            />
          </>
        ) : (
          <p className="text-lg text-gray-600">Select a table to add rows</p>
        )}
      </main>

      {/* Modal for Adding Rows */}
      <Modal
        title={`Add Row to ${selectedTable?.tableName}`}
        visible={isModalVisible}
        footer={null} // Remove default OK and Cancel buttons
        onCancel={() => setIsModalVisible(false)}
      >
        {selectedTable && (
          <DynamicForm table={selectedTable} onSuccess={handleFormSuccess} />
        )}
      </Modal>
    </div>
  );
}
