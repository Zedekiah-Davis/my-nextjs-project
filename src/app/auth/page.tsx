'use client';

import { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';  // Hook to track auth state
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [user] = useAuthState(auth);  // Firebase auth state
  const router = useRouter();

  // Redirect to home if user is already signed in
  useEffect(() => {
    if (user) {
      router.push('/to-do-list'); // Redirect to home page if user is logged in
    }
  }, [user, router]);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('User registered successfully!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert('User logged in successfully!');
      }
      setEmail('');
      setPassword('');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">
          {isRegistering ? 'Sign Up' : 'Sign In'}
        </h1>
        <form onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
          />
          <button
            type="submit"
            className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
          >
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full p-3 mt-4 bg-gray-700 rounded text-white hover:bg-gray-600"
        >
          {isRegistering
            ? 'Already have an account? Sign In'
            : 'Create an Account'}
        </button>
      </div>
    </div>
  );
};

export default Auth;
