import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Film } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please fill in both email and password.');
            return;
        }
        try {
            setIsSubmitting(true);
            await login(email, password);
            navigate('/');
        }
        catch (err) {
            setError(err.response?.data?.message ||
                err.response?.data?.error ||
                'Failed to login. Please check your credentials or backend server status.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (<div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-[#131927]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-purple-950/20 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 items-center justify-center text-white shadow-lg shadow-purple-600/30 mb-2">
            <Film className="w-6 h-6 stroke-[2.5]"/>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Welcome back to CineAddict</h2>
          <p className="text-xs text-purple-200/80">Sign in to access your personal watchlists and favorites</p>
        </div>

        {error && (<div className="bg-red-950/80 border border-red-500/40 rounded-2xl p-3.5 flex items-start gap-3 text-red-300 text-xs leading-relaxed">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5"/>
            <span>{error}</span>
          </div>)}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5"/>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@example.com" className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"/>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5"/>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"/>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 text-sm border border-purple-400/30">
            {isSubmitting ? 'Signing in...' : 'Sign In'}
            {!isSubmitting && <LogIn className="w-4 h-4"/>}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-white/10 text-xs text-gray-400">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold underline">
            Register here
          </Link>
        </div>
      </div>
    </div>);
};
export default Login;
