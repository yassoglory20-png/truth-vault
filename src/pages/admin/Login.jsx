import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginWithEmail, loginWithGoogle, registerWithEmail } from '@services/auth';
import { useToast } from '@hooks/useToast';
import { validateEmail, validatePassword } from '@utils/validation';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) { toast.error('Please enter a valid email'); return; }
    if (!validatePassword(formData.password)) { toast.error('Password must be at least 8 characters'); return; }
    if (isRegister && formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      if (isRegister) { await registerWithEmail(formData.email, formData.password, formData.name); toast.success('Account created successfully'); }
      else { await loginWithEmail(formData.email, formData.password); toast.success('Welcome back!'); }
      navigate('/admin');
    } catch (err) { toast.error(err.message || 'Authentication failed'); }
    finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try { await loginWithGoogle(); toast.success('Welcome!'); navigate('/admin'); }
    catch (err) { toast.error(err.message || 'Google login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-vault-50 dark:bg-vault-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-vault-900 dark:text-white">{isRegister ? 'Create Account' : 'Admin Login'}</h1>
          <p className="text-vault-600 dark:text-vault-400 mt-1">{isRegister ? 'Join Truth Vault' : 'Sign in to your account'}</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && <div><label className="label" htmlFor="auth-name">Full Name</label><input id="auth-name" type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="input" required={isRegister} maxLength={100} /></div>}
            <div><label className="label" htmlFor="auth-email">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-vault-400" /><input id="auth-email" type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="input pl-10" required maxLength={200} /></div></div>
            <div><label className="label" htmlFor="auth-password">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-vault-400" /><input id="auth-password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))} className="input pl-10 pr-10" required minLength={8} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-vault-400 hover:text-vault-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
            {isRegister && <div><label className="label" htmlFor="auth-confirm">Confirm Password</label><input id="auth-confirm" type="password" value={formData.confirmPassword} onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))} className="input" required={isRegister} /></div>}
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}</button>
          </form>
          <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-vault-200 dark:border-vault-700" /></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-vault-800 text-vault-500">Or continue with</span></div></div>
          <button onClick={handleGoogleLogin} disabled={loading} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-vault-300 dark:border-vault-600 rounded-lg text-vault-700 dark:text-vault-300 hover:bg-vault-50 dark:hover:bg-vault-700 transition-colors"><svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>Google</button>
          <p className="mt-6 text-center text-sm text-vault-600 dark:text-vault-400">{isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}<button onClick={() => setIsRegister(!isRegister)} className="text-primary-600 dark:text-primary-400 hover:underline font-medium">{isRegister ? 'Sign in' : 'Create one'}</button></p>
        </div>
      </div>
    </div>
  );
}
