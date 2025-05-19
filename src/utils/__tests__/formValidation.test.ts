
import { describe, it, expect } from 'vitest';
import { 
  validateEmail, 
  validatePassword, 
  isNetworkError, 
  formatAuthError 
} from '../formValidation';

describe('Form Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('user@example.com').valid).toBe(true);
      expect(validateEmail('user.name@example.co.uk').valid).toBe(true);
      expect(validateEmail('user+tag@example.org').valid).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('user@').valid).toBe(false);
      expect(validateEmail('user@example').valid).toBe(false);
      expect(validateEmail('user.example.com').valid).toBe(false);
      expect(validateEmail('@example.com').valid).toBe(false);
      expect(validateEmail('user@.com').valid).toBe(false);
      expect(validateEmail('').valid).toBe(false);
    });

    it('should provide appropriate error messages', () => {
      expect(validateEmail('invalid').message).toContain('valid email');
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      expect(validatePassword('Password123!').valid).toBe(true);
      expect(validatePassword('Complex@Pass2023').valid).toBe(true);
      expect(validatePassword('1234!abcDEF').valid).toBe(true);
    });

    it('should reject weak passwords', () => {
      // Too short
      expect(validatePassword('Pass1!').valid).toBe(false);
      // No numbers
      expect(validatePassword('Password!').valid).toBe(false);
      // No special characters
      expect(validatePassword('Password123').valid).toBe(false);
      // Empty
      expect(validatePassword('').valid).toBe(false);
    });

    it('should provide specific error messages', () => {
      expect(validatePassword('short').message).toContain('8 characters');
      expect(validatePassword('Password').message).toContain('number');
      expect(validatePassword('Password123').message).toContain('special character');
    });
  });

  describe('isNetworkError', () => {
    it('should detect network errors', () => {
      expect(isNetworkError({ message: 'network error' })).toBe(true);
      expect(isNetworkError({ message: 'connection failed' })).toBe(true);
      expect(isNetworkError({ message: 'offline mode' })).toBe(true);
    });

    it('should not report other errors as network errors', () => {
      expect(isNetworkError({ message: 'invalid password' })).toBe(false);
      expect(isNetworkError({ message: 'unauthorized' })).toBe(false);
      expect(isNetworkError({ message: 'not found' })).toBe(false);
    });
  });

  describe('formatAuthError', () => {
    it('should format known auth errors', () => {
      expect(formatAuthError({ message: 'Invalid login credentials' }))
        .toContain('Invalid email or password');
      
      expect(formatAuthError({ message: 'email already registered' }))
        .toContain('already registered');

      expect(formatAuthError({ message: 'rate limit' }))
        .toContain('Too many attempts');
    });

    it('should handle network errors', () => {
      expect(formatAuthError({ message: 'network error' }))
        .toContain('No internet connection');
    });

    it('should pass through unknown errors', () => {
      const errorMsg = 'Unknown authentication error';
      expect(formatAuthError({ message: errorMsg })).toBe(errorMsg);
    });

    it('should handle undefined errors', () => {
      expect(formatAuthError(undefined)).toContain('unexpected error');
      expect(formatAuthError(null)).toContain('unexpected error');
      expect(formatAuthError({})).toContain('unexpected error');
    });
  });
});
