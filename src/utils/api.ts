type Headers = {
  set: (name: string, value: string) => void;
  get: (name: string) => string | null;
};

let authErrorHandler: (() => void) | null = null;

export const setAuthErrorHandler = (handler: () => void) => {
  authErrorHandler = handler;
};

export const handleAuthError = () => {
  if (authErrorHandler) {
    authErrorHandler();
  }
};

/**
 * Prepares headers for API requests by adding the authentication token if available
 * @param headers - The headers object to modify
 * @param api - The BaseQueryApi object
 * @returns The modified headers object
 */
export const prepareAuthHeaders = (headers: Headers) => {
  // Get the token from localStorage
  const token = localStorage.getItem("auth_token");

  // If we have a token, add it to the headers
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
};
