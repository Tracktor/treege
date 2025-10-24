/**
 * Example: Custom Input Components with TreegeRenderer
 *
 * This example demonstrates how to create custom input components
 * using the simplified API that provides value, setValue, and error as props.
 */

import type { InputRenderProps } from "@/renderer/types/renderer";
import { TreegeRenderer } from "@/renderer";
import flows from "~/example/json/treege.json";
import { Flow } from "@/shared/types/node";
import { ChangeEvent } from "react";

// ✅ Example 1: Simple custom text input (recommended approach)
// Define your component OUTSIDE the render function to avoid re-creation and focus loss
const CustomTextInput = ({ node, value, setValue, error }: InputRenderProps) => {
  const stringValue = typeof value === "string" ? value : "";

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">
        {typeof node.data.label === "string" ? node.data.label : node.data.label?.en}
        {node.data.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        value={stringValue}
        onChange={(e) => setValue(e.target.value)}
        placeholder={typeof node.data.placeholder === "string" ? node.data.placeholder : node.data.placeholder?.en}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {node.data.helperText && !error && (
        <p className="text-gray-500 text-sm mt-1">
          {typeof node.data.helperText === "string" ? node.data.helperText : node.data.helperText?.en}
        </p>
      )}
    </div>
  );
};

// ✅ Example 2: Custom number input with validation
const CustomNumberInput = ({ node, value, setValue, error }: InputRenderProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numValue = e.target.value === "" ? null : Number(e.target.value);
    setValue(numValue);
  };

  const numberValue = typeof value === "number" ? value : "";

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">
        {typeof node.data.label === "string" ? node.data.label : node.data.label?.en}
        {node.data.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="number"
        value={numberValue}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// ✅ Example 3: Custom select input with styling
const CustomSelectInput = ({ node, value, setValue, error }: InputRenderProps) => {
  // Extract string value from union type
  let selectValue = "";
  if (typeof value === "string") {
    selectValue = value;
  } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
    selectValue = value[0];
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">
        {typeof node.data.label === "string" ? node.data.label : node.data.label?.en}
        {node.data.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={selectValue}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Select --</option>
        {node.data.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {typeof option.label === "string" ? option.label : option.label?.en}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// ✅ Example 4: Using custom inputs in TreegeRenderer
const CustomInputsExample = () => {
  const handleSubmit = (values: Record<string, any>) => {
    console.log("Form submitted with values:", values);
  };

  return (
      <div className={"p-6"}>
        <TreegeRenderer
          flows={flows as Flow}
          onSubmit={handleSubmit}
          components={{
            inputs: {
              text: CustomTextInput,
              number: CustomNumberInput,
              select: CustomSelectInput,
            },
          }}
        />
      </div>
  );
};

// ❌ WRONG: Inline function (will cause focus loss on every keystroke)
export const WrongExample = () => {
  return (
    <TreegeRenderer
      flows={flows as Flow}
      onSubmit={() => {}}
      components={{
        inputs: {
          // ❌ Don't do this - function is recreated on every render
          text: (props) => {
            const stringValue = typeof props.value === "string" ? props.value : "";
            return <input value={stringValue} onChange={(e) => props.setValue(e.target.value)} />;
          },
        },
      }}
    />
  );
};

// ✅ CORRECT: Component reference (maintains focus)
export const CorrectExample = () => {
  return (
    <TreegeRenderer
      flows={flows as Flow}
      onSubmit={() => {}}
      components={{
        inputs: {
          // ✅ Do this - stable component reference
          text: CustomTextInput,
        },
      }}
    />
  );
};

export default CustomInputsExample;
