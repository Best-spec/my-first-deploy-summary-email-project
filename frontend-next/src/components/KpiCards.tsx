"use client";

import React, { useEffect, useState } from 'react';

interface KpiData {
  metric: string;
  value: number;
  previousValue?: number;
}

export default function KpiCards({ data = [] }: { data?: any[] }) {
  // Mock handling to transform array into KpiData for display if necessary,
  // but since we get raw data from the API like { 'Centers & clinics': '...', 'total': 25 }, 
  // we can just render the table dynamically based on object keys.
  
  if (!data || data.length === 0) {
    return (
      <div className="m-4 lg:m-10 mt-10">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100 p-8 text-center text-slate-500">
          กรุณากดปุ่ม Action เพื่อดูข้อมูล (No data available)
        </div>
      </div>
    );
  }

  const keys = Object.keys(data[0]);

  return (
    <div className="m-4 lg:m-10 mt-10">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-white uppercase bg-gradient-to-r from-indigo-500 to-purple-700">
            <tr>
              {keys.map((key) => (
                <th key={key} scope="col" className="px-6 py-3">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="bg-white border-b hover:bg-slate-50 transition-colors">
                {keys.map((key) => (
                  <td key={key} className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
