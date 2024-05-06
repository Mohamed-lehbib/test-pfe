import { AttributeWithEnum } from "./tableParser";

// Adjust the function to handle enum types
export const mapTypeToInputType = (attribute: AttributeWithEnum): string => {
  if (attribute.enumValues) {
    return "enum"; // Return "enum" for special handling in the form
  }

  switch (attribute.type) {
    case "string":
      return "text";
    case "number":
    case "bigint":
      return "number";
    case "boolean":
      return "checkbox";
    case "Date":
      return "date";
    default:
      return "text";
  }
};