// "use client";
// import { useState } from "react";
// import { InboxOutlined } from "@ant-design/icons";
// import { message, Upload } from "antd";
// import type { UploadProps } from "antd";
// import { parseSupabaseTablesWithAttributes } from "@/utils/tableParser"; // Adjust path as needed
// import DynamicForm from "@/components/dynamique-form";
// import TableView from "@/components/table-view";

// interface TableAttributes {
//   tableName: string;
//   attributes: { name: string; type: string }[];
// }

// const { Dragger } = Upload;

// const Home = () => {
//   // Define state variables for file content and tables
//   const [fileContent, setFileContent] = useState<string>("");
//   const [tables, setTables] = useState<TableAttributes[]>([]);
//   const [selectedTable, setSelectedTable] = useState<TableAttributes | null>(
//     null
//   );

//   // Function to handle file parsing and upload
//   const handleFiles = (file: File) => {
//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       const text = e.target?.result;

//       // Parse tables using the imported function
//       const tablesWithAttributes = parseSupabaseTablesWithAttributes(
//         text as string
//       );

//       // Log tables and their attributes to the console for debugging
//       console.log("Parsed Tables:", tablesWithAttributes);

//       // Update the state to reflect the parsed results
//       setFileContent(text as string);
//       setTables(tablesWithAttributes);

//       // Prepare data for upload
//       const uploadData = {
//         filename: "supabase.d.ts",
//         content: text as string,
//       };

//       // Send data to the server for saving
//       const response = await fetch("/api/upload-file", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(uploadData),
//       });

//       if (!response.ok) {
//         message.error("Failed to save the file on the server.");
//       } else {
//         message.success(
//           "File successfully saved on the server as 'supabase.d.ts'!"
//         );
//       }
//     };
//     reader.readAsText(file);
//   };

//   // Define the props for the Dragger component
//   const draggerProps: UploadProps = {
//     name: "file",
//     multiple: false, // Only allow one file at a time
//     beforeUpload: (file) => {
//       // Prevent automatic upload, we'll handle this manually
//       handleFiles(file);
//       return false; // Prevent the file from being uploaded automatically
//     },
//     onChange(info) {
//       const { status, name } = info.file;
//       if (status === "done") {
//         message.success(`${name} file uploaded successfully.`);
//       } else if (status === "error") {
//         message.error(`${name} file upload failed.`);
//       }
//     },
//     onDrop(e) {
//       console.log("Dropped files", e.dataTransfer.files);
//     },
//   };

//   // Handle table selection
//   const handleTableSelection = (tableName: string) => {
//     const selected = tables.find((table) => table.tableName === tableName);
//     setSelectedTable(selected || null); // Set the selected table or null if not found
//   };

//   return (
//     <div className="h-screen overflow-y-auto p-8 bg-gray-50">
//       <div className="flex flex-col items-center space-y-8">
//         {/* Ant Design's Dragger component */}
//         <Dragger {...draggerProps} className="w-full max-w-lg">
//           <p className="ant-upload-drag-icon">
//             <InboxOutlined />
//           </p>
//           <p className="ant-upload-text">
//             Click or drag a TypeScript file to this area to upload
//           </p>
//           <p className="ant-upload-hint">Supports only single-file upload.</p>
//         </Dragger>

//         {/* Display parsed tables for selection if available */}
//         {tables.length > 0 && (
//           <div className="flex flex-col items-center space-y-4 w-full max-w-lg">
//             <h2 className="text-2xl font-semibold">Supabase Tables:</h2>
//             <ul className="list-disc w-full">
//               {tables.map((table, index) => (
//                 <li
//                   key={index}
//                   className="cursor-pointer text-blue-500 hover:underline"
//                   onClick={() => handleTableSelection(table.tableName)}
//                 >
//                   {table.tableName}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Display the form for the selected table */}
//         {selectedTable && (
//           <>
//             <div className="w-full max-w-lg">
//               <DynamicForm table={selectedTable} />
//             </div>
//             <div>
//               <h1>Dynamic Table Viewer</h1>
//               <TableView tableName={selectedTable.tableName} />
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;

// pages/index.tsx
// pages/index.tsx
"use client";
import { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Upload, message, Button } from "antd";
import {
  parseSupabaseTablesWithAttributes,
  TableAttributes,
} from "@/utils/tableParser";
import { useRouter } from "next/navigation";

const { Dragger } = Upload;

const Home = () => {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [tables, setTables] = useState<TableAttributes[]>([]);
  const [fileContent, setFileContent] = useState<string>("");

  const handleFiles = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      const tablesWithAttributes = parseSupabaseTablesWithAttributes(
        text as string
      );
      setTables(tablesWithAttributes);
      setFileContent(text as string);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!url || !key || tables.length === 0) {
      message.error("Supabase credentials and a TypeScript file are required.");
      return;
    }

    // Send credentials and parsed data to the API route
    const response = await fetch("/api/store-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, key, tables }),
    });

    if (response.ok) {
      router.push("/tables-overview");
    } else {
      message.error("Error saving data.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-semibold text-center mb-8">
        Supabase Configuration
      </h1>

      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Supabase URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="Enter Supabase URL"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">
          Supabase API Key
        </label>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          required
          placeholder="Enter Supabase API Key"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-6">
        <Dragger
          name="file"
          multiple={false}
          beforeUpload={(file) => {
            handleFiles(file);
            return false;
          }}
          // className="bg-white border border-dashed border-gray-300 p-6 rounded-md cursor-pointer"
        >
          <p className="ant-upload-drag-icon mb-4">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text text-lg mb-2">
            Click or drag a TypeScript file to upload
          </p>
          <p className="ant-upload-hint">Supports a single-file upload only.</p>
        </Dragger>
      </div>

      <Button
        type="primary"
        onClick={handleSubmit}
        // className="w-full py-2 text-lg"
        size="large"
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );
};

export default Home;
