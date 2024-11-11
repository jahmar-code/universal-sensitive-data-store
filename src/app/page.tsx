"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // placeholder for API calls
import { useForm } from 'react-hook-form';
import Link from 'next/link';

interface LoginFormInputs {
  username: string;
  password: string;
}

export default function page() {
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async (data: LoginFormInputs) => {
    
    // placeholder for API call
    try {
      // await axios.post('/api/login', data);
      // on success...
      router.push('/Dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    //
    <div className="h-fit flex items-center justify-center mt-40">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
        <h2 className="text-4xl mb-6">Login</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <div className="mb-4">
          <label className="block mb-1">Username</label>
          <input
            {...register('username', { required: true })}
            className="w-full border px-3 py-2 text-black rounded-md"
            type="text"
            placeholder="Enter your username"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Password</label>
          <input
            {...register('password', { required: true })}
            className="w-full border px-3 py-2 text-black rounded-md"
            type="password"
            placeholder="Enter your password"
          />
        </div>
        <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-400">Login</button>
        <div className="text-center mt-6 grid">
          <span>Don't have an account? </span>
          <Link href="/Register">
            <button className="text-blue-500 hover:text-blue-400">Register</button>
          </Link>
        </div>
      </form>
    </div>
  );
}
