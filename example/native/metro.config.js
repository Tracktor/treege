const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

// Get the default Expo config
const config = getDefaultConfig(__dirname);

// Root of the monorepo
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

// Watch all files in the monorepo
config.watchFolders = [workspaceRoot];

// Let Metro know where to find source code (only use root node_modules)
config.resolver.nodeModulesPaths = [
  path.resolve(workspaceRoot, 'node_modules'),
];

// Add custom resolver to handle 'treege/renderer-native' alias and force single React instance
config.resolver.extraNodeModules = {
  '@': path.resolve(workspaceRoot, 'src'),
  '~': workspaceRoot,
  // Force React to be resolved from root to avoid multiple instances
  react: path.resolve(workspaceRoot, 'node_modules/react'),
};

// Add .native.ts support to source extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, 'native.ts', 'native.tsx'];

// Enable symlinks and custom resolution
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle 'treege/renderer-native' import
  if (moduleName === 'treege/renderer-native') {
    return {
      filePath: path.resolve(workspaceRoot, 'src/renderer-native/index.ts'),
      type: 'sourceFile',
    };
  }

  // Use default resolution for everything else (including .native.ts)
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
