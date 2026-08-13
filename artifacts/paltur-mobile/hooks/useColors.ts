import { useColorScheme } from 'react-native';
import colors from '@/constants/colors';

type ColorPalette = typeof colors.light;

/**
 * Returns the design tokens for the current color scheme.
 *
 * The returned object contains all color tokens for the active palette
 * plus scheme-independent values like `radius`.
 */
export function useColors() {
  const scheme = useColorScheme();
  const palette: ColorPalette = scheme === 'dark' ? colors.dark : colors.light;

  return { ...palette, radius: colors.radius };
}
