import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { val } from "../validation";

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { name: string; email: string; role: string }, token: string) => void;
  onSwitchToRegister?: () => void;
}

const LoginModal = ({ isOpen, onClose, onLogin, onSwitchToRegister }: LoginModalProps) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    const errs: Record<string, string> = {};
    const emailErr = val.email(data.email);
    if (emailErr) errs.email = emailErr;
    if (!data.password) errs.password = 'Password is required';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message || "Login failed");
        return;
      }
      onLogin(result.user, result.token);
      form.reset();
      onClose();
    } catch {
      toast.error("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const errClass = (key: string) => errors[key] ? 'm-input-error' : '';

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <h2 className="modal-title">Welcome Back</h2>
        <p className="modal-subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="m-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com" required className={errClass('email')} />
            {errors.email && <span className="m-field-error">{errors.email}</span>}
          </div>
          <div className="m-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter your password" required className={errClass('password')} />
            {errors.password && <span className="m-field-error">{errors.password}</span>}
          </div>
          <button type="submit" className="m-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {onSwitchToRegister && (
          <p className="modal-switch">
            Don't have an account?{" "}
            <button onClick={onSwitchToRegister} className="modal-switch-btn">Create one</button>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
