"use client";

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BarChart3, Layers, Globe, Mail, PieChart as PieIcon, TrendingUp, Calendar, Loader2 } from 'lucide-react';

// Register Chart.js components and DataLabels plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

interface ChartsProps {
  data?: any;
  actionId?: string;
  dateRanges?: any[];
}

/* Color palettes from legacy color_chart.js & flagColor.js */
const countryMainColors = [
  '#234f8e', // UK - Royal Blue
  '#a62233', // TH - Siam Crimson
  '#1e4f6d', // RU - Azure Blue
  '#a67c00', // DE - Imperial Gold
  '#8b0f1a', // CN - China Red
  '#145c38'  // AR - Pan-Arab Green
];

function generateSingleHueShades(hue: number, saturation: number, lightStart = 35, lightEnd = 68, count = 8) {
  const shades = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1);
    const L = lightStart + (lightEnd - lightStart) * t;
    shades.push(`hsl(${hue}, ${saturation}%, ${L}%)`);
  }
  return shades;
}

const flagColors: Record<string, string[]> = {
  English: generateSingleHueShades(220, 70, 35, 68, 8),
  Thai: generateSingleHueShades(350, 70, 33, 65, 8),
  Russia: generateSingleHueShades(205, 65, 35, 68, 8),
  German: generateSingleHueShades(45, 85, 40, 70, 8),
  Chinese: generateSingleHueShades(2, 85, 28, 60, 8),
  Arabic: generateSingleHueShades(122, 65, 30, 60, 8)
};

function generatePurpleShades(count = 20) {
  const shades = [];
  for (let i = 0; i < count; i++) {
    const lightness = 45 + (i * (40 / Math.max(count - 1, 1)));
    shades.push(`hsl(270, 45%, ${lightness}%)`);
  }
  return shades;
}

/* Helper to calculate luminance for contrast text color on pie slices */
function getLuminance(colorStr: string): number {
  if (!colorStr) return 0;
  if (colorStr.startsWith('hsl')) {
    const m = colorStr.match(/hsl\(\s*[\d.]+\s*,\s*[\d.]+(?:%|)\s*,\s*([\d.]+)(?:%|)\s*\)/i);
    if (m) return parseFloat(m[1]) / 100;
  }
  if (colorStr.startsWith('#')) {
    const hex = colorStr.length === 4 ? '#' + [...colorStr.slice(1)].map(c => c + c).join('') : colorStr;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }
  return 0;
}

export default function Charts({ data, actionId = 'top-center', dateRanges }: ChartsProps) {
  if (!data) return null;

  if (actionId === 'top-center') {
    return <TopCenterCharts data={data} />;
  }

  if (actionId === 'total-month') {
    return <TotalMonthCharts data={data} dateRanges={dateRanges} />;
  }

  return <GenericCharts data={data} />;
}

/* ==========================================================================
   TOP CENTER CHARTS (Chart.js Bar Charts Stacked Vertically)
   ========================================================================== */
