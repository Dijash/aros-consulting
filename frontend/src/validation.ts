const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s\-\+\(\)]{7,20}$/;

export const val = {
  name: (v: string): string | null =>
    !v.trim() ? 'Name is required' :
    v.trim().length < 2 ? 'Name must be at least 2 characters' :
    null,

  email: (v: string): string | null =>
    !v.trim() ? 'Email is required' :
    !EMAIL_RE.test(v.trim()) ? 'Enter a valid email address' :
    null,

  password: (v: string): string | null =>
    !v ? 'Password is required' :
    v.length < 6 ? 'Password must be at least 6 characters' :
    null,

  confirmPassword: (pw: string, confirm: string): string | null =>
    !confirm ? 'Please confirm your password' :
    pw !== confirm ? 'Passwords do not match' :
    null,

  phone: (v: string): string | null =>
    !v.trim() ? null :
    !PHONE_RE.test(v.trim()) ? 'Enter a valid phone number' :
    null,

  quote: (v: string): string | null =>
    !v.trim() ? 'Please share your experience' :
    v.trim().length < 10 ? 'Please write at least 10 characters' :
    null,
};
