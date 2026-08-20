"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/backend/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || 'รหัสผ่านหรือชื่อผู้ใช้ไม่ถูกต้อง');
      }

      const data = await res.json();
      
      // Save token to localStorage for now
      if (data.access) {
        localStorage.setItem('access_token', data.access);
      }
      if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
      }
      if (data.user && data.user.username) {
        localStorage.setItem('username', data.user.username);
      }

      // Redirect to dashboard
      router.push('/');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-500 hover:shadow-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">เข้าสู่ระบบ</h1>
          <p className="text-gray-600">กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl border border-red-200">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700" htmlFor="username">
              ชื่อผู้ใช้
            </label>
            <input 
              type="text" 
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white"
              placeholder="กรอกชื่อผู้ใช้"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700" htmlFor="password">
              รหัสผ่าน
            </label>
            <input 
              type="password" 
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white"
              placeholder="กรอกรหัสผ่าน"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
}
