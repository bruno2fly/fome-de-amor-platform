import { Image, StyleSheet } from 'react-native';

type Size = 'sm' | 'md' | 'lg';

interface Props {
  size?: Size;
  inverted?: boolean; // kept for API compat, logo works on both bg
}

const logoAsset = require('../../assets/logo-official.jpg');

export function LogoBadge({ size = 'md' }: Props) {
  const height = size === 'sm' ? 32 : size === 'lg' ? 64 : 48;
  const width = height * 2.6;

  return <Image source={logoAsset} style={[styles.logo, { width, height }]} resizeMode="contain" />;
}

const styles = StyleSheet.create({
  logo: {
    // transparent background preserved
  }
});
