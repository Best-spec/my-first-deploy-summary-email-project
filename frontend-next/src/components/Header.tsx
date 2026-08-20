import React from 'react';
import { LogOut, ChevronsRight } from 'lucide-react';

interface HeaderProps {
  username?: string;
  role?: string;
  onLogout?: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export default function Header({ username = 'User', role = 'Admin', onLogout, onToggleSidebar, isSidebarOpen = true }: HeaderProps) {
  const initial = username ? username.charAt(0).toUpperCase() : 'U';

  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-20">
      <div className="px-4 sm:px-6 lg:px-20">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex gap-4 items-center">
            {!isSidebarOpen && (
              <div
                onClick={onToggleSidebar}
                className="flex items-center justify-center p-1 transition-opacity duration-300 opacity-100 hover:bg-gray-300 rounded-lg cursor-pointer"
                title="แสดง Sidebar"
              >
                <ChevronsRight className="w-8 h-8 text-black" />
              </div>
            )}
            <div className="flex items-center">
              <button onClick={() => window.location.reload()}>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DASHBOARD
                </h1>
              </button>
            </div>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">{initial}</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-700">{role}</p>
                <p className="text-sm font-bold text-gray-900">{username}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg hidden lg:flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
