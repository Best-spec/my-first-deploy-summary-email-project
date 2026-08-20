"use client";

import React from 'react';
import { Table, ChevronDown, Calendar } from 'lucide-react';

interface KpiCardsProps {
  data?: any[];
}

export default function KpiCards({ data = [] }: KpiCardsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="m-4 lg:m-10 mt-6">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 p-10 text-center text-slate-500 flex flex-col items-center justify-center">
          <div className="text-4xl mb-3">📊</div>
          <p className="font-semibold text-slate-700">กรุณาเลือกช่วงเวลา และกดคลิกปุ่ม Action</p>
          <p className="text-xs text-slate-400 mt-1">เพื่อเริ่มคำนวณและแสดงผลตารางสรุปข้อมูล</p>
        </div>
      </div>
    );
  }

  // Extract column headers (excluding 'sub')
  const sampleRow = data[0] || {};
  const headers = Object.keys(sampleRow).filter((k) => k !== 'sub');

  const formatHeader = (header: string) => {
    return header.replace(/_/g, ' ').toUpperCase();
  };

  const renderValue = (val: any) => {
    if (val === null || val === undefined) return '-';

    const strVal = String(val);
    if (strVal.includes('▲') || strVal.startsWith('+')) {
      return <span className="text-emerald-600 font-bold">{strVal}</span>;
    }
    if (strVal.includes('▼') || strVal.startsWith('-')) {
      return <span className="text-rose-600 font-bold">{strVal}</span>;
    }

    return strVal;
  };

  return (
    <div className="m-4 lg:m-10 mt-6 max-w-[calc(100%-2rem)] lg:max-w-[calc(100%-5rem)]">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100">
        {/* Table Header Section */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Table className="w-4 h-4 text-indigo-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">สรุปผลการวิเคราะห์ข้อมูล</h3>
              <p className="text-xs text-indigo-200">จำนวนทั้งหมด {data.length} รายการ</p>
            </div>
          </div>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-xs text-white uppercase bg-indigo-600/90 font-semibold">
              <tr>
                {headers.map((h, i) => (
                  <th key={h} scope="col" className={`px-6 py-3.5 ${i === 0 ? 'text-left' : 'text-center'}`}>
                    {formatHeader(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row, idx) => {
                const hasSub = Array.isArray(row.sub) && row.sub.length > 0;
                const isTotalRow = String(row[headers[0]] || '').toLowerCase() === 'total';
                return (
                  <React.Fragment key={idx}>
                    {/* Main Row */}
                    <tr className={`transition-colors ${isTotalRow
                      ? 'bg-indigo-50/80 font-bold border-t-2 border-indigo-200 text-indigo-950'
                      : idx % 2 === 0 ? 'bg-white hover:bg-indigo-50/40' : 'bg-slate-50/50 hover:bg-indigo-50/40'
                      }`}>
                      {headers.map((h, i) => (
                        <td
                          key={h}
                          className={`px-6 py-4 font-medium ${isTotalRow ? 'font-extrabold text-indigo-950' : 'text-slate-800'} ${i === 0 ? 'text-left font-bold' : 'text-center'}`}
                        >
                          {renderValue(row[h])}
                        </td>
                      ))}
                    </tr>

                    {/* Sub Rows (Compare Mode Breakdown) */}
                    {hasSub && row.sub.map((subRow: any, subIdx: number) => {
                      const dateRangeLabel = subRow.date_range || subRow.date_range2 || `ช่วงเวลา ${subIdx + 1}`;
                      return (
                        <tr key={`sub-${idx}-${subIdx}`} className="bg-slate-100/70 border-t border-b border-slate-200/60 text-xs">
                          {headers.map((h, i) => {
                            let cellContent = subRow[h] ?? '-';
                            if (i === 0) {
                              cellContent = (
                                <div className="flex items-center gap-2 pl-4 text-indigo-700 font-medium">
                                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                                  <span>{dateRangeLabel}</span>
                                </div>
                              );
                            }
                            return (
                              <td key={h} className={`px-6 py-2.5 text-slate-600 ${i === 0 ? 'text-left' : 'text-center font-mono'}`}>
                                {cellContent}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
