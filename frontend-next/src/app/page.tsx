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
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
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
        const res = await fetch('/backend/api/index/', {
          headers: { 'Authorization': `Bearer ${token}` },
          cache: 'no-store'
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.permissions) {
            setUsername(data.permissions.username);
            setRole(data.permissions.is_superuser ? 'Admin' : 'User');
            localStorage.setItem('username', data.permissions.username);
          }
          if (data.analysis_actions) {
            setActions(data.analysis_actions);
          }
        } else if (res.status === 401 || res.status === 403) {
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
        await fetch('/backend/api/auth/logout/', {
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
    setLoadingAnalysis(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/backend/analyze/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action_id: actionId,
          date: date,
          Web_Commerce: webCommerce
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === 'success') {
          setAnalysisData(result.data);
        } else {
          console.error("API error:", result);
        }
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
          onStart={() => console.log('Start analysis')}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f7f9fa]">
        <Header 
          username={username} 
          role={role} 
          onLogout={handleLogout}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        <div className="flex-1 overflow-y-auto pb-10">
          <AnalysisActions 
            actions={actions} 
            onActionSelect={(id, date, wc) => handleAnalyze(id, date, wc)} 
            loading={loadingAnalysis}
          />
          {analysisData && (
            <>
              <Charts data={analysisData} />
              <KpiCards data={analysisData.table} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
