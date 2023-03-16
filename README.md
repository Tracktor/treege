<div align="center">
  <img alt="Treege" src="https://user-images.githubusercontent.com/108873902/189673125-5d1fdaf3-82d1-486f-bb16-01b0554bd4f1.png" style="padding: 20px;" width="auto" height="100" />
  <p><strong>Treege is a tools for decision tree generator</strong></p>
</div>

[![npm version](https://badge.fury.io/js/treege.svg)](https://badge.fury.io/js/treege)


<video src="https://user-images.githubusercontent.com/108873902/184317603-61ceafc6-a326-49b2-b0de-ffda9cf9c75e.mov"></video>

- [Features](#Features)
- [Installation](#Installation)
- [Usage](#Usage)
  - [Options](#Options)
- [Generate form from Treege data](#Generate-form-from-Treege-data)
- [Local installation](#local-installation)
- [Available Scripts](#Available-Scripts)
    - [yarn dev](#yarn-dev)
    - [yarn build](#yarn-build)
    - [yarn preview](#yarn-preview)
- [Convention](#Convention)

## Features

- 📦 **[React](https://fr.reactjs.org)** - v18+ with Hooks
- ⚡️ **[Vite](https://vitejs.dev)** - Next Generation Frontend Tooling
- 📐 **[ESLint](https://eslint.org)** - Code analyzer
- 🚀 **[Vitest](https://vitest.dev)** - A Vite native unit test framework. It's fast!
- 🛠️ **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro)** - React DOM testing
  utilities
- 🐶 **[Husky](https://typicode.github.io/husky)** - Modern native git hooks made easy

## Installation

```console
yarn add treege
```

## Usage

```typescript jsx
import { Treege } from "treege";

const App = () => {
  return <Treege />;
};

export default App;
```

### Options

| Props         | Type   | Default   | Required | Detail                                                                                        |
|---------------|--------|-----------|----------|-----------------------------------------------------------------------------------------------|
| authToken     | string | undefined | false    | Authentication token                                                                          |
| endPoint      | string | undefined | false    | Endpoint for API communication                                                                |
| initialTreeId | string | undefined | false    | If provided, this will fetch initial tree id. Cannot provided with `initialTree` in same time |
| initialTree   | object | undefined | false    | Initial tree data. Cannot provided with `initialTreeId` in same time                          |

## Generate form from Treege data

Form can be easily generated with the React library [treege-consumer](https://github.com/Tracktor/treege-consumer)

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
