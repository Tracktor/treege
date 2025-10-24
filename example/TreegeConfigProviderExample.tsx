/**
 * Example: Using TreegeConfigProvider for global configuration
 *
 * This example demonstrates how to use TreegeConfigProvider to set
 * global defaults for all TreegeRenderer instances in your app.
 */

import { TreegeConfigProvider, TreegeRenderer, type InputRenderProps } from "@/renderer";
import flows from "~/example/json/treege.json";
import { Flow } from "@/shared/types/node";

// Define your custom components once
const CustomTextInput = ({ node, value, setValue, error }: InputRenderProps) => {
  const stringValue = typeof value === "string" ? value : "";

  return (
    <div className="custom-input-wrapper">
      <label>
        {typeof node.data.label === "string" ? node.data.label : node.data.label?.en}
        {node.data.required && <span className="required">*</span>}
      </label>
      <input type="text" value={stringValue} onChange={(e) => setValue(e.target.value)} className="custom-input" />
      {error && <span className="error">{error}</span>}
    </div>
  );
};

// Configure once at the app level
const AppWithGlobalConfig = () => {
  return (
    <TreegeConfigProvider
      googleApiKey="YOUR_GOOGLE_API_KEY_HERE"
      theme="dark"
      language="en"
      components={{
        inputs: {
          text: CustomTextInput,
        },
      }}
    >
      <div className="app">
        <h1>My App with Global Treege Config</h1>

        {/* This renderer inherits all config from provider */}
        <TreegeRenderer flows={flows as Flow} onSubmit={(values) => console.log("Form 1:", values)} />

        {/* This renderer also inherits the config */}
        <TreegeRenderer flows={flows as Flow} onSubmit={(values) => console.log("Form 2:", values)} />

        {/* This renderer overrides the theme (props take precedence) */}
        <TreegeRenderer
          flows={flows as Flow}
          theme="light" // Overrides the global "dark" theme
          onSubmit={(values) => console.log("Form 3:", values)}
        />
      </div>
    </TreegeConfigProvider>
  );
};

// ✅ Benefits:
// 1. Set googleApiKey once instead of passing it to every TreegeRenderer
// 2. Define custom components once and reuse them everywhere
// 3. Consistent theme/language across your app
// 4. Individual renderers can still override specific settings

// ❌ Without Provider (still works):
const AppWithoutProvider = () => {
  return (
    <div className="app">
      {/* Have to repeat props for every instance */}
      <TreegeRenderer
        flows={flows as Flow}
        googleApiKey="YOUR_GOOGLE_API_KEY_HERE"
        components={{
          inputs: {
            text: CustomTextInput,
          },
        }}
        onSubmit={(values) => console.log(values)}
      />

      <TreegeRenderer
        flows={flows as Flow}
        googleApiKey="YOUR_GOOGLE_API_KEY_HERE" // Repeated!
        components={{
          inputs: {
            text: CustomTextInput, // Repeated!
          },
        }}
        onSubmit={(values) => console.log(values)}
      />
    </div>
  );
};

export default AppWithGlobalConfig;
export { AppWithoutProvider };
