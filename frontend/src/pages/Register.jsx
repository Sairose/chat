import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Register({ setUser }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:3000/api/auth/register',
        form,
        { withCredentials: true } // important for cookies
      );
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      nav('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form onSubmit={handle} className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input className="w-full p-2 mb-3 border rounded" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
        <input className="w-full p-2 mb-3 border rounded" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} />
        <input className="w-full p-2 mb-4 border rounded" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Register</button>
        <p className="mt-3 text-sm">Already have an account? <Link className="text-blue-600" to="/login">Login</Link></p>
      </form>
    </div>
  );
}
