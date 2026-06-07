import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { val } from "../validation";

const API = import.meta.env.VITE_API_URL || 'https://aros-consulting-fofj.vercel.app';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (user: { name: string; email: string; role: string }, token: string) => void;
  onSwitchToLogin: () => void;
}

const RegisterModal = ({ isOpen, onClose, onRegister, onSwitchToLogin }: RegisterModalProps) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    const errs: Record<string, string> = {};
    const nameErr = val.name(data.name);
    if (nameErr) errs.name = nameErr;
    const emailErr = val.email(data.email);
    if (emailErr) errs.email = emailErr;
    const pwErr = val.password(data.password);
    if (pwErr) errs.password = pwErr;
    const cfErr = val.confirmPassword(data.password, data.confirm);
    if (cfErr) errs.confirm = cfErr;
    const phoneErr = val.phone(data.phone || '');
    if (phoneErr) errs.phone = phoneErr;
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const response = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password, phone: data.phone || '' }),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message || "Registration failed");
        return;
      }
      onRegister(result.user, result.token);
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

        <h2 className="modal-title">Create Account</h2>
        <p className="modal-subtitle">Get started with Aros Octa Consulting</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="m-group">
            <label>Full Name</label>
            <input type="text" name="name" placeholder="Your full name" required className={errClass('name')} />
            {errors.name && <span className="m-field-error">{errors.name}</span>}
          </div>
          <div className="m-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com" required className={errClass('email')} />
            {errors.email && <span className="m-field-error">{errors.email}</span>}
          </div>
          <div className="m-group">
            <label>Phone (optional)</label>
            <input type="tel" name="phone" placeholder="+977 98XXXXXXXX" className={errClass('phone')} />
            {errors.phone && <span className="m-field-error">{errors.phone}</span>}
          </div>
          <div className="m-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Create a password (min 6 chars)" minLength={6} required className={errClass('password')} />
            {errors.password && <span className="m-field-error">{errors.password}</span>}
          </div>
          <div className="m-group">
            <label>Confirm Password</label>
            <input type="password" name="confirm" placeholder="Confirm your password" minLength={6} required className={errClass('confirm')} />
            {errors.confirm && <span className="m-field-error">{errors.confirm}</span>}
          </div>
          <button type="submit" className="m-btn" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="modal-switch">
          Already have an account?{" "}
          <button onClick={onSwitchToLogin} className="modal-switch-btn">Sign In</button>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;
