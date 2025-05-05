/**
 * Constants for text content of application screens
 */

// LoginScreen контент
export const loginContent = {
  titleLines: ['Do your', 'tasks', 'quickly', 'and easy'],
  subtitle: 'Your tasks, your rules, our support.',
  buttons: {
    login: 'Login',
    createAccount: 'Create an account',
  },
  dividers: {
    or: 'OR',
  },
};

// Content for the login and password input screen
export const signInContent = {
  title: 'Sign In',
  subtitle: 'Welcome back! Please enter your details',
  fields: {
    email: {
      placeholder: 'Email',
      errors: {
        required: 'Email is required',
        invalid: 'Please enter a valid email',
      },
    },
    password: {
      placeholder: 'Password',
      errors: {
        required: 'Password is required',
        short: 'Password must be at least 6 characters',
      },
    },
  },
  buttons: {
    signIn: 'Sign In',
    forgotPassword: 'Forgot password?',
    createAccount: "Don't have an account? Sign up",
  },
  errors: {
    invalidCredentials: 'Invalid email or password',
    serverError: 'Server error. Please try again later',
  },
};

// Sign up screen content
export const signUpContent = {
  title: 'Create Account',
  subtitle: 'Please fill in your details to get started',
  fields: {
    name: {
      placeholder: 'Full Name',
      errors: {
        required: 'Full name is required',
      },
    },
    email: {
      placeholder: 'Email',
      errors: {
        required: 'Email is required',
        invalid: 'Please enter a valid email',
      },
    },
    password: {
      placeholder: 'Password',
      errors: {
        required: 'Password is required',
        short: 'Password must be at least 6 characters',
      },
    },
    confirmPassword: {
      placeholder: 'Confirm Password',
      errors: {
        required: 'Please confirm your password',
        match: 'Passwords do not match',
      },
    },
  },
  buttons: {
    createAccount: 'Create Account',
    haveAccount: 'Already have an account? Login',
  },
  errors: {
    emailExists: 'Email already exists',
    serverError: 'Server error. Please try again later',
  },
};

// Forgot password screen content
export const forgotPasswordContent = {
  title: 'Forgot Password',
  subtitle: 'Enter your email to receive password reset instructions',
  fields: {
    email: {
      placeholder: 'Email',
      errors: {
        required: 'Email is required',
        invalid: 'Please enter a valid email',
      },
    },
  },
  buttons: {
    resetPassword: 'Reset Password',
    backToLogin: 'Back to Login',
  },
  success: 'Reset instructions have been sent to your email',
  errors: {
    emailNotFound: 'Email not found',
    serverError: 'Server error. Please try again later',
  },
};

// Home screen content
export const homeContent = {
  emptyState: 'No tasks for this day',
  loading: 'Loading tasks...',
  error: 'Failed to load tasks. Check your connection.',
  filters: {
    all: 'All',
    dailyRoutine: 'Daily Routine',
    studyRoutine: 'Study Routine',
    fitness: 'Fitness',
    work: 'Work',
  },
};

// Constants for other screens can be added below
// export const homeContent = {...};
