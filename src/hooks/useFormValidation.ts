import { useState } from 'react';
import { isValidEmail } from '../utils/validation';

interface ValidationRules {
  required?: boolean;
  email?: boolean;
  minLength?: number;
  match?: string;
}

interface FieldErrors {
  [key: string]: string;
}

interface ValidateFormOptions {
  scrollToTop?: () => void;
}

/**
 * Hook for form validation management
 * @returns Methods and states for form validation
 */
export const useFormValidation = () => {
  const [errors, setErrors] = useState<FieldErrors>({});

  /**
   * Validates all fields in a form according to specified rules
   * @param fields Form fields object
   * @param rules Validation rules for each field
   * @param errorMessages Error messages for each validation rule
   * @param options Additional options (scrolling, etc.)
   * @returns Validation result (valid/invalid)
   */
  const validateForm = (
    fields: { [key: string]: string },
    rules: { [key: string]: ValidationRules },
    errorMessages: { [key: string]: { [rule: string]: string } },
    options?: ValidateFormOptions,
  ): boolean => {
    const newErrors: FieldErrors = {};
    let hasErrors = false;

    // Check each field according to its rules
    Object.entries(fields).forEach(([fieldName, value]) => {
      const fieldRules = rules[fieldName];
      if (!fieldRules) return;

      // Required field check
      if (fieldRules.required && !value.trim()) {
        newErrors[fieldName] = errorMessages[fieldName]?.required || 'This field is required';
        hasErrors = true;
      }
      // Email validation
      else if (fieldRules.email && value && !isValidEmail(value)) {
        newErrors[fieldName] = errorMessages[fieldName]?.email || 'Invalid email format';
        hasErrors = true;
      }
      // Minimum length validation
      else if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
        newErrors[fieldName] =
          errorMessages[fieldName]?.minLength || `Minimum length is ${fieldRules.minLength}`;
        hasErrors = true;
      }
      // Matching check (for passwords)
      else if (fieldRules.match && fields[fieldRules.match] !== value) {
        newErrors[fieldName] = errorMessages[fieldName]?.match || 'Fields do not match';
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    // If there are errors and a scroll function is specified, call it
    if (hasErrors && options?.scrollToTop) {
      setTimeout(options.scrollToTop, 200);
    }

    return !hasErrors;
  };

  /**
   * Clears error for a specific field
   * @param fieldName Field name
   */
  const clearError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  return {
    errors,
    validateForm,
    clearError,
    setErrors, // May be useful for setting errors externally
  };
};
