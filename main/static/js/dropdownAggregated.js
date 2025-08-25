// // // สมมติใช้โครงแยกไฟล์ตามที่คุยกัน
// // import { aggregateBy } from './aggregateBy.js';            // ฟังก์ชันรวม day/week/month
// // import { renderAutoChart } from './charts.js'; // ฟังก์ชันวาดกราฟของมึง
// // import { line as raw } from './fetchDate/mock.js';           // data รายวัน (dd/MM/yyyy)

// // // เก็บ state เล็ก ๆ
// // const $period = document.getElementById('period-select');
// // const canvasId = 'line-chart-canvas';

// // function getAggregated(period) {
// //   // กติกาแนะนำ: รายเดือนเอา "avg" (ค่าเฉลี่ยต่อวันในเดือน), ที่เหลือใช้ "sum"
// //   const mode = period === 'month' ? 'avg' : 'sum';
// //   return aggregateBy(raw, period, mode); // คืน [{ date: 'key', ... }]
// // }

// // export function drawChart(period) {
// //   const data = getAggregated(period);


// //     renderAutoChart(data, {
// //     canvasId,
// //     typeColors: 'by-type',
// //     chartType: 'line',       // 📌 กราฟเส้น
// //     colorMode: 'dataset',    // สีตาม dataset
// //     yScale: 'logarithmic',        // แกน Y เส้นตรง

// //     // ✅ แต่งเส้นให้สวย
// //     datasetStyle: {
// //         borderWidth: 3,        // เส้นหนา
// //         tension: 0.45,         // โค้งนุ่ม
// //         fill: true,            // เติมสีใต้เส้น
// //         backgroundOpacity: 0.18,
// //         pointRadius: 5,        // จุดใหญ่ขึ้น
// //         pointHoverRadius: 8
// //     },
// //     useGradient: true,       // ✅ ไล่สีพื้นหลังใต้เส้น

// //     // ✅ โชว์เลขบนจุด
// //     showValueLabels: false,
// //     valueLabelOptions: {
// //         align: 'top',
// //         fontSize: 14,          // ตัวเลขใหญ่ขึ้น
// //         fontWeight: '600',
// //         color: '#000'
// //     }
// //     });
// // }

// // // init
// // const saved = localStorage.getItem('period') || 'day';
// // $period.value = saved;
// // drawChart(saved);

// // export function periodHandle(callback) {
// //   const $period = document.getElementById('period-select');

// //   if (!$period) {
// //     console.error('🛑 period-select not found');
// //     return;
// //   }

// //   // ฟัง event เวลามีการเปลี่ยนค่า
// //   $period.addEventListener('change', (e) => {
// //     const value = e.target.value; // day, week, month
// //     console.log('เลือก period:', value);

// //     if (typeof callback === 'function') {
// //       callback(value); // ส่งค่ากลับไปให้ฟังก์ชันที่วาดกราฟ
// //     }
// //   });
// // }



// // dropdownAggregated.js (หรือไฟล์นี้เอง)
// // import { aggregateByRange } from './aggregateBy.js';
// import { renderAutoChart } from './charts.js';
// import { line as raw } from './fetchDate/mock.js';

// const canvasId = 'line-chart-canvas';

// // ถ้าอยากใช้ log scale แต่มีศูนย์ ให้เติม epsilon เล็ก ๆ
// function fixZeroForLog(rows) {
//   const eps = 0.0001;
//   if (!rows?.length) return rows;
//   const keys = Object.keys(rows[0]).filter(k => k !== 'date');
//   return rows.map(r => {
//     const o = { ...r };
//     keys.forEach(k => { if (o[k] === 0) o[k] = eps; });
//     return o;
//   });
// }

// const range = {
//   startDate: '2025-04-01',
//   endDate:   '2025-04-30',
//   startDay: 1, endDay: 30, startMonth: 4, endMonth: 4, startYear: 2025, endYear: 2025
// };

// function getAggregated(period, _range = range, _compareRange = null) {
//   const mode = period === 'month' ? 'avg' : 'sum';
//   const { primary, compare } = aggregateByRange(raw, period, mode, _range, _compareRange);
//   return { primary, compare }; // << ไม่ใช่ array ตรง ๆ
// }

// export function drawChart(period) {
//   const { primary/*, compare*/ } = getAggregated(period);

//   if (!primary?.length) {
//     console.warn('🟡 ไม่มีข้อมูลหลังกรองตามช่วง', { period, range });
//     return;
//   }

//   // ✅ ใช้ชุด primary ในการวาด
//   let data = primary;
//   data = fixZeroForLog(data);

//   renderAutoChart(data, {
//     canvasId: 'line-chart-canvas',
//     typeColors: 'by-type',
//     chartType: 'line',
//     colorMode: 'dataset',
//     yScale: 'logarithmic',
//     datasetStyle: { borderWidth: 3, tension: 0.45, fill: true, backgroundOpacity: 0.18, pointRadius: 5, pointHoverRadius: 8 },
//     useGradient: true,
//     showValueLabels: false
//   });
// }

// export function periodHandle() {
//   // ✅ re-query ตอนเรียกใช้ (หลัง DOM พร้อม)
//   const $period = document.getElementById('period-select');
//   if (!$period) return console.error('🛑 period-select not found');

//   // init
//   const saved = localStorage.getItem('period') || 'day';
//   $period.value = saved;
//   drawChart(saved);

//   // change listener
//   $period.addEventListener('change', (e) => {
//     const value = e.target.value; // 'day' | 'week' | 'month'
//     localStorage.setItem('period', value);
//     drawChart(value);
//   });
// }
