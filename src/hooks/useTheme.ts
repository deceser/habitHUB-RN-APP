import { useContext } from 'react';
import { theme } from '../constants/theme';
import { Theme } from '../types';

export const useTheme = (): Theme => {
  // In the future, we can implement ThemeContext for dark theme support
  return theme;
};
