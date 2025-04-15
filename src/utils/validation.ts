/**
 * Utilities for form field validation
 */

// Email validation using regular expression
export const isValidEmail = (email: string): boolean => {
  return /\S+@\S+\.\S+/.test(email);
};

// Password validation (minimum length)
export const isValidPassword = (password: string, minLength: number = 6): boolean => {
  return password.length >= minLength;
};

// Check if passwords match
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * Generic function for field validation
 * @param value Field value
 * @param validators Array of validator functions
 * @returns Validation result (success/failure)
 */
export const validateField = (
  value: string,
  validators: ((value: string) => boolean)[],
): boolean => {
  for (const validator of validators) {
    if (!validator(value)) {
      return false;
    }
  }
  return true;
};
