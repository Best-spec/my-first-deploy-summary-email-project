import React, { useState } from 'react';
import { Activity, Users, ShoppingCart, TrendingUp } from 'lucide-react';

export interface ActionItem {
  id: string | number;
  name: string;
  color: string;
  icon: string;
}

interface AnalysisActionsProps {
  actions?: ActionItem[];
  onActionSelect?: (actionId: string, dateRanges: any[], webCommerce?: string) => void;
  loading?: boolean;
}

export default function AnalysisActions({ actions = [], onActionSelect, loading = false }: AnalysisActionsProps) {
  const [isCompare, setIsCompare] = useState(false);

  return (
    <div className="rounded-lg shadow-md p-6 m-4 lg:m-10 bg-white">
      <div className="flex flex-col gap-4 lg:flex-row justify-between">
        <div className="flex justify-center lg:justify-start items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-black to-purple-600 bg-clip-text text-transparent">
            Actions
          </h2>
        </div>
        
        <div className="lg:flex gap-6 justify-center items-start">
          <div className="flex justify-center py-2">
            <label className="relative flex cursor-pointer items-center">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isCompare}
                onChange={(e) => setIsCompare(e.target.checked)}
              />
              <div className="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700"></div>
              <span className="ml-3 text-sm font-medium text-gray-600">Compare</span>
            </label>
          </div>
          
          <div className="flex flex-col gap-4 w-full lg:w-auto">
            <div className="flex">
              <input 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" 
                type="text" 
                name="daterange" 
                placeholder="เลือกวันที่" 
              />
            </div>
            {isCompare && (
              <div className="flex">
                <input 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" 
                  type="text" 
                  name="datecompare" 
                  placeholder="เลือกวันที่เปรียบเทียบ" 
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-8">
        {actions.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-4">กำลังโหลดข้อมูล Actions...</div>
        ) : (
          actions.map((action) => (
            <button
              key={action.id}
              disabled={loading}
              onClick={() => {
                if (onActionSelect) {
                  const dummyDates = [{startDate: '2023-01-01', endDate: '2024-12-31'}];
                  if (isCompare) {
                     dummyDates.push({startDate: '2022-01-01', endDate: '2022-12-31'});
                  }
                  onActionSelect(String(action.id), dummyDates, '');
                }
              }}
              style={{
                backgroundColor: `var(--${action.color}-50, #f8fafc)`,
                borderColor: `var(--${action.color}-100, #f1f5f9)`,
              }}
              className={`flex flex-col items-center p-4 bg-slate-50 border border-slate-100 rounded-lg hover:bg-slate-100 hover:shadow-md transition-all group ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div 
                className={`w-8 h-8 mb-2 group-hover:scale-110 transition-transform flex items-center justify-center`}
                style={{ color: `var(--${action.color}-600, #475569)` }}
                dangerouslySetInnerHTML={{ __html: action.icon }}
              />
              <span 
                className={`text-sm font-medium`}
                style={{ color: `var(--${action.color}-900, #0f172a)` }}
              >
                {action.name}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
