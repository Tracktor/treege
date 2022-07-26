<div align="center">
  <img alt="Treege" src="https://raw.githubusercontent.com/Tracktor/treege/main/src/assets/img/treege-white.png" style="padding: 20px; max-height:100px; width: auto;" />
</div>

<div align="center">
  <strong>Treege is a tools for decision tree generator</strong>
</div>

- [Features](#Features)
- [Embed](#Embed)
    - [Provide data to iframe](#Provide-data-to-iframe)
    - [Listen Treege event](#Listen-Treege-event)
    - [Events listener](#Events-listener)
    - [Events message](#Events-message)
- [Types](#Types)

## Features

- 📦 **[React](https://fr.reactjs.org)** - v18+ with Hooks
- ⚡️ **[Vite](https://vitejs.dev)** - Next Generation Frontend Tooling
- 📐 **[ESLint](https://eslint.org)** - Code analyzer
- 🚀 **[Vitest](https://vitest.dev)** - A Vite native unit test framework. It's fast!
- 🛠️ **[React Testing Library ](https://testing-library.com/docs/react-testing-library/intro/)** - React DOM testing utilities

## Embed

#### Treege can be easily embed  in any HTML page.

```html
<!doctype html>
<html lang="en">
<head>
    <title>Treege Iframe</title>
    <style>
        html,
        body,
        iframe {
            overflow: hidden;
            margin: 0;
            height: 100%;
            width: 100%;
            border: 0;
        }
    </style>
</head>
<body>

<iframe src="{{YOUR_TREEGE_URL}}"></iframe>

</body>
</html>
```

#### Provide data to iframe

```javascript
const iframe = document.querySelector("iframe");

iframe.addEventListener("load", handleLoadIframe);

function handleLoadIframe() {
    const tree = {
        attributes: {
            depth: 0,
            disabled: false,
            isLeaf: true,
            isRoot: true,
            paths: ["Age"],
            required: false,
            type: "select",
        },
        children: [],
        name: "Age",
    }

    setTimeout(() => {
        iframe.contentWindow.postMessage({source: "treege", tree, type: "setTree"}, "*");
    }, 100);
}
```

#### Listen Treege event

```javascript
const iframe = document.querySelector("iframe");

window.addEventListener("message", handleMessage);

function handleMessage(event) {
    // On save event is trigger from iframe
    if (event.origin === "{{YOUR_TREEGE_URL}}" && event.data.type === "onSave" && event.data.source === "treege") {
        // Get tree data from Treege
        console.log(event.data.tree);
    }
}
```

### Events listener
List of `event.data` that can be listened with`window.addEventListener("message")`

| Event name | Data                                                                                        |
|------------|---------------------------------------------------------------------------------------------|
| onSave     | `{source: "treege", type : "onSave", tree : {{attributes: {...}, children: [], name: ""}}}` |

### Events message
List of events that can be sent with `iframe.contentWindow.postMessage`

| Event name | Data                                                                                         |
|------------|----------------------------------------------------------------------------------------------|
| setTree    | `{source: "treege", type : "setTree", tree : {{attributes: {...}, children: [], name: ""}}}` |

### Types
Tree data that can be provided

``` typescript
interface TreeNode {
  name: string;
  attributes: TreeNodeAttributes;
  children: TreeNode[];
}
```

``` typescript
type TreeNodeAttributes = TreeNodeField | TreeNodeValues;
```

```typescript
interface TreeNodeField {
  depth: number;
  disabled: boolean;
  isLeaf?: boolean;
  isRoot?: boolean;
  label?: never;
  paths: string[];
  required: boolean;
  type: string;
  value?: never;
}
```

``` typescript
export interface TreeNodeValues {
  depth: number;
  disabled?: never;
  isLeaf?: boolean;
  isRoot?: never;
  label: string;
  paths: string[];
  required?: never;
  type?: never;
  value: string;
}
```