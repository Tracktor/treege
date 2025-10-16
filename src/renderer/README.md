# Treege Renderer Architecture

This directory contains the runtime renderer for executing decision trees.

## Structure

```
renderer/
├── features/
│   └── TreegeRenderer/
│       ├── web/                    # Web-specific implementation (React DOM)
│       │   └── TreegeRenderer.tsx
│       ├── native/                 # React Native implementation (TODO)
│       │   └── TreegeRenderer.tsx
│       ├── useTreegeRenderer.ts    # Platform-agnostic hook
│       └── index.ts                # Exports (web by default)
│
├── components/
│   ├── web/                        # Web UI components (React DOM)
│   │   ├── DefaultInputs.tsx
│   │   ├── DefaultFormWrapper.tsx
│   │   ├── DefaultGroup.tsx
│   │   ├── DefaultSubmitButton.tsx
│   │   └── DefaultUI.tsx
│   └── native/                     # React Native UI components (TODO)
│       ├── DefaultInputs.tsx
│       ├── DefaultFormWrapper.tsx
│       ├── DefaultGroup.tsx
│       ├── DefaultSubmitButton.tsx
│       └── DefaultUI.tsx
│
├── hooks/                          # Platform-agnostic hooks
├── utils/                          # Platform-agnostic utilities
│   ├── form.ts
│   ├── nodeVisibility.ts
│   └── conditionEvaluator.ts
│
├── context/                        # Platform-agnostic contexts
│   └── TreegeRendererContext.tsx
│
└── types/                          # TypeScript types
    └── renderer.ts
```

## Platform-Agnostic (Shared)

These can be used for both web and React Native:

- **Hooks**: `useTreegeRenderer` - Pure state logic (no JSX)
- **Utils**: All utility functions (`form.ts`, `nodeVisibility.ts`, etc.)
- **Context**: React contexts
- **Types**: TypeScript type definitions

## Platform-Specific

### Web (React DOM)
Located in `components/web/` and `features/TreegeRenderer/web/`

Uses standard HTML elements:
- `<input>`, `<select>`, `<textarea>`
- `<form>`, `<button>`, `<div>`

### React Native (TODO)
Located in `components/native/` and `features/TreegeRenderer/native/`

Will use React Native components:
- `TextInput`, `Picker`, `Switch`
- `View`, `Text`, `Pressable`

## Usage

### Web (default)
```tsx
import { TreegeRenderer } from 'treege/renderer';
```

### React Native (future)
```tsx
import { TreegeRenderer } from 'treege/renderer/features/TreegeRenderer/native/TreegeRenderer';
import { useTreegeRenderer } from 'treege/renderer';
```

## Implementation Checklist for React Native

- [ ] Implement `TreegeRenderer` component using React Native components
- [ ] Implement all input types in `DefaultInputs.tsx`
- [ ] Implement `DefaultFormWrapper` with proper form handling
- [ ] Implement `DefaultGroup` for grouping fields
- [ ] Implement `DefaultSubmitButton` using Pressable
- [ ] Implement UI components (Title, Description, Divider, etc.)
- [ ] Test with sample decision trees
- [ ] Update exports in main `index.ts` to support both platforms
