// "use client";
// import { useState, useEffect } from "react";

// interface TableViewProps {
//   tableName: string;
// }

// const TableView = ({ tableName }: TableViewProps) => {
//   const [data, setData] = useState<any[]>([]);
//   const [columns, setColumns] = useState<string[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch the table data whenever the table name changes
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`/api/tables/${tableName}`);
//         const result = await response.json();
//         if (result.success) {
//           setData(result.data);
//           setColumns(Object.keys(result.data[0] || {})); // Extract column headers dynamically
//         } else {
//           setError(result.error || "An unknown error occurred.");
//         }
//       } catch (err) {
//         console.error("Error fetching table data:", err);
//         setError("An error occurred while fetching the data.");
//       }
//     };

//     fetchData();
//   }, [tableName]);

//   // If an error occurred, display it
//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   // Display data in a dynamic table format
//   return (
//     <div>
//       <h2>Contents of {tableName} Table</h2>
//       <table className="table-auto w-full">
//         <thead>
//           <tr>
//             {columns.map((column) => (
//               <th key={column} className="px-4 py-2 border">
//                 {column}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {columns.map((col) => (
//                 <td key={col} className="px-4 py-2 border">
//                   {row[col]}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TableView;

// -----------------------------------------------------------------------------------

// // src/components/table-view.tsx
// "use client";
// import { useState, useEffect } from "react";

// interface TableViewProps {
//   tableName: string;
//   refetchTrigger?: boolean; // Optional prop to signal refetching
// }

// const TableView = ({ tableName, refetchTrigger }: TableViewProps) => {
//   const [data, setData] = useState<any[]>([]);
//   const [columns, setColumns] = useState<string[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch the table data whenever the table name or refetchTrigger changes
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`/api/tables/${tableName}`);
//         const result = await response.json();
//         if (result.success) {
//           setData(result.data);
//           setColumns(Object.keys(result.data[0] || {})); // Extract column headers dynamically
//         } else {
//           setError(result.error || "An unknown error occurred.");
//         }
//       } catch (err) {
//         console.error("Error fetching table data:", err);
//         setError("An error occurred while fetching the data.");
//       }
//     };

//     fetchData();
//   }, [tableName, refetchTrigger]); // Listen for both the table name and refetch trigger changes

//   // If an error occurred, display it
//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   // Display data in a dynamic table format
//   return (
//     <div>
//       <h2>Contents of {tableName} Table</h2>
//       <table className="table-auto w-full">
//         <thead>
//           <tr>
//             {columns.map((column) => (
//               <th key={column} className="px-4 py-2 border">
//                 {column}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {columns.map((col) => (
//                 <td key={col} className="px-4 py-2 border">
//                   {row[col]}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TableView;

"use client";
import { useState, useEffect } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { message } from "antd";

interface TableViewProps {
  tableName: string;
  refetchTrigger?: boolean; // Optional prop to signal refetching
}

const TableView = ({ tableName, refetchTrigger }: TableViewProps) => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch the table data whenever the table name or refetchTrigger changes
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
  }, [tableName, refetchTrigger]); // Listen for both the table name and refetch trigger changes

  // Delete a specific row
  const handleDelete = async (rowIndex: number) => {
    try {
      const rowId = data[rowIndex].id; // Ensure the unique identifier is correct
      const response = await fetch(`/api/tables/${tableName}/${rowId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete row with ID: ${rowId}`);
      }

      message.success("Row deleted successfully");

      // Refetch the table data after successful deletion
      const updatedResponse = await fetch(`/api/tables/${tableName}`);
      const updatedResult = await updatedResponse.json();
      if (updatedResult.success) {
        setData(updatedResult.data);
      } else {
        message.error(`Failed to refetch the table after deletion.`);
      }
    } catch (err) {
      console.error("Error deleting the row:", err);
      message.error("Error occurred while deleting the row.");
    }
  };

  // If an error occurred, display it
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Add an "Action" column header
  const extendedColumns = [...columns, "Action"];

  // Display data in a dynamic table format
  return (
    <div>
      <h2>Contents of {tableName} Table</h2>
      <table className="table-auto w-full">
        <thead>
          <tr>
            {extendedColumns.map((column) => (
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
              {/* Action column with a delete icon */}
              <td className="px-4 py-2 border text-center">
                <DeleteOutlined
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDelete(rowIndex)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
