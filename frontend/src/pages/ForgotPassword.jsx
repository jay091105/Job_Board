import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/forgotpassword', { email });
      setSuccess('If an account with that email exists, a password reset link has been sent.');
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-700 via-primary-200 to-white py-12">
      <div className="max-w-md mx-auto bg-white/80 rounded-2xl shadow-xl border-2 border-primary-300 p-6 sm:p-8 hover:border-primary-500 hover:shadow-glow transition-all duration-300">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 border-2 border-primary-300 rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition duration-300 shadow-md disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 