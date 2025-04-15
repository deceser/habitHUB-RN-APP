import { useContext } from 'react';
import { theme } from '../constants/theme';
import { Theme } from '../types';

export const useTheme = (): Theme => {
  // В будущем можно реализовать ThemeContext для поддержки темной темы
  return theme;
};
