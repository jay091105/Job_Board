import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null,
        submit: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      if (response.data.token) {
        const user = await login(response.data.token);
        
        // Immediate navigation based on role
        if (user.role === 'employer') {
          navigate('/employer/dashboard', { replace: true });
        } else {
          navigate('/candidate/dashboard', { replace: true });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.data?.errors) {
        const validationErrors = {};
        error.response.data.errors.forEach(err => {
          validationErrors[err.param] = err.msg;
        });
        setErrors(validationErrors);
      } else {
        setErrors({ 
          submit: error.response?.data?.message || 'Login failed. Please check your credentials and try again.' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-700 via-primary-200 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white/80 rounded-2xl shadow-xl border-2 border-primary-300 p-6 sm:p-8 hover:border-primary-500 hover:shadow-glow transition-all duration-300">
          <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
          
          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border-2 border-primary-300 rounded-lg ${errors.email ? 'border-red-500' : ''}`}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 border-2 border-primary-300 rounded-lg ${errors.password ? 'border-red-500' : ''}`}
                required
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition duration-300 shadow-md disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-700 hover:underline">
                Register
              </Link>
            </p>
            <p className="mt-2">
              <Link to="/forgot-password" className="text-primary-700 hover:underline">
                Forgot Password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 