import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const err = isLogin ? await signIn(email, password) : await signUp(email, password);
    if (err) setError(err);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6 bg-dark">
      <img src="/large_celer_png.png" alt="Celer" className="w-20 h-20 sm:w-32 sm:h-32 mb-6 sm:mb-8 object-contain" />
      <p className="text-[#444] text-xs mb-10 sm:mb-14 tracking-widest uppercase">Track · Record · Share</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-2 sm:gap-3">
        <input
          className="bg-[#111] border border-[#222] px-4 py-3 sm:py-4 text-white placeholder-[#444] focus:outline-none focus:border-brand text-sm rounded"
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required
        />
        <input
          className="bg-[#111] border border-[#222] px-4 py-3 sm:py-4 text-white placeholder-[#444] focus:outline-none focus:border-brand text-sm rounded"
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required
        />
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-brand text-black font-bold py-3 sm:py-4 mt-2 sm:mt-1 text-sm tracking-widest uppercase disabled:opacity-50 rounded"
        >
          {loading ? '...' : isLogin ? 'Log In' : 'Sign Up'}
        </button>
        <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }}
          className="text-[#444] text-xs mt-2 tracking-wide">
          {isLogin ? "No account? Sign Up" : 'Have an account? Log In'}
        </button>
      </form>
    </div>
  );
}
