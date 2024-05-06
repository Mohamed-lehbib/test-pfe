// "use client";
// import { useState, useCallback } from "react";
// import { Project, PropertySignature, TypeLiteralNode } from "ts-morph";

// const Home = () => {
//   const [fileContent, setFileContent] = useState<string>("");
//   const [tables, setTables] = useState<string[]>([]);
//   const [isDragging, setIsDragging] = useState(false);

//   // Function to check if the file is a TypeScript file
//   const isTypeScript = (filename: string) => /\.ts$/i.test(filename);

//   // Handle file changes from both input selection and drag-and-drop
//   const handleFiles = async (file: File | null) => {
//     if (file && isTypeScript(file.name)) {
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         const text = e.target?.result;

//         // Extract tables (optional: if you still want to do this client-side)
//         const tables = parseSupabaseTables(text as string);
//         setFileContent(text as string);
//         setTables(tables);

//         // Prepare data for upload
//         const uploadData = {
//           filename: "supabase.d.ts", // Always name the file "supabase.d.ts"
//           content: text as string,
//         };

//         // Send data to the server for saving
//         const response = await fetch("/api/upload-file", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(uploadData),
//         });

//         if (!response.ok) {
//           alert("Failed to save the file on the server.");
//         } else {
//           alert("File successfully saved on the server as 'supabase.d.ts'!");
//         }
//       };
//       reader.readAsText(file);
//     } else {
//       alert("Please upload a TypeScript file.");
//     }
//   };

//   // Handle file input selection
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files ? event.target.files[0] : null;
//     handleFiles(file);
//   };

//   // Drag-and-drop event handlers
//   const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(true);
//   }, []);

//   const handleDragLeave = useCallback(() => {
//     setIsDragging(false);
//   }, []);

//   const handleDrop = useCallback(
//     (e: React.DragEvent<HTMLDivElement>) => {
//       e.preventDefault();
//       setIsDragging(false);
//       const file = e.dataTransfer.files ? e.dataTransfer.files[0] : null;
//       handleFiles(file);
//     },
//     [handleFiles]
//   );

//   // Function to parse tables from the TypeScript file
//   const parseSupabaseTables = (tsFileContent: string): string[] => {
//     // Create a new ts-morph project using an in-memory file system
//     const project = new Project({ useInMemoryFileSystem: true });

//     // Create a source file using the provided TypeScript file content
//     const sourceFile = project.createSourceFile("temp.ts", tsFileContent);

//     // Find the "Database" type alias and obtain its corresponding type node
//     const databaseType = sourceFile.getTypeAliasOrThrow("Database");
//     const databaseNode = databaseType.getTypeNodeOrThrow() as TypeLiteralNode;

//     // Find the "public" property within the "Database" type
//     const publicProp = databaseNode.getPropertyOrThrow(
//       "public"
//     ) as PropertySignature;
//     const publicTypeNode = publicProp.getTypeNodeOrThrow() as TypeLiteralNode;

//     // Find the "Tables" property within the "public" property
//     const tablesProp = publicTypeNode.getPropertyOrThrow(
//       "Tables"
//     ) as PropertySignature;
//     const tablesTypeNode = tablesProp.getTypeNodeOrThrow() as TypeLiteralNode;

//     // Extract table names by filtering only property signatures and mapping them to their names
//     const tableNames = tablesTypeNode
//       .getMembers()
//       .filter((member) => member instanceof PropertySignature) // Ensure the member is a property (table name)
//       .map((member) => (member as PropertySignature).getName()); // Extract the name of the property

//     // Return the extracted table names
//     return tableNames;
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen space-y-8">
//       {/* Drag-and-drop file input */}
//       <div
//         className={`w-80 h-40 flex flex-col items-center justify-center border-4 ${
//           isDragging
//             ? "border-dashed border-indigo-600"
//             : "border-solid border-gray-400"
//         } bg-gray-50 rounded-lg cursor-pointer text-center p-4`}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//       >
//         <input
//           type="file"
//           accept=".ts"
//           onChange={handleFileChange}
//           className="hidden"
//         />
//         <p className="text-lg text-gray-500">
//           {isDragging
//             ? "Release to upload"
//             : "Drag & drop a TypeScript file or click here to upload"}
//         </p>
//       </div>

//       {/* Display parsed tables if available */}
//       {tables.length > 0 && (
//         <div className="flex flex-col items-center space-y-4">
//           <h2 className="text-2xl font-semibold">Supabase Tables:</h2>
//           <ul className="list-disc">
//             {tables.map((table, index) => (
//               <li key={index}>{table}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;

// ----------------------------------------------------------------------------------

// "use client";
// import { useState } from "react";
// import { InboxOutlined } from "@ant-design/icons";
// import { message, Upload } from "antd";
// import type { UploadProps } from "antd";
// import { parseSupabaseTablesWithAttributes } from "@/utils/tableParser";

// const { Dragger } = Upload;

// interface TableAttributes {
//   tableName: string;
//   attributes: { name: string; type: string }[];
// }

// const Home = () => {
//   // Define state variables for file content and tables
//   const [fileContent, setFileContent] = useState<string>("");
//   const [tables, setTables] = useState<TableAttributes[]>([]);

