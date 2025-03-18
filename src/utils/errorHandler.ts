/**
 * Centralized error handling utility for the application
 * This provides consistent error handling, logging, and user feedback
 */

import { toast } from 'sonner';

// Error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// Error categories
export enum ErrorCategory {
  NETWORK = 'network',
  API = 'api',
  AUTH = 'auth',
  CART = 'cart',
  PAYMENT = 'payment',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown',
}

// Error context interface
interface ErrorContext {
  component?: string;
  action?: string;
  data?: any;
  // Additional properties for specific error contexts
  item?: any;
  itemId?: number;
  quantity?: number;
  result?: any;
}

/**
 * Handle application errors with consistent logging and user feedback
 */
export const errorHandler = {
  /**
   * Handle an error with appropriate logging and user feedback
   */
  handleError(
    error: unknown,
    severity: ErrorSeverity = ErrorSeverity.ERROR,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    context: ErrorContext = {},
    showToast: boolean = true
  ) {
    // Extract error message
    const errorMessage = error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'An unknown error occurred';

    // Create structured error object for logging
    const errorLog = {
      timestamp: new Date().toISOString(),
      severity,
      category,
      message: errorMessage,
      context,
      stack: error instanceof Error ? error.stack : undefined,
    };

    // Log based on severity
    switch (severity) {
      case ErrorSeverity.INFO:
        console.info('Application info:', errorLog);
        break;
      case ErrorSeverity.WARNING:
        console.warn('Application warning:', errorLog);
        break;
      case ErrorSeverity.ERROR:
        console.error('Application error:', errorLog);
        break;
      case ErrorSeverity.CRITICAL:
        console.error('CRITICAL APPLICATION ERROR:', errorLog);
        break;
    }

    // Show toast notification if enabled
    if (showToast) {
      const userMessage = this.getUserFriendlyMessage(errorMessage, category);

      switch (severity) {
        case ErrorSeverity.INFO:
          toast.info(userMessage);
          break;
        case ErrorSeverity.WARNING:
          toast.warning(userMessage);
          break;
        case ErrorSeverity.ERROR:
        case ErrorSeverity.CRITICAL:
          toast.error(userMessage);
          break;
      }
    }

    return errorLog;
  },

  /**
   * Get a user-friendly error message based on the error and category
   */
  getUserFriendlyMessage(errorMessage: string, category: ErrorCategory): string {
    // Default messages by category
    const defaultMessages: Record<ErrorCategory, string> = {
      [ErrorCategory.NETWORK]: 'Network connection issue. Please check your internet connection.',
      [ErrorCategory.API]: 'Server communication error. Please try again later.',
      [ErrorCategory.AUTH]: 'Authentication error. Please try logging in again.',
      [ErrorCategory.CART]: 'Shopping cart error. Your cart items may not be up to date.',
      [ErrorCategory.PAYMENT]: 'Payment processing error. No charges were made.',
      [ErrorCategory.VALIDATION]: 'Please check your information and try again.',
      [ErrorCategory.UNKNOWN]: 'An unexpected error occurred. Please try again.',
    };

    // If the error message is technical or empty, use the default message
    if (!errorMessage || errorMessage.includes('TypeError') || errorMessage.includes('undefined')) {
      return defaultMessages[category];
    }

    return errorMessage;
  },

  /**
   * Handle API errors specifically
   */
  handleApiError(error: unknown, component: string, action: string, data?: any, showToast: boolean = true) {
    // Check if it's a network error
    if (error instanceof Error && error.message.includes('Network Error')) {
      return this.handleError(
        error,
        ErrorSeverity.ERROR,
        ErrorCategory.NETWORK,
        { component, action, data },
        showToast
      );
    }

    // Handle API errors
    return this.handleError(
      error,
      ErrorSeverity.ERROR,
      ErrorCategory.API,
      { component, action, data },
      showToast
    );
  },

  /**
   * Handle cart-specific errors
   */
  handleCartError(error: unknown, action: string, data?: any, showToast: boolean = true) {
    return this.handleError(
      error,
      ErrorSeverity.ERROR,
      ErrorCategory.CART,
      { component: 'Cart', action, data },
      showToast
    );
  },
};

export default errorHandler; 