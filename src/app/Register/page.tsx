"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // placeholder for API calls
import { useForm } from 'react-hook-form';
import Link from 'next/link';

interface RegisterFormInputs {
  username: string;
  password: string;
  confirmPassword: string;
}

export default function page() {
  const { register, handleSubmit, watch } = useForm<RegisterFormInputs>();
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async (data: RegisterFormInputs) => {
    // validate that password and confirmPassword match
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // placeholder for API call
    try {
      // await axios.post('/api/register', { username: data.username, password: data.password });
      // On success:
      router.push('/Dashboard');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center mt-40">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
        <h2 className="text-4xl mb-6">Register</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <div className="mb-4">
          <label className="block mb-1">Username</label>
          <input
            {...register('username', { required: true })}
            className="w-full border px-3 py-2 text-black rounded-md"
            type="text"
            placeholder="Choose a username"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            {...register('password', { required: true, minLength: 8 })}
            className="w-full border px-3 py-2 text-black rounded-md"
            type="password"
            placeholder="Create a password"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Confirm Password</label>
          <input
            {...register('confirmPassword', { required: true })}
            className="w-full border px-3 py-2 text-black rounded-md"
            type="password"
            placeholder="Confirm your password"
          />
        </div>
        <button className="w-full bg-green-500 text-white py-2 mb-4 rounded-md hover:bg-green-400">Register</button>
        <div className="text-center mt-6 grid">
          <span>Already have an account? </span>
          <Link href="/">
            <button className="text-blue-500 hover:text-blue-400">Login</button>
          </Link>
        </div>
      </form>
    </div>
  );
}