//   // Function to handle file parsing and upload
//   const handleFiles = (file: File) => {
//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       const text = e.target?.result;

//       // Parse tables using the imported function
//       const tablesWithAttributes = parseSupabaseTablesWithAttributes(
//         text as string
//       );
//       setFileContent(text as string); // Properly scoped `setFileContent`
//       setTables(tablesWithAttributes); // Properly scoped `setTables`

//       // Prepare data for upload
//       const uploadData = {
//         filename: "supabase.d.ts", // Always name the file "supabase.d.ts"
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

//         {/* Display parsed tables and their attributes if available */}
//         {tables.length > 0 && (
//           <div className="flex flex-col items-center space-y-4 w-full max-w-lg">
//             <h2 className="text-2xl font-semibold">Supabase Tables:</h2>
//             <ul className="list-disc w-full">
//               {tables.map((table, index) => (
//                 <li key={index}>
//                   <strong>{table.tableName}:</strong>
//                   <ul className="list-decimal ml-5">
//                     {table.attributes.map((attr, attrIndex) => (
//                       <li key={attrIndex}>
//                         {attr.name}: <em>{attr.type}</em>
//                       </li>
//                     ))}
//                   </ul>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;

"use client";
import { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import type { UploadProps } from "antd";
import { parseSupabaseTablesWithAttributes } from "@/utils/tableParser"; // Adjust path as needed
import DynamicForm from "@/components/dynamique-form";

interface TableAttributes {
  tableName: string;
  attributes: { name: string; type: string }[];
}

const { Dragger } = Upload;

const Home = () => {
  // Define state variables for file content and tables
  const [fileContent, setFileContent] = useState<string>("");
  const [tables, setTables] = useState<TableAttributes[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableAttributes | null>(
    null
  );

  // Function to handle file parsing and upload
  // const handleFiles = (file: File) => {
  //   const reader = new FileReader();
  //   reader.onload = async (e) => {
  //     const text = e.target?.result;

  //     // Parse tables using the imported function
  //     const tablesWithAttributes = parseSupabaseTablesWithAttributes(
  //       text as string
  //     );
  //     setFileContent(text as string); // Properly scoped `setFileContent`
  //     setTables(tablesWithAttributes); // Properly scoped `setTables`

  //     // Prepare data for upload
  //     const uploadData = {
  //       filename: "supabase.d.ts", // Always name the file "supabase.d.ts"
  //       content: text as string,
  //     };

  //     // Send data to the server for saving
  //     const response = await fetch("/api/upload-file", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(uploadData),
  //     });

  //     if (!response.ok) {
  //       message.error("Failed to save the file on the server.");
  //     } else {
  //       message.success(
  //         "File successfully saved on the server as 'supabase.d.ts'!"
  //       );
  //     }
  //   };
  //   reader.readAsText(file);
  // };
  // Function to handle file parsing and upload
  const handleFiles = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result;

      // Parse tables using the imported function
      const tablesWithAttributes = parseSupabaseTablesWithAttributes(
        text as string
      );

      // Log tables and their attributes to the console for debugging
      console.log("Parsed Tables:", tablesWithAttributes);

      // Update the state to reflect the parsed results
      setFileContent(text as string);
      setTables(tablesWithAttributes);

      // Prepare data for upload
      const uploadData = {
        filename: "supabase.d.ts",
        content: text as string,
      };

      // Send data to the server for saving
      const response = await fetch("/api/upload-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadData),
      });

      if (!response.ok) {
        message.error("Failed to save the file on the server.");
      } else {
        message.success(
          "File successfully saved on the server as 'supabase.d.ts'!"
        );
      }
    };
    reader.readAsText(file);
  };

  // Define the props for the Dragger component
  const draggerProps: UploadProps = {
    name: "file",
    multiple: false, // Only allow one file at a time
    beforeUpload: (file) => {
      // Prevent automatic upload, we'll handle this manually
      handleFiles(file);
      return false; // Prevent the file from being uploaded automatically
    },
    onChange(info) {
      const { status, name } = info.file;
      if (status === "done") {
        message.success(`${name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  // Handle table selection
  const handleTableSelection = (tableName: string) => {
    const selected = tables.find((table) => table.tableName === tableName);
    setSelectedTable(selected || null); // Set the selected table or null if not found
  };

  return (
    <div className="h-screen overflow-y-auto p-8 bg-gray-50">
      <div className="flex flex-col items-center space-y-8">
        {/* Ant Design's Dragger component */}
        <Dragger {...draggerProps} className="w-full max-w-lg">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag a TypeScript file to this area to upload
          </p>
          <p className="ant-upload-hint">Supports only single-file upload.</p>
        </Dragger>

        {/* Display parsed tables for selection if available */}
        {tables.length > 0 && (
          <div className="flex flex-col items-center space-y-4 w-full max-w-lg">
            <h2 className="text-2xl font-semibold">Supabase Tables:</h2>
            <ul className="list-disc w-full">
              {tables.map((table, index) => (
                <li
                  key={index}
                  className="cursor-pointer text-blue-500 hover:underline"
                  onClick={() => handleTableSelection(table.tableName)}
                >
                  {table.tableName}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Display the form for the selected table */}
        {selectedTable && (
          <div className="w-full max-w-lg">
            <DynamicForm table={selectedTable} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
