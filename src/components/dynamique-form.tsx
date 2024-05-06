// "use client";
// import { useState } from "react";
// import { TableAttributes } from "@/utils/tableParser"; // Adjust the import path as needed

// interface DynamicFormProps {
//   table: TableAttributes;
// }

// const DynamicForm = ({ table }: DynamicFormProps) => {
//   const [formData, setFormData] = useState<Record<string, any>>({});

//   // Update form data based on field changes
//   const handleInputChange = (
//     event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const target = event.target;
//     const { name, type, value } = target;

//     // Initialize the updated value
//     let updatedValue: any;

//     // Handle checkboxes specifically by checking if the target is an HTMLInputElement
//     if (target instanceof HTMLInputElement && type === "checkbox") {
//       updatedValue = target.checked;
//     } else {
//       updatedValue = value; // Use the `value` property for other types
//     }

//     // Update the form data state with the new value
//     setFormData({
//       ...formData,
//       [name]: updatedValue,
//     });
//   };

//   return (
//     <form className="space-y-4">
//       <h2 className="text-lg font-semibold">{table.tableName} Form</h2>
//       {table.attributes.map((attribute) => {
//         const { name, type, enumValues } = attribute;

//         // Render a dropdown for enums or union types
//         if (enumValues) {
//           return (
//             <div key={name} className="flex flex-col">
//               <label className="mb-2" htmlFor={name}>
//                 {name}
//               </label>
//               <select
//                 name={name}
//                 value={formData[name] || ""}
//                 onChange={handleInputChange}
//                 className="border rounded p-2"
//               >
//                 <option value="">-- Select an option --</option>
//                 {enumValues.map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           );
//         }

//         // Render other input types (e.g., text, number, etc.)
//         return (
//           <div key={name} className="flex flex-col">
//             <label className="mb-2" htmlFor={name}>
//               {name}
//             </label>
//             {type === "boolean" ? (
//               <input
//                 type="checkbox"
//                 name={name}
//                 checked={formData[name] || false}
//                 onChange={handleInputChange}
//               />
//             ) : (
//               <input
//                 type={type === "number" ? "number" : "text"}
//                 name={name}
//                 value={formData[name] || ""}
//                 onChange={handleInputChange}
//                 className="border rounded p-2"
//               />
//             )}
//           </div>
//         );
//       })}
//     </form>
//   );
// };

// export default DynamicForm;

"use client";
import { useState } from "react";
import { TableAttributes } from "@/utils/tableParser"; // Adjust the import path as needed

interface DynamicFormProps {
  table: TableAttributes;
}

const DynamicForm = ({ table }: DynamicFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Update form data based on field changes
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = event.target;
    const { name, type, value } = target;

    let updatedValue: any;

    // Handle checkboxes specifically by checking if the target is an HTMLInputElement
    if (target instanceof HTMLInputElement && type === "checkbox") {
      updatedValue = target.checked;
    } else {
      updatedValue = value; // Use the `value` property for other types
    }

    // Update form data
    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  // Handle form submission
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log("Form Data Submitted:", formData); // Log the collected form data to the console
  };

  // Render the form dynamically based on the table attributes
  return (
    <form className="space-y-4" onSubmit={handleFormSubmit}>
      <h2 className="text-lg font-semibold">{table.tableName} Form</h2>
      {table.attributes.map((attribute) => {
        const { name, type, enumValues } = attribute;

        // Render a dropdown for enums or union types
        if (enumValues) {
          return (
            <div key={name} className="flex flex-col">
              <label className="mb-2" htmlFor={name}>
                {name}
              </label>
              <select
                name={name}
                value={formData[name] || ""}
                onChange={handleInputChange}
                className="border rounded p-2"
              >
                <option value="">-- Select an option --</option>
                {enumValues.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        // Render other input types (e.g., text, number, etc.)
        return (
          <div key={name} className="flex flex-col">
            <label className="mb-2" htmlFor={name}>
              {name}
            </label>
            {type === "boolean" ? (
              <input
                type="checkbox"
                name={name}
                checked={formData[name] || false}
                onChange={handleInputChange}
              />
            ) : (
              <input
                type={type === "number" ? "number" : "text"}
                name={name}
                value={formData[name] || ""}
                onChange={handleInputChange}
                className="border rounded p-2"
              />
            )}
          </div>
        );
      })}

      {/* Submit button to trigger form submission */}
      <button type="submit" className="bg-blue-500 text-white rounded p-2">
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
