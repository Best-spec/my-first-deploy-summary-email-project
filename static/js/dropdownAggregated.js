// สมมติใช้โครงแยกไฟล์ตามที่คุยกัน
import { aggregateBy } from './aggregateBy.js';            // ฟังก์ชันรวม day/week/month
import { renderAutoChart } from './charts.js'; // ฟังก์ชันวาดกราฟของมึง
import { line as raw } from './fetchDate/mock.js';           // data รายวัน (dd/MM/yyyy)

// เก็บ state เล็ก ๆ
const $period = document.getElementById('period-select');
const canvasId = 'line-chart-canvas';

function getAggregated(period) {
  // กติกาแนะนำ: รายเดือนเอา "avg" (ค่าเฉลี่ยต่อวันในเดือน), ที่เหลือใช้ "sum"
  const mode = period === 'month' ? 'avg' : 'sum';
  return aggregateBy(raw, period, mode); // คืน [{ date: 'key', ... }]
}

function draw(period) {
  const data = getAggregated(period);
//   renderAutoChart(data, {
//     canvasId,
//     chartType: 'line',
//     colorMode: 'dataset',
//     yScale: 'linear',
//     // เส้นสวยๆ default สั้นๆ
//     datasetStyle: { fill: true, tension: 0.45, borderWidth: 3, pointRadius: 4 },
//     useGradient: true,
//     showValueLabels: false // line ส่วนใหญ่ไม่ต้องโชว์เลขทุกจุด เดี๋ยวรก
//   });

    renderAutoChart(data, {
    canvasId,
    typeColors: 'by-type',
    chartType: 'line',       // 📌 กราฟเส้น
    colorMode: 'dataset',    // สีตาม dataset
    yScale: 'logarithmic',        // แกน Y เส้นตรง

    // ✅ แต่งเส้นให้สวย
    datasetStyle: {
        borderWidth: 3,        // เส้นหนา
        tension: 0.45,         // โค้งนุ่ม
        fill: true,            // เติมสีใต้เส้น
        backgroundOpacity: 0.18,
        pointRadius: 5,        // จุดใหญ่ขึ้น
        pointHoverRadius: 8
    },
    useGradient: true,       // ✅ ไล่สีพื้นหลังใต้เส้น

    // ✅ โชว์เลขบนจุด
    showValueLabels: false,
    valueLabelOptions: {
        align: 'top',
        fontSize: 14,          // ตัวเลขใหญ่ขึ้น
        fontWeight: '600',
        color: '#000'
    }
    });
}

// init
const saved = localStorage.getItem('period') || 'day';
$period.value = saved;
draw(saved);

// on change
$period.addEventListener('change', (e) => {
  const period = e.target.value; // 'day' | 'week' | 'month'
  localStorage.setItem('period', period);
  draw(period);
});
