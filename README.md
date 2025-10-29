<div align="center">
  <img alt="Treege" src="https://user-images.githubusercontent.com/108873902/189673125-5d1fdaf3-82d1-486f-bb16-01b0554bd4f1.png" style="padding: 20px;" width="auto" height="100" />

  <h1>Treege</h1>
  <p><strong>Build powerful decision trees with a visual node-based editor</strong></p>

  [![npm version](https://badge.fury.io/js/treege.svg)](https://badge.fury.io/js/treege)
  [![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

  <p>
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#documentation">Documentation</a> •
    <a href="#examples">Examples</a>
  </p>
</div>

---

## Overview

Treege is a modern React library for creating and rendering interactive decision trees. Built on top of ReactFlow, it provides a complete solution for building complex form flows, decision logic, and conditional workflows with an intuitive visual editor.

## Features

### Visual Editor (`treege/editor`)
- **Node-based Interface**: Drag-and-drop editor powered by ReactFlow
- **5 Node Types**: Flow, Group, Input, JSON, and UI nodes
- **Conditional Edges**: Advanced logic with AND/OR operators
- **Multi-language Support**: Built-in translation system
- **Type-safe**: Full TypeScript support

### Runtime Renderer (`treege/renderer`)
- **Form Generation**: Automatically render forms from decision trees
- **Validation**: Built-in required and pattern validation
- **Conditional Logic**: Dynamic field visibility based on user input
- **Customizable**: Override default components with your own
- **Theme Support**: Dark/light mode out of the box

### Developer Experience
- **Modular**: Import only what you need (editor, renderer, or both)
- **Modern Stack**: React 18/19, TailwindCSS 4, TypeScript 5
- **Well-typed**: Comprehensive TypeScript definitions
- **Production Ready**: Battle-tested and actively maintained

## Installation

```bash
# npm
npm install treege

# pnpm
pnpm add treege

# yarn
yarn add treege

# bun
bun add treege
```

## Quick Start

### Using the Editor

Create and edit decision trees visually:

```tsx
import { TreegeEditor } from "treege/editor";
import type { Flow } from "treege";

function App() {
  const [flow, setFlow] = useState<Flow | null>(null);

  const handleSave = (updatedFlow: Flow) => {
    setFlow(updatedFlow);
    console.log("Decision tree saved:", updatedFlow);
  };

  return (
    <TreegeEditor
      flow={flow}
      onSave={handleSave}
    />
  );
}
```

### Using the Renderer

Render interactive forms from decision trees:

```tsx
import { TreegeRenderer } from "treege/renderer";
import type { Flow, FormValues } from "treege";

function App() {
  const flow: Flow = {
    id: "flow-1",
    nodes: [
      {
        id: "start",
        type: "input",
        data: {
          name: "username",
          label: "Enter your username",
          required: true
        }
      }
    ],
    edges: []
  };

  const handleSubmit = (values: FormValues) => {
    console.log("Form submitted:", values);
  };

  return (
    <TreegeRenderer
      flows={flow}
      onSubmit={handleSubmit}
    />
  );
}
```

### Using Both Together

```tsx
import { TreegeEditor } from "treege/editor";
import { TreegeRenderer } from "treege/renderer";
import { useState } from "react";

function App() {
  const [flow, setFlow] = useState(null);
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  return (
    <div>
      <button onClick={() => setMode(mode === "edit" ? "preview" : "edit")}>
        {mode === "edit" ? "Preview" : "Edit"}
      </button>

      {mode === "edit" ? (
        <TreegeEditor flow={flow} onSave={setFlow} />
      ) : (
        <TreegeRenderer flows={flow} onSubmit={console.log} />
      )}
    </div>
  );
}
```

## Module Structure

Treege provides three import paths for optimal bundle size:

```tsx
// Import everything (editor + renderer + types)
import { TreegeEditor, TreegeRenderer } from "treege";

// Import only the editor
import { TreegeEditor } from "treege/editor";

// Import only the renderer
import { TreegeRenderer } from "treege/renderer";
```

## Node Types

### Flow Node
Navigation node that controls the flow between different parts of the tree.

```tsx
{
  type: "flow",
  data: {
    targetId: "next-node-id",
    label: "Continue"
  }
}
```

### Input Node
Form input with validation, patterns, and conditional logic.

```tsx
{
  type: "input",
  data: {
    type: "text",
    name: "email",
    label: "Email Address",
    required: true,
    pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
    errorMessage: "Please enter a valid email"
  }
}
```

Supported input types: `text`, `email`, `password`, `number`, `textarea`, `select`, `radio`, `checkbox`, `switch`, `date`, `dateRange`, `time`, `timeRange`, `file`, `address`, `http`

### Group Node
Container for organizing multiple nodes together.

```tsx
{
  type: "group",
  data: {
    label: "Personal Information"
  }
}
```

### JSON Node
Store and manage JSON data within the tree.

```tsx
{
  type: "json",
  data: {
    json: { key: "value" }
  }
}
```

### UI Node
Display-only elements (titles, descriptions, separators).

```tsx
{
  type: "ui",
  data: {
    type: "title",
    label: "Welcome to the form"
  }
}
```

## Conditional Edges

Create dynamic flows with conditional logic:

```tsx
{
  type: "conditional",
  data: {
    conditions: [
      {
        field: "age",
        operator: ">=",
        value: "18"
      },
      {
        field: "country",
        operator: "===",
        value: "US"
      }
    ],
    logicalOperator: "AND"
  }
}
```

Supported operators: `===`, `!==`, `>`, `<`, `>=`, `<=`

## Translation Support

Treege supports multiple languages out of the box:

```tsx
{
  type: "input",
  data: {
    label: {
      en: "First Name",
      fr: "Prénom",
      es: "Nombre"
    }
  }
}
```

## Customization

### Custom Input Components

Override default input renderers with your own:

```tsx
import { TreegeRenderer } from "treege/renderer";

const CustomTextInput = ({ node }) => {
  return <input className="my-custom-input" />;
};

<TreegeRenderer
  flows={flow}
  components={{
    inputs: {
      text: CustomTextInput
    }
  }}
/>
```

### Custom Validation

Add custom validation logic:

```tsx
<TreegeRenderer
  flows={flow}
  validate={(values, visibleNodes) => {
    const errors = {};

    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords must match";
    }

    return errors;
  }}
/>
```

### Validation Modes

Control when validation occurs:

```tsx
// Validate only on submit (default)
<TreegeRenderer validationMode="onSubmit" />

// Validate on every change
<TreegeRenderer validationMode="onChange" />
```

## Examples

Check out the `/example` directory for complete examples:

```bash
  # Run the example app
  bun example
```

## API Reference

### TreegeEditor Props

| Prop       | Type                   | Default  | Description                 |
|------------|------------------------|----------|-----------------------------|
| `flow`     | `Flow \| null`         | `null`   | Initial decision tree       |
| `onSave`   | `(flow: Flow) => void` | -        | Callback when tree is saved |
| `language` | `string`               | `"en"`   | UI language                 |
| `theme`    | `"light" \| "dark"`    | `"dark"` | Editor theme                |

### TreegeRenderer Props

| Prop             | Type                                        | Default      | Description                |
|------------------|---------------------------------------------|--------------|----------------------------|
| `flows`          | `Flow \| null`                              | -            | Decision tree to render    |
| `onSubmit`       | `(values: FormValues) => void`              | -            | Form submission handler    |
| `onChange`       | `(values: FormValues) => void`              | -            | Form change handler        |
| `validate`       | `(values, nodes) => Record<string, string>` | -            | Custom validation function |
| `initialValues`  | `FormValues`                                | `{}`         | Initial form values        |
| `components`     | `RendererComponents`                        | -            | Custom component overrides |
| `language`       | `string`                                    | `"en"`       | UI language                |
| `validationMode` | `"onSubmit" \| "onChange"`                  | `"onSubmit"` | When to validate           |
| `theme`          | `"light" \| "dark"`                         | `"dark"`     | Renderer theme             |
| `googleApiKey`   | `string`                                    | -            | API key for address input  |

## Development

```bash
# Install dependencies
yarn install

# Start dev server
yarn dev

# Build library
yarn build

# Run linter and type check
yarn lint

# Preview build
yarn preview
```

## Tech Stack

- **React** 18/19 - UI library
- **TypeScript** - Type safety
- **TailwindCSS** 4 - Styling
- **ReactFlow** - Node-based UI
- **Radix UI** - Accessible components
- **Zustand** - State management
- **Vite** - Build tool

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Credits

Created and maintained by [Mickaël Austoni](https://github.com/Tracktor)

## Support

- [GitHub Issues](https://github.com/Tracktor/treege/issues)
- [Repository](https://github.com/Tracktor/treege)
