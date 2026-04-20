'use client';
import { useState } from 'react';
import { Titletype } from '../types/title';

export default function AnalysisActions({ title, onToggle }: Titletype) {
  const [isCompare, setIsCompare] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="rounded-lg shadow-md p-6 m-10 bg-white">
      <div className="flex flex-col gap-4 lg:flex-row justify-between">
        <div className="flex justify-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-black to-purple-600 bg-clip-text text-transparent">
            {title}
          </h2>
        </div>

        <div className="lg:flex gap-6 justify-center">
          {/* Toggle Compare */}
          <div className="flex justify-center py-2">
            <label className="relative flex cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                onChange={() => setIsCompare(!isCompare)} 
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-0 rounded-full peer transition-all duration-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 peer-checked:bg-indigo-600"></div>
            </label>
            <span className="ml-3 text-sm font-medium text-gray-600">Compare</span>
          </div>

          <div className="flex flex-col gap-2">
            <input className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" type="text" placeholder="เลือกวันที่" />
            {isCompare && (
              <input className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" type="text" placeholder="เลือกวันที่เปรียบเทียบ" />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <button onClick={() => onToggle('Top Center')} className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
          <div className="text-2xl mb-2">⭐</div>
          <span className="text-sm font-medium text-red-900">Top Center</span>
        </button>
        <button onClick={() => {
          onToggle('Total Email by Language');
          setShowModal(true);
        }} className="flex flex-col items-center p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
          <div className="text-2xl mb-2">📈</div>
          <span className="text-sm font-medium text-teal-900">Total Email by Language</span>
        </button>
      </div>

      {/* Modal - เขียนแบบ Conditional Rendering */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl">×</button>
            <h2 className="text-xl font-semibold mb-4">Web commerce</h2>
            <input type="text" className="w-full rounded border border-emerald-400 px-4 py-2 mb-4" placeholder="กรอก Web commerce" />
            <button className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600">ตกลง</button>
          </div>
        </div>
      )}
    </div>
  );
}