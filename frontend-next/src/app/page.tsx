"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import AnalysisActions from '@/components/AnalysisActions';
import Charts from '@/components/Charts';
import KpiCards from '@/components/KpiCards';

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [username, setUsername] = useState('User');
  const [role, setRole] = useState('User');
  const [actions, setActions] = useState([]);
  const [currentActionId, setCurrentActionId] = useState<string>('top-center');
  const [currentDates, setCurrentDates] = useState<any[]>([{ startDate: '2025-01-01', endDate: '2025-04-30' }]);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('username');
      if (storedUser) setUsername(storedUser);

      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/index/`, {
          headers: { 'Authorization': `Bearer ${token}` },
          cache: 'no-store'
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && !res.redirected && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.permissions) {
            setUsername(data.permissions.username);
            setRole(data.permissions.is_superuser ? 'Admin' : 'User');
            localStorage.setItem('username', data.permissions.username);
          }
          if (data.analysis_actions) {
            setActions(data.analysis_actions);
          }
        } else {
          // Token expired or server returned non-JSON redirect
          localStorage.removeItem('access_token');
          router.push('/login');
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        await fetch(`${API_BASE}/api/auth/logout/`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  const handleAnalyze = async (actionId: string, date: any[], webCommerce: string) => {
    setCurrentActionId(actionId);
    setCurrentDates(date);
    setLoadingAnalysis(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/analyze/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action_id: actionId,
          date: date,
          Web_Commerce: Array.isArray(webCommerce) ? webCommerce : [webCommerce || '', webCommerce || '']
        })
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && !res.redirected && contentType.includes('application/json')) {
        const result = await res.json();
        if (result.status === 'success') {
          setAnalysisData(result.data);
        } else {
          console.error("API error:", result);
        }
      } else if (res.redirected || res.status === 401 || res.status === 403) {
        localStorage.removeItem('access_token');
        router.push('/login');
      }
    } catch (error) {
      console.error("Failed to analyze", error);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar Area */}
      <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-full lg:w-96' : 'w-0 overflow-hidden'}`}>
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onFilesSelected={(files) => console.log('Files selected:', files)}
          onStart={() => {
            handleAnalyze('top-center', [{ startDate: '2025-01-01', endDate: '2025-04-30' }], '');
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f7f9fa]">
        <Header
          username={username}
          role={role}
          onLogout={handleLogout}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="flex-1 overflow-y-auto pb-10">
          <AnalysisActions
            actions={actions}
            onActionSelect={(id, date, wc) => handleAnalyze(id, date, wc || '')}
            loading={loadingAnalysis}
          />
          {analysisData && (
            <>
              <Charts data={analysisData} actionId={currentActionId} dateRanges={currentDates} />
              <KpiCards data={analysisData.table} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
