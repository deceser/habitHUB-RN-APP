export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    error: string;
    success: string;
    gradientStart: string;
    gradientEnd: string;
    facebook: string;
    google: string;
    apple: string;
    loginButton?: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl?: number;
    huge?: number;
  };
  fontSizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl?: number;
    huge?: number;
  };
  fontFamily?: {
    regular: string;
    medium: string;
    light: string;
    bold: string;
  };
}
