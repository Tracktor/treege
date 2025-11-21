# Treege React Native Example

This is a test application for the Treege React Native renderer.

## Getting Started

From the root of the monorepo:

```bash
# Start the Expo development server
yarn example:native

# Or from this directory
bun start
```

Then:
- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Press `w` to open in web browser
- Scan the QR code with Expo Go app on your phone

## Features Tested

This example tests all vanilla React Native components:

- ✅ Text Input
- ✅ Number Input
- ✅ Password Input (with show/hide toggle)
- ✅ Textarea
- ✅ Switch
- ✅ Select (with modal picker)
- ✅ Radio buttons
- ✅ Checkbox (single and multiple)
- ✅ Hidden Input

## Development

This app imports directly from the Treege source files (`../../src/renderer-native`), so any changes you make to the components will be reflected immediately with hot reload.

The path aliases are configured in:
- `tsconfig.json` - For TypeScript
- `babel.config.js` - For Metro bundler runtime
