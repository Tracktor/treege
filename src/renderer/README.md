# TreegeRenderer

The `TreegeRenderer` is a React component that transforms your decision tree created in the editor into an interactive and dynamic form.

## Features

- **Dynamic Rendering**: Automatically generates the form based on nodes/edges structure
- **Advanced Conditions**: Shows/hides fields based on user responses
- **Render Props Pattern**: Complete customization via render props to integrate your design system
- **State Management**: Built-in state management with validation
- **Multi-language**: Native translation support via `TranslatableLabel`
- **TypeScript Types**: Complete types for better DX

## Basic Usage

```tsx
import { TreegeRenderer } from "treege/renderer";

function MyForm() {
  const nodes = [...]; // Your nodes from the editor
  const edges = [...]; // Your edges from the editor

  return (
    <TreegeRenderer
      nodes={nodes}
      edges={edges}
      onSubmit={(values) => console.log(values)}
    />
  );
}
```

## Customization with Your Design System

The renderer uses the render props pattern to allow you to completely replace component appearance:

```tsx
import { TreegeRenderer, InputRenderProps } from "treege/renderer";
import { renderLabel } from "treege/renderer";
import { TextField } from "@mui/material"; // Your design system

// Custom component for text inputs
const MyTextInput = ({ node, value, onChange, error, context }: InputRenderProps) => {
  // Use renderLabel for translations
  const label = renderLabel(node.data.label, context.language) || node.data.name;

  return (
    <TextField
      label={label}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error || node.data.helperText}
      required={node.data.required}
      fullWidth
    />
  );
};

function MyForm() {
  return (
    <TreegeRenderer
      nodes={nodes}
      edges={edges}
      language="en" // Current language
      components={{
        inputs: {
          text: MyTextInput,
          // Add other types...
        }
      }}
      onSubmit={(values) => console.log(values)}
    />
  );
}
```

## Translation Handling

The `language` field is passed in the context of all render props. Use `renderLabel` to retrieve the translation:

```tsx
import { renderLabel } from "treege/renderer";

const CustomComponent = ({ node, context }: InputRenderProps) => {
  // Get the label in the active language
  const label = renderLabel(node.data.label, context.language);
  const helperText = renderLabel(node.data.helperText, context.language);

  return <YourComponent label={label} helper={helperText} />;
};
```

## Complete API

### Props

```typescript
interface TreegeRendererProps {
  // Data from the editor
  nodes: Node[];
  edges: Edge[];

  // Form
  initialValues?: Record<string, any>;
  onSubmit?: (values: Record<string, any>) => void;
  onChange?: (values: Record<string, any>) => void;

  // Customization
  components?: TreegeRendererComponents;
  language?: string; // Default: "en"
  validationMode?: "onChange" | "onBlur" | "onSubmit"; // Default: "onSubmit"
  validate?: (values: Record<string, any>, nodes: Node[]) => Record<string, string>;
}
```

### RenderContext

Each render prop receives a `context` object with:

```typescript
{
  formValues: Record<string, any>;   // Current form values
  setFieldValue: (name, value) => void;
  getFieldValue: (name) => any;
  errors: Record<string, string>;     // Validation errors
  language: string;                    // Current language
}
```

## Examples

### With Radix UI / shadcn/ui

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { renderLabel } from "treege/renderer";

const RadixTextInput = ({ node, value, onChange, error, context }: InputRenderProps) => {
  const label = renderLabel(node.data.label, context.language) || node.data.name;

  return (
    <div className="space-y-2">
      <Label htmlFor={node.data.name}>
        {label}
        {node.data.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={node.data.name}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={node.data.helperText}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
```

### With Material-UI

```tsx
import { TextField } from "@mui/material";
import { renderLabel } from "treege/renderer";

const MUITextInput = ({ node, value, onChange, error, context }: InputRenderProps) => {
  const label = renderLabel(node.data.label, context.language) || node.data.name;

  return (
    <TextField
      label={label}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error || node.data.helperText}
      required={node.data.required}
      fullWidth
      margin="normal"
    />
  );
};
```

### Custom Validation

```tsx
<TreegeRenderer
  nodes={nodes}
  edges={edges}
  validate={(values, visibleNodes) => {
    const errors: Record<string, string> = {};

    // Custom validation
    if (values.age && values.age < 18) {
      errors.age = "You must be at least 18 years old";
    }

    return errors;
  }}
  validationMode="onChange"
  onSubmit={(values) => {
    // Submit the form
  }}
/>
```

## Supported Input Types

The following types are available by default:
- `text`, `number`, `password`
- `select`, `radio`, `checkbox`, `switch`
- `date`, `time`, `daterange`, `timerange`
- `file`, `hidden`
- `address`, `autocomplete`, `http`

All can be replaced via the `components.inputs` prop.