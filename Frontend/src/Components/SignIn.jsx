import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { APIClient } from "../helpers/api_helper";

import {
  SingIn 
} from "../helpers/url_helper";
function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await APIClient({
        Uri: SingIn,
        Method: "POST",
        // body: JSON.stringify({ email, password }),
        data: {
          email: email,
          password: password,
         
      }
    });
      const data = await response.data;
      if (!response.data.success) {
        throw new Error(data.msg || 'Login failed');
      }

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('name', response.data.name);

      toast.success('Login successful!');

      navigate(data.isAdmin ? '/dashboard' : '/');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F98C2D]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-[#9E1920]">Welcome Back</h2>
        <p className="mt-2 text-center text-gray-500">Please sign in to your account</p>
        {error && <div className="text-red-500 text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[#9E1920]">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 mt-1 border border-[#9E1920] rounded-lg focus:ring-2 focus:ring-[#9E1920]"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-[#9E1920]">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 mt-1 border border-[#9E1920] rounded-lg focus:ring-2 focus:ring-[#9E1920]"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <a href="#" className="text-sm text-[#9E1920] hover:underline">Forgot Password?</a>
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-[#9E1920] rounded-lg hover:bg-[#8b171c] transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <a href="/signup" className="text-[#F98C2D] hover:underline">Sign up here</a>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
