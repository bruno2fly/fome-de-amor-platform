const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const expoFontPath = path.resolve(__dirname, 'node_modules/expo-font');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'expo-font' || moduleName.startsWith('expo-font/')) {
    const subpath = moduleName.startsWith('expo-font/')
      ? moduleName.slice('expo-font/'.length)
      : '';
    const resolved = subpath
      ? path.join(expoFontPath, subpath)
      : expoFontPath;
    return context.resolveRequest(
      { ...context, resolveRequest: undefined },
      resolved,
      platform
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
