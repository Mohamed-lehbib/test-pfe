// // utils/tableParser.ts

// // Import necessary components from `ts-morph`, a TypeScript analysis tool
// import { Project, PropertySignature, TypeLiteralNode } from "ts-morph";

// // Define a TypeScript interface to store each table's attributes and their types
// interface TableAttributes {
//   tableName: string; // Name of the table
//   attributes: { name: string; type: string }[]; // List of attribute names and their types
// }

// /**
//  * Parses TypeScript file content and extracts table names with their attributes and types.
//  * @param tsFileContent The TypeScript file content to analyze
//  * @returns An array of objects containing table names and their attributes with types
//  */
// export const parseSupabaseTablesWithAttributes = (tsFileContent: string): TableAttributes[] => {
//   // Create a new TypeScript project with an in-memory file system using `ts-morph`
//   const project = new Project({ useInMemoryFileSystem: true });

//   // Create a source file for analysis using the provided TypeScript file content
//   const sourceFile = project.createSourceFile("temp.ts", tsFileContent);

//   // Find the `Database` type alias from the source file and obtain its corresponding type node
//   const databaseType = sourceFile.getTypeAliasOrThrow("Database");
//   const databaseNode = databaseType.getTypeNodeOrThrow() as TypeLiteralNode;

//   // Find the `public` property within the `Database` type
//   const publicProp = databaseNode.getPropertyOrThrow("public") as PropertySignature;
//   const publicTypeNode = publicProp.getTypeNodeOrThrow() as TypeLiteralNode;

//   // Find the `Tables` property within the `public` property
//   const tablesProp = publicTypeNode.getPropertyOrThrow("Tables") as PropertySignature;
//   const tablesTypeNode = tablesProp.getTypeNodeOrThrow() as TypeLiteralNode;

//   // Extract table names and their attributes into an array
//   const tablesWithAttributes: TableAttributes[] = tablesTypeNode
//     // Retrieve all members (properties) of the `Tables` property
//     .getMembers()
//     // Filter only property signatures (each represents a table)
//     .filter((member) => member instanceof PropertySignature)
//     .map((member) => {
//       // Extract the table name from the property
//       const tableName = (member as PropertySignature).getName();
//       // Obtain the type of the table (expected to have a `Row` property)
//       const memberType = (member as PropertySignature).getTypeNodeOrThrow() as TypeLiteralNode;
//       // Find the `Row` property which contains table attributes
//       const rowProp = memberType.getPropertyOrThrow("Row") as PropertySignature;
//       const rowTypeNode = rowProp.getTypeNodeOrThrow() as TypeLiteralNode;

//       // Extract field names and types from the `Row` object
//       const attributes = rowTypeNode
//         .getMembers()
//         // Filter only property signatures, as these are the actual table attributes
//         .filter((field) => field instanceof PropertySignature)
//         .map((field) => ({
//           // Get each attribute's name
//           name: (field as PropertySignature).getName(),
//           // Retrieve the TypeScript type of the attribute as a string
//           type: (field as PropertySignature).getType().getText(),
//         }));

//       // Return the table name and its attributes as an object
//       return { tableName, attributes };
//     });

//   // Return an array of objects containing table names and their attributes
//   return tablesWithAttributes;
// };

// utils/tableParser.ts
import { Project, PropertySignature, TypeLiteralNode, UnionTypeNode } from "ts-morph";

// Structure to store attributes, including potential enum values
export interface AttributeWithEnum {
  name: string;
  type: string;
  enumValues?: string[]; // Optional property for enum values
}

// Structure for table attributes
export interface TableAttributes {
  tableName: string;
  attributes: AttributeWithEnum[];
}

/**
 * Parses TypeScript file content and extracts table names with their attributes and types.
 * @param tsFileContent The TypeScript file content to analyze
 * @returns An array of objects containing table names and their attributes with types
 */
export const parseSupabaseTablesWithAttributes = (tsFileContent: string): TableAttributes[] => {
  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile("temp.ts", tsFileContent);

  const databaseType = sourceFile.getTypeAliasOrThrow("Database");
  const databaseNode = databaseType.getTypeNodeOrThrow() as TypeLiteralNode;

  const publicProp = databaseNode.getPropertyOrThrow("public") as PropertySignature;
  const publicTypeNode = publicProp.getTypeNodeOrThrow() as TypeLiteralNode;

  const tablesProp = publicTypeNode.getPropertyOrThrow("Tables") as PropertySignature;
  const tablesTypeNode = tablesProp.getTypeNodeOrThrow() as TypeLiteralNode;

  const tablesWithAttributes: TableAttributes[] = tablesTypeNode
    .getMembers()
    .filter((member) => member instanceof PropertySignature)
    .map((member) => {
      const tableName = (member as PropertySignature).getName();
      const memberType = (member as PropertySignature).getTypeNodeOrThrow() as TypeLiteralNode;
      const rowProp = memberType.getPropertyOrThrow("Row") as PropertySignature;
      const rowTypeNode = rowProp.getTypeNodeOrThrow() as TypeLiteralNode;

      const attributes = rowTypeNode
        .getMembers()
        .filter((field) => field instanceof PropertySignature)
        .map((field) => {
          const name = (field as PropertySignature).getName();
          const fieldType = (field as PropertySignature).getType();
          const fieldTypeText = fieldType.getText();

          // Check for union types with string literals
          let enumValues: string[] | undefined;
          if (fieldType.isUnion()) {
            // Retrieve all union members and check if they are string literals
            enumValues = fieldType
              .getUnionTypes()
              .map((unionType) => unionType.getText())
              .filter((value) => value.startsWith('"') && value.endsWith('"'))
              .map((value) => value.replace(/"/g, "")); // Remove surrounding quotes
          }

          return {
            name,
            type: fieldTypeText,
            enumValues,
          };
        });

      return { tableName, attributes };
    });

  return tablesWithAttributes;
};
