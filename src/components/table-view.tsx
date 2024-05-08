"use client";
import { useState, useEffect } from "react";

interface TableViewProps {
  tableName: string;
}

const TableView = ({ tableName }: TableViewProps) => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch the table data whenever the table name changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/tables/${tableName}`);
        const result = await response.json();
        if (result.success) {
          setData(result.data);
          setColumns(Object.keys(result.data[0] || {})); // Extract column headers dynamically
        } else {
          setError(result.error || "An unknown error occurred.");
        }
      } catch (err) {
        console.error("Error fetching table data:", err);
        setError("An error occurred while fetching the data.");
      }
    };

    fetchData();
  }, [tableName]);

  // If an error occurred, display it
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Display data in a dynamic table format
  return (
    <div>
      <h2>Contents of {tableName} Table</h2>
      <table className="table-auto w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-2 border">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col} className="px-4 py-2 border">
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
