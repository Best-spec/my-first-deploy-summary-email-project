"use client";

import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Sparkles, Calendar } from 'lucide-react';

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

// Custom MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4f46e5',
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontSize: '13px',
          backgroundColor: '#ffffff',
          '&:hover fieldset': {
            borderColor: '#6366f1',
          },
        },
      },
    },
  },
});

export default function AnalysisActions({ actions = [], onActionSelect, loading = false }: AnalysisActionsProps) {
  const [isCompare, setIsCompare] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // MUI X DateRangePicker values
  const [value1, setValue1] = useState<DateRange<Dayjs>>([
    dayjs('2025-01-01'),
    dayjs('2025-04-30'),
  ]);

  const [value2, setValue2] = useState<DateRange<Dayjs>>([
    dayjs('2025-05-01'),
    dayjs('2025-08-31'),
  ]);

  const handleActionClick = (actionId: string) => {
    setActiveActionId(actionId);
    if (!onActionSelect) return;

    const s1 = value1[0] ? value1[0].format('YYYY-MM-DD') : '2025-01-01';
    const e1 = value1[1] ? value1[1].format('YYYY-MM-DD') : '2025-04-30';

    const dateRanges = [
      { startDate: s1, endDate: e1 }
    ];

    if (isCompare) {
      const s2 = value2[0] ? value2[0].format('YYYY-MM-DD') : '2025-05-01';
      const e2 = value2[1] ? value2[1].format('YYYY-MM-DD') : '2025-08-31';
      dateRanges.push({ startDate: s2, endDate: e2 });
    }

    onActionSelect(actionId, dateRanges, '');
  };

  const selectedAction = actions.find((a) => String(a.id) === activeActionId);
  const displayTitle = selectedAction ? selectedAction.name : 'Analysis Actions';

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="rounded-2xl shadow-md p-6 m-4 lg:m-10 bg-white border border-slate-100">
          <div className="flex flex-col gap-6 xl:flex-row justify-between items-start xl:items-center">

            {/* Title Header */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-purple-700 bg-clip-text text-transparent">
                  {displayTitle}
                </h2>
              </div>
            </div>

            {/* Date Range Pickers Container */}
            <div className="flex flex-col gap-4 w-full xl:w-auto bg-slate-50/80 p-4 rounded-xl border border-slate-200">

              {/* Top Row: Compare Toggle */}
              <div className="flex items-center justify-between gap-4">
                <label className="relative flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isCompare}
                    onChange={(e) => setIsCompare(e.target.checked)}
                  />
                  <div className="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 rounded-full peer transition-all ease-in-out duration-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="text-xs font-bold text-slate-700">เปรียบเทียบข้อมูล (COMPARE)</span>
                </label>

                {isCompare && (
                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 animate-in fade-in duration-200">
                    โหมดเปรียบเทียบ 2 ช่วงเวลา
                  </span>
                )}
              </div>

              {/* MUI X DateRangePicker Controls (Stacked Vertically Top-to-Bottom) */}
              <div className="flex flex-col gap-4 w-full">

                {/* Primary DateRangePicker (ช่วงเวลาที่ 1) */}
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    ช่วงเวลาที่ 1
                  </span>
                  <DemoContainer components={['DateRangePicker']}>
                    <DateRangePicker
                      localeText={{ start: 'วันเริ่มต้น', end: 'วันสิ้นสุด' }}
                      value={value1}
                      onChange={(newValue) => setValue1(newValue)}
                    />
                  </DemoContainer>
                </div>

                {/* COMPARE DateRangePicker (ช่วงเวลาที่ 2 - อยู่ช่องล่าง) */}
                {isCompare && (
                  <div className="flex flex-col gap-1 pt-3 border-t border-slate-200 animate-in fade-in duration-200">
                    <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      ช่วงเวลาที่ 2
                    </span>
                    <DemoContainer components={['DateRangePicker']}>
                      <DateRangePicker
                        localeText={{ start: 'วันเริ่มต้น (เปรียบเทียบ)', end: 'วันสิ้นสุด (เปรียบเทียบ)' }}
                        value={value2}
                        onChange={(newValue) => setValue2(newValue)}
                      />
                    </DemoContainer>
                  </div>
                )}

              </div>

            </div>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-6">
            {actions.length === 0 ? (
              <div className="col-span-full text-center text-slate-400 py-6 text-sm">
                กำลังโหลดรายการ Action...
              </div>
            ) : (
              actions.map((action) => {
                const isSelected = activeActionId === String(action.id);
                return (
                  <button
                    key={action.id}
                    disabled={loading}
                    onClick={() => handleActionClick(String(action.id))}
                    className={`flex flex-col items-center justify-center p-5 rounded-xl border transition-all ${isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-[1.01]'
                      : 'bg-slate-50 hover:bg-indigo-50/60 border-slate-200 hover:border-indigo-300 text-slate-800 hover:shadow-md'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.99]'}`}
                  >
                    <div className={`text-3xl mb-2 transition-transform ${isSelected ? 'scale-110' : ''}`}>
                      {action.icon}
                    </div>
                    <span className={`text-base font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                      {action.name}
                    </span>
                    <span className={`text-xs mt-1 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                      คลิกเพื่อคํานวณผลวิเคราะห์
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
