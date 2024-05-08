"use client";
import { useState, useEffect } from "react";
import { TableAttributes } from "@/utils/tableParser"; // Adjust the import path as needed
import insertData from "@/queries/insert-data/insert-data";

interface DynamicFormProps {
  table: TableAttributes;
}

const DynamicForm = ({ table }: DynamicFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Reset form data whenever the table changes
  useEffect(() => {
    const initialData: Record<string, any> = {};
    table.attributes.forEach((attr) => {
      // Initialize boolean fields to `false` and others to empty strings
      initialData[attr.name] = attr.type === "boolean" ? false : "";
    });
    setFormData(initialData);
  }, [table]);

  // Update form data based on field changes
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = event.target;
    const { name, type, value } = target;

    let updatedValue: any;

    // Handle checkboxes specifically
    if (target instanceof HTMLInputElement && type === "checkbox") {
      updatedValue = target.checked;
    } else {
      updatedValue = value;
    }

    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };

  const cleanFormData = (
    data: Record<string, any>,
    attributes: { name: string; type: string }[]
  ) => {
    const cleanedData: Record<string, any> = {};

    attributes.forEach((attr) => {
      const value = data[attr.name];

      // Skip `id` and `created_at` or handle any other field that shouldn't be included
      if (attr.name === "id" || attr.name === "created_at") {
        return; // Skip this field to let the database handle it
      }

      // Check for empty or invalid timestamp values
      if (
        (attr.type === "Date" || attr.type.includes("timestamp")) &&
        value === ""
      ) {
        cleanedData[attr.name] = null; // Set to null if it's a timestamp-related field
      } else {
        // Otherwise, include the original value
        cleanedData[attr.name] = value;
      }
    });

    return cleanedData;
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form Data Submitted:", formData);

    // Clean the form data before sending to the database
    const cleanedData = cleanFormData(formData, table.attributes);

    // Attempt to insert the collected form data into the table
    const response = await insertData(table.tableName, cleanedData);

    if (response) {
      console.log(`Successfully inserted into ${table.tableName}`, response);
    } else {
      console.error(`Failed to insert data into ${table.tableName}`);
    }
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
                checked={!!formData[name]} // Ensure boolean is coerced properly
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