function TopCenterCharts({ data }: { data: any }) {
  const chart1Data = data.chart1 || [];
  const chart2Data = data.chart2 || [];

  // Data for Chart 1: Top Appointment & Recommended 20 Center
  const labels1 = chart1Data.map((d: any, idx: number) => d["Centers & clinics"] || d["Centers & Clinics"] || `Center ${idx + 1}`);
  const aptCounts = chart1Data.map((d: any) => Number(d.appointment_count) || 0);
  const recCounts = chart1Data.map((d: any) => Number(d.recommended_count) || 0);

  const barData1 = {
    labels: labels1,
    datasets: [
      {
        label: 'Appointment Count',
        data: aptCounts,
        backgroundColor: '#4f46e5',
        borderRadius: 4,
      },
      {
        label: 'Recommended Count',
        data: recCounts,
        backgroundColor: '#10b981',
        borderRadius: 4,
      }
    ]
  };

  const barOptions1 = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 28, right: 10, left: 10, bottom: 0 }
    },
    plugins: {
      legend: { position: 'top' as const },
      datalabels: {
        display: true,
        color: '#1e293b',
        anchor: 'end' as const,
        align: 'top' as const,
        offset: 2,
        clip: false,
        font: { weight: 'bold' as const, size: 13 },
        formatter: (v: number) => (v > 0 ? v : '')
      }
    },
    scales: {
      y: { beginAtZero: true, grace: '12%', grid: { color: '#f1f5f9' } },
      x: { ticks: { font: { size: 11 } }, grid: { display: false } }
    }
  };

  // Data for Chart 2: Top Total 20 Center
  const labels2 = chart2Data.map((d: any, idx: number) => d["Centers & clinics"] || d["Centers & Clinics"] || `Center ${idx + 1}`);
  const totals2 = chart2Data.map((d: any) => Number(d.total) || 0);
  const purpleColors = generatePurpleShades(chart2Data.length);

  const barData2 = {
    labels: labels2,
    datasets: [
      {
        label: 'Total',
        data: totals2,
        backgroundColor: purpleColors,
        borderRadius: 4,
      }
    ]
  };

  const barOptions2 = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 28, right: 10, left: 10, bottom: 0 }
    },
    plugins: {
      legend: { display: false },
      datalabels: {
        display: true,
        color: '#1e293b',
        anchor: 'end' as const,
        align: 'top' as const,
        offset: 2,
        clip: false,
        font: { weight: 'bold' as const, size: 13 },
        formatter: (v: number) => (v > 0 ? v : '')
      }
    },
    scales: {
      y: { beginAtZero: true, grace: '12%', grid: { color: '#f1f5f9' } },
      x: { ticks: { font: { size: 11 } }, grid: { display: false } }
    }
  };

  return (
    <div className="w-full space-y-8 m-4 lg:m-10 max-w-[calc(100%-2rem)] lg:max-w-[calc(100%-5rem)]">
      <div className="flex flex-col gap-8">

        {/* CHART 1 */}
        {chart1Data.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 flex flex-col hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-indigo-600 bg-clip-text text-transparent">
                  Top Appointment & Appointment Recommended 20 Center
                </h3>
                <p className="text-xs text-slate-400">การเปรียบเทียบประเภทการนัดหมายตามศูนย์บริการ</p>
              </div>
            </div>

            <div className="h-[420px] w-full">
              <Bar data={barData1} options={barOptions1} />
            </div>
          </div>
        )}

        {/* CHART 2 */}
        {chart2Data.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 flex flex-col hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-purple-600 bg-clip-text text-transparent">
                  Top Total 20 Center
                </h3>
                <p className="text-xs text-slate-400">จำนวนรายการรวมสูงสุด 20 อันดับแรก</p>
              </div>
            </div>

            <div className="h-[420px] w-full">
              <Bar data={barData2} options={barOptions2} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ==========================================================================
   TOTAL MONTH CHARTS (Proportional, Spacious, Highly Readable)
   ========================================================================== */
function TotalMonthCharts({ data, dateRanges }: { data: any; dateRanges?: any[] }) {
  const chart1Data = data.chart1 || []; // Grand Total By Language
  const chart2Data = data.chart2 || []; // Grand Total By Email Type
  const chart3Data = data.chart3 || []; // Total Email Type By Language
  const chart4Data = data.chart4 || []; // Inquiry Type By Language
  const chart5Data = data.chart5 || []; // Appointment Type By Language
  const chart6Data = data.chart6 || {}; // Group By Country Type (Pie Data)

  // 1. Chart 1: Grand Total By Language
  const labels1 = chart1Data.map((d: any) => d.language);
  const values1 = chart1Data.map((d: any) => Number(d['Total by language']) || 0);

  const barData1 = {
    labels: labels1,
    datasets: [
      {
        label: 'Total by Language',
        data: values1,
        backgroundColor: countryMainColors,
        borderRadius: 6,
      }
    ]
  };

  const barOptions1 = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 28, right: 10, left: 10, bottom: 0 }
    },
    plugins: {
      legend: { display: false },
      datalabels: {
        display: true,
        color: '#1e293b',
        anchor: 'end' as const,
        align: 'top' as const,
        offset: 2,
        clip: false,
        font: { weight: 'bold' as const, size: 12 },
        formatter: (v: number) => (v > 0 ? v : '')
      }
    },
    scales: {
      y: { beginAtZero: true, grace: '12%', grid: { color: '#f1f5f9' } },
      x: { ticks: { font: { size: 11 } }, grid: { display: false } }
    }
  };

  // 2. Chart 2: Grand Total By Email Type
  const getChart2Items = () => {
    if (!chart2Data || chart2Data.length === 0) return { labels: [], values: [] };
    const item = chart2Data[0] || {};
    const keys = Object.keys(item).filter((k) => k !== 'Type Email');
    return {
      labels: keys,
      values: keys.map((k) => Number(item[k]) || 0)
    };
  };
  const c2 = getChart2Items();

  const barData2 = {
    labels: c2.labels,
    datasets: [
      {
        label: 'Total Emails',
        data: c2.values,
        backgroundColor: generatePurpleShades(c2.labels.length),
        borderRadius: 6,
      }
    ]
  };

  const barOptions2 = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 28, right: 10, left: 10, bottom: 0 }
    },
    plugins: {
      legend: { display: false },
      datalabels: {
        display: true,
        color: '#1e293b',
        anchor: 'end' as const,
        align: 'top' as const,
        offset: 2,
        clip: false,
        font: { weight: 'bold' as const, size: 12 },
        formatter: (v: number) => (v > 0 ? v : '')
      }
    },
    scales: {
      y: { beginAtZero: true, grace: '12%', grid: { color: '#f1f5f9' } },
      x: { ticks: { font: { size: 11 } }, grid: { display: false } }
    }
  };

  return (
    <div className="w-full space-y-10 m-4 lg:m-10 max-w-[calc(100%-2rem)] lg:max-w-[calc(100%-5rem)]">

      {/* ROW 1: Grand Total By Language & Grand Total By Email Type */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* CHART 1 */}
        {chart1Data.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 flex flex-col hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent">
                  Grand Total By Language
                </h3>
                <p className="text-xs text-slate-400">จำนวนอีเมลรวมแยกตามภาษา</p>
              </div>
            </div>

            <div className="h-[380px] w-full">
              <Bar data={barData1} options={barOptions1} />
            </div>
          </div>
        )}

        {/* CHART 2 */}
        {c2.labels.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 flex flex-col hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-teal-600 bg-clip-text text-transparent">
                  Grand Total By Email Type
                </h3>
                <p className="text-xs text-slate-400">สรุปรวมประเภทของอีเมลทั้งหมด</p>
              </div>
            </div>

            <div className="h-[380px] w-full">
              <Bar data={barData2} options={barOptions2} />
            </div>
          </div>
        )}

      </div>

      {/* ROW 2: Grouped Category Charts (Chart 3, 4, 5) Stacked Vertically */}
      <div className="flex flex-col gap-8">
        {chart3Data.length > 0 && (
          <GroupedBarChart
            title="Total Email Type By Language"
            subtitle="Inquiry vs Appointment"
            iconColor="indigo"
            dataList={chart3Data}
          />
        )}

        {chart4Data.length > 0 && (
          <GroupedBarChart
            title="Inquiry Type By Language"
            subtitle="จำแนกตามหมวด Inquiry"
            iconColor="purple"
            dataList={chart4Data}
          />
        )}

        {chart5Data.length > 0 && (
          <GroupedBarChart
            title="Appointment Type By Language"
            subtitle="จำแนกตามประเภท Appointment"
            iconColor="pink"
            dataList={chart5Data}
          />
        )}
      </div>

      {/* ROW 3: Country / Language Breakdown Pie Charts Grid (Chart 6) */}
      {Object.keys(chart6Data).length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <PieIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Language Distribution Breakdown</h3>
              <p className="text-xs text-slate-400">สัดส่วนรายละเอียดประเภทอีเมลแยกตามแต่ละภาษา</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {Object.entries(chart6Data).map(([lang, categories]: [string, any]) => {
              const pieLabels = Object.keys(categories || {});
              const pieValues = Object.values(categories || {}).map((v) => Number(v) || 0);
              const totalVal = pieValues.reduce((a, b) => a + b, 0);
              const shades = flagColors[lang] || generatePurpleShades(pieLabels.length);

              const pieChartData = {
                labels: pieLabels,
                datasets: [
                  {
                    data: pieValues,
                    backgroundColor: shades,
                    borderWidth: 2,
                    borderColor: '#ffffff',
                  }
                ]
              };

              const pieChartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                  padding: { top: 10, bottom: 10 }
                },
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                    labels: { font: { size: 11 }, padding: 12, usePointStyle: true, boxWidth: 8 }
                  },
                  datalabels: {
                    display: true,
                    color: (ctx: any) => {
                      const bg = ctx.dataset.backgroundColor[ctx.dataIndex];
                      return getLuminance(bg) > 0.55 ? '#0f172a' : '#ffffff';
                    },
                    font: { weight: 'bold' as const, size: 12 },
                    formatter: (v: number, ctx: any) => {
                      const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
                      const pct = total > 0 ? Math.round((v / total) * 100) : 0;
                      return pct >= 3 ? `${pct}%` : '';
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: (context: any) => {
                        const val = context.raw || 0;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const pct = total ? ((val / total) * 100).toFixed(1) : '0';
                        return ` ${context.label}: ${val} (${pct}%)`;
                      }
                    }
                  }
                }
              };

              return (
                <div
                  key={lang}
                  className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 flex flex-col hover:shadow-lg transition-all space-y-4"
                >
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <h4 className="font-bold text-slate-900 text-base">Pie Chart - {lang}</h4>
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                      Total: {totalVal}
                    </span>
                  </div>

                  {/* Pie Chart Canvas Container */}
                  <div className="h-[320px] w-full">
                    <Pie data={pieChartData} options={pieChartOptions} />
                  </div>

                  {/* Breakdown Progress Bars for Detail Clarity */}
                  <div className="pt-3 border-t border-slate-100 space-y-2.5">
                    {pieLabels.map((catName, cIdx) => {
                      const val = pieValues[cIdx];
                      const pct = totalVal > 0 ? Math.round((val / totalVal) * 100) : 0;
                      const sliceColor = shades[cIdx % shades.length];

                      return (
                        <div key={cIdx} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-600 truncate max-w-[70%] flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: sliceColor }} />
                              {catName}
                            </span>
                            <span className="font-mono text-slate-800 font-semibold">
                              {val} ({pct}%)
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${pct}%`, backgroundColor: sliceColor }}
                              className="h-full rounded-full transition-all duration-300 opacity-90"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ROW 4: Timeline Analysis Line Chart (from /backend/aggregate) */}
      <TimelineLineChart dateRanges={dateRanges} />

    </div>
  );
}

/* Helper for Grouped Bar Charts (Chart 3, 4, 5) using Chart.js */
function GroupedBarChart({
  title,
  subtitle,
  iconColor,
  dataList,
}: {
  title: string;
  subtitle: string;
  iconColor: string;
  dataList: any[];
}) {
  const languages = ['English', 'Thai', 'Russia', 'German', 'Chinese', 'Arabic'];

  const chartData = {
    labels: dataList.map((item: any) => item.type || ''),
    datasets: languages.map((lang, idx) => ({
      label: lang,
      data: dataList.map((item: any) => Number(item[lang]) || 0),
      backgroundColor: countryMainColors[idx % countryMainColors.length],
      borderRadius: 4,
    }))
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 28, right: 8, left: 8, bottom: 0 }
    },
    plugins: {
      legend: { position: 'top' as const, labels: { font: { size: 10 }, boxWidth: 10, padding: 8 } },
      datalabels: {
        display: true,
        color: '#1e293b',
        anchor: 'end' as const,
        align: 'top' as const,
        offset: 2,
        clip: false,
        font: { weight: 'bold' as const, size: 11 },
        formatter: (v: number) => (v > 0 ? v : '')
      }
    },
    scales: {
      y: { beginAtZero: true, grace: '15%', grid: { color: '#f1f5f9' } },
      x: { ticks: { font: { size: 10 } }, grid: { display: false } }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 flex flex-col hover:shadow-lg transition-all">
      <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
        <div className={`w-8 h-8 rounded-lg bg-${iconColor}-50 flex items-center justify-center text-${iconColor}-600`}>
          <BarChart3 className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">{title}</h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

/* Timeline Line Chart component connecting to /backend/aggregate/ using Chart.js Line */
function TimelineLineChart({ dateRanges }: { dateRanges?: any[] }) {
  const [period, setPeriod] = useState('day');
  const [linePoints, setLinePoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLine = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const range = dateRanges?.[0] || { startDate: '2025-01-01', endDate: '2025-04-30' };

        const res = await fetch('/backend/aggregate/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            period: period,
            mode: 'sum',
            range: range
          })
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && !res.redirected && contentType.includes('application/json')) {
          const json = await res.json();
          if (json.primary && Array.isArray(json.primary)) {
            setLinePoints(json.primary);
          } else if (Array.isArray(json)) {
            setLinePoints(json);
          }
        }
      } catch (err) {
        console.error('Failed to fetch aggregate timeline', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLine();
  }, [period, dateRanges]);

  const categoryKeys = ['General Inquiry', 'Estimated Cost', 'Appointment', 'Appointment Recommended'];
  const lineColors: Record<string, string> = {
    'General Inquiry': '#3b82f6',
    'Estimated Cost': '#f59e0b',
    'Appointment': '#6366f1',
    'Appointment Recommended': '#10b981',
  };

  const lineLabels = linePoints.map((pt: any, idx: number) => pt.date || pt.date_range || `P${idx + 1}`);

  const lineChartData = {
    labels: lineLabels,
    datasets: categoryKeys.map((key) => ({
      label: key,
      data: linePoints.map((pt: any) => Number(pt[key]) || 0),
      borderColor: lineColors[key],
      backgroundColor: lineColors[key] + '20',
      fill: true,
      tension: 0.45,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 2,
    }))
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 25, right: 10, left: 10, bottom: 0 }
    },
    plugins: {
      legend: { position: 'top' as const },
      datalabels: {
        display: true,
        color: '#334155',
        align: 'top' as const,
        offset: 2,
        clip: false,
        font: { weight: 'bold' as const, size: 10 },
        formatter: (v: number) => (v > 0 ? v : '')
      }
    },
    scales: {
      y: { beginAtZero: true, grace: '12%', grid: { color: '#f1f5f9' } },
      x: { ticks: { font: { size: 10 } }, grid: { display: false } }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 transition-all hover:shadow-lg space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-indigo-600 bg-clip-text text-transparent">
              Grand Total By Email Type
            </h3>
            <p className="text-xs text-slate-400">แนวโน้มจำนวนอีเมลตามช่วงเวลาที่เลือก (Daily / Weekly / Monthly)</p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">โหมดการแสดงผล:</span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="day">Daily (รายวัน)</option>
            <option value="week">Weekly (รายสัปดาห์)</option>
            <option value="month">Monthly (รายเดือน)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-indigo-600 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-xs font-medium">กำลังโหลดข้อมูลไทม์ไลน์...</span>
        </div>
      ) : linePoints.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
          ไม่มีข้อมูลสำหรับช่วงเวลานี้
        </div>
      ) : (
        <div className="h-[380px] w-full">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      )}
    </div>
  );
}

/* Generic Charts Fallback */
function GenericCharts({ data }: { data: any }) {
  return (
    <div className="w-full m-4 lg:m-10 p-6 bg-white rounded-2xl shadow-md border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Analysis Result Charts</h3>
      <pre className="text-xs bg-slate-50 p-4 rounded-xl overflow-x-auto text-slate-600 border border-slate-200">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
