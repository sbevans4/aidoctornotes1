
// Form validation utilities for authentication and other forms

// Password validation schema: at least 8 chars, 1 number, 1 special character
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long" };
  }
  
  if (!/\d/.test(password)) {
    return { valid: false, message: "Password must contain at least one number" };
  }
  
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one special character" };
  }
  
  return { valid: true };
};

// Email validation
export const validateEmail = (email: string): { valid: boolean; message?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Please enter a valid email address" };
  }
  
  return { valid: true };
};

// Network error detection
export const isNetworkError = (error: any): boolean => {
  return !navigator.onLine || 
    (error?.message && (
      error.message.includes("network") || 
      error.message.includes("connection") ||
      error.message.toLowerCase().includes("offline")
    ));
};

// Format error messages to be more user-friendly
export const formatAuthError = (error: any): string => {
  const message = error?.message || "An unexpected error occurred";
  
  if (isNetworkError(error)) {
    return "No internet connection. Please check your network and try again.";
  }
  
  // Map common Supabase/auth error messages to user-friendly versions
  if (message.includes("Invalid login")) {
    return "Invalid email or password. Please try again.";
  }
  
  if (message.includes("email already registered")) {
    return "This email is already registered. Please sign in instead.";
  }
  
  if (message.includes("rate limit")) {
    return "Too many attempts. Please try again later.";
  }
  
  return message;
};
