<div align="center">
  <img alt="Treege" src="https://user-images.githubusercontent.com/108873902/189673125-5d1fdaf3-82d1-486f-bb16-01b0554bd4f1.png" style="padding: 20px; max-height:100px; width: auto;" />
  <p><strong>Treege is a tools for decision tree generator</strong></p>
</div>

<video src="https://user-images.githubusercontent.com/108873902/184317603-61ceafc6-a326-49b2-b0de-ffda9cf9c75e.mov"></video>

- [Embed Treege anywhere](#Embed-Treege-anywhere)
    - [Provide data to iframe](#Provide-data-to-iframe)
    - [Listen Treege event](#Listen-Treege-event)
    - [Events listener](#Events-listener)
    - [Events message](#Events-message)
- [Types](#Types)
- [Generate form from Treege data](#Generate-form-from-Treege-data)
- [Features](#Features)
- [Local installation](#local-installation)
- [Available Scripts](#Available-Scripts)
  - [yarn dev](#yarn-dev)
  - [yarn build](#yarn-build)
  - [yarn preview](#yarn-preview)
- [Convention](#Convention)

## Embed Treege anywhere

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
    "attributes": {
      "depth": 0,
      "label": "Age",
      "type": "number",
      "isRoot": true,
      "isLeaf": true
    },
    "children": [],
    "name": "age"
  }

  setTimeout(() => {
    iframe.contentWindow.postMessage({ source: "treege", tree, type: "setTree" }, "*");
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

## Types

Tree data that can be provided

``` typescript
type TreeNodeAttributes = TreeNodeField | TreeNodeValues;
```

``` typescript
interface TreeNode {
  name: string;
  attributes: TreeNodeAttributes;
  children: TreeNode[];
}
```

```typescript
interface TreeNodeField {
  depth: number;
  isDecisionField?: boolean;
  isLeaf?: boolean;
  isRoot?: boolean;
  label: string;
  required?: boolean;
  step?: string;
  type: string;
  value?: never;
}
```

```typescript
interface TreeNodeValues {
  depth: number;
  isDecisionField?: never;
  isLeaf?: boolean;
  isRoot?: never;
  label: string;
  required?: never;
  step?: never;
  type?: never;
  value: string;
}
```

## Generate form from Treege data

Form can be easily generated with the React library [treege-consumer](https://github.com/Tracktor/treege-consumer)

## Features

- 📦 **[React](https://fr.reactjs.org)** - v18+ with Hooks
- ⚡️ **[Vite](https://vitejs.dev)** - Next Generation Frontend Tooling
- 📐 **[ESLint](https://eslint.org)** - Code analyzer
- 🚀 **[Vitest](https://vitest.dev)** - A Vite native unit test framework. It's fast!
- 🛠️ **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro)** - React DOM testing
  utilities
- 💅️ **[CSS Modules](https://github.com/css-modules/css-modules)** - CSS files in which all class names are scoped
  locally

## Local installation

Clone the repository and install dependencies

```console 
yarn install
```

## Available Scripts

In the project directory, you can run:

### `yarn dev`

Runs the app in the development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://vitejs.dev/guide/static-deploy.html) for more information.

### `yarn preview`

Locally preview production build

## Convention

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Versioning](https://semver.org)
- [Conventional Commits](https://www.conventionalcommits.org)
