const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

// Get the default Expo config
const config = getDefaultConfig(__dirname);

// Root of the monorepo
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

// Watch all files in the monorepo
config.watchFolders = [workspaceRoot];

// Block React from workspace root to force using local version
config.resolver.blockList = [
  new RegExp(`${workspaceRoot.replace(/[/\\]/g, '[/\\\\]')}/node_modules/react/`),
  new RegExp(`${workspaceRoot.replace(/[/\\]/g, '[/\\\\]')}/node_modules/react-native/`),
];

// Let Metro know where to find source code
// Put local node_modules FIRST to ensure React is resolved from here
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Add custom resolver to handle 'treege/renderer-native' alias
config.resolver.extraNodeModules = {
  '@': path.resolve(workspaceRoot, 'src'),
  '~': workspaceRoot,
  // Force React to be resolved from local node_modules to ensure single instance
  react: path.resolve(projectRoot, 'node_modules/react'),
};

// Add .native.ts support to source extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, 'native.ts', 'native.tsx'];

// Enable symlinks and custom resolution
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle 'treege/renderer-native' import
  if (moduleName === 'treege/renderer-native') {
    return {
      filePath: path.resolve(workspaceRoot, 'src/renderer/index.native.ts'),
      type: 'sourceFile',
    };
  }

  // Use default resolution for everything else (including .native.ts)
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
