import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { APIClient } from "../helpers/api_helper";

import {
  signUp 
} from "../helpers/url_helper";

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
     const response = await APIClient({
            Uri: signUp,
            Method: "POST",
            // body: JSON.stringify({ email, password }),
            data: {
              email: email,
              password: password,
              name:name
             
          }
        });
        if (!response.data.success) {
          setError(response.data.msg);
        }else{
          navigate('/signin');

        }
   
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#9E1920] to-[#F98C2D]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-[#F98C2D]">Create Your Account</h2>
        <p className="mt-2 text-center text-gray-500">Join us by creating a new account</p>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[#9E1920]">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 mt-1 border border-[#F98C2D] rounded-lg focus:ring-2 focus:ring-[#F98C2D]"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-[#9E1920]">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 mt-1 border border-[#F98C2D] rounded-lg focus:ring-2 focus:ring-[#F98C2D]"
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
                className="w-full px-4 py-2 mt-1 border border-[#F98C2D] rounded-lg focus:ring-2 focus:ring-[#F98C2D]"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-[#9E1920]">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 mt-1 border border-[#F98C2D] rounded-lg focus:ring-2 focus:ring-[#F98C2D]"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-[#F98C2D] rounded-lg hover:bg-[#f07d26] transition-colors"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/signin" className="text-[#9E1920] hover:underline">Sign in here</a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
