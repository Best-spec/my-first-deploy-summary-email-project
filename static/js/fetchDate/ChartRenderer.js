import { renderAutoChart } from "../charts.js";
import { renderPieChartBoxes } from "../charts.js";
import { line } from './mock.js';
import { aggregateBy } from "../aggregateBy.js";  

class ChartRenderer {
  constructor() {
    this.showChart1Element = document.getElementById('row-1col');
    this.showChart2Element = document.getElementById('row-2col');
    this.barChartBox = document.getElementById('bar-chart-box');
    this.barChartBox2 = document.getElementById('bar-chart-box2');
    this.barChartBox3 = document.getElementById('bar-chart-box3');
    this.barChartBox4 = document.getElementById('bar-chart-box4');
    this.barChartBox5 = document.getElementById('bar-chart-box5');
    this.lineChartBox = document.getElementById('line-chart-box');
    this.titlechart = document.getElementById('titlechart');
    this.titlechart2 = document.getElementById('titlechart2');
    this.titlechart3 = document.getElementById('titlechart3');
    this.titlechart4 = document.getElementById('titlechart4');
    this.titlechart5 = document.getElementById('titlechart5');
    this.titleline = document.getElementById('titleline');
  }

  clearCharts() {
    // 1. ล้าง canvas chart เดิม (bar / line)
    const canvasIds = [
      'bar-chart-canvas', 'bar-chart-canvas2', 'bar-chart-canvas3',
      'bar-chart-canvas4', 'bar-chart-canvas5', 'line-chart-canvas'
    ];

    canvasIds.forEach(id => {
      const canvas = document.getElementById(id);
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });

    // 2. ซ่อน box ที่ fix ไว้
    [
      this.barChartBox, this.barChartBox2, this.barChartBox3,
      this.barChartBox4, this.barChartBox5, this.lineChartBox
    ].forEach(box => {
      if (box) box.classList.add('hidden');
    });

    // 3. ล้าง title ที่ fix ไว้
    [
      this.titlechart, this.titlechart2, this.titlechart3,
      this.titlechart4, this.titlechart5,
      document.getElementById('titleline')
    ].forEach(title => {
      if (title) title.innerHTML = '';
    });

    // 4. ซ่อน container rows ด้วย
    this.showChart1Element.classList.add('hidden');
    this.showChart2Element.classList.add('hidden');

    // 5. ✅ ลบ pie chart ที่สร้างแบบ dynamic (พวก pie-chart-canvas-*)
    const pieCanvases = document.querySelectorAll('[id^="pie-chart-canvas-"]');
    pieCanvases.forEach(canvas => {
      const box = canvas.closest('div'); // สมมุติ canvas ถูก wrap ด้วย <div class="box"> ที่สร้างไว้
      if (box && box.parentNode) {
        box.parentNode.removeChild(box); // ลบทั้งกล่องออกจาก DOM
      } else {
        // fallback: ลบ canvas เดี่ยว ๆ
        canvas.remove();
      }
    });
  }



  renderCharts(actionId, data) {
    this.clearCharts();  // ล้างก่อนทุกครั้ง

    console.log('from rendercharts data: ', data);

    if (actionId === 'top-center') {
      this.showChart1Element.classList.remove('hidden');
      this.titlechart3.innerHTML = 'Top Appointment & Appointment Recommended 20 Center';
      this.titlechart4.innerHTML = 'Top Total 20 Center';
      this.barChartBox3.classList.remove('hidden');
      this.barChartBox4.classList.remove('hidden');

      renderAutoChart(data.chart1, {
        canvasId: 'bar-chart-canvas3',
        typeColors: 'top-center-first',
        chartType: 'bar',
        colorMode: 'dataset',
        yScale: 'logarithmic'
      });

      renderAutoChart(data.chart2, {
        canvasId: 'bar-chart-canvas4',
        typeColors: 'top-center',
        chartType: 'bar',
        colorMode: 'point',
        yScale: 'logarithmic'
      });

    } else if (actionId === 'total-month') {
      this.showChart1Element.classList.remove('hidden');
      this.showChart2Element.classList.remove('hidden');
      this.barChartBox.classList.remove('hidden');
      this.barChartBox2.classList.remove('hidden'); 
      this.barChartBox3.classList.remove('hidden');
      this.barChartBox4.classList.remove('hidden');
      this.barChartBox5.classList.remove('hidden');
      this.lineChartBox.classList.remove('hidden');

      this.titlechart.innerHTML = 'Grand Total By Language';
      this.titlechart2.innerHTML = 'Grand Total By Email Type';
      this.titlechart3.innerHTML = 'Total Email Type By Language';
      this.titlechart4.innerHTML = 'Inquiry Type By Language';
      this.titlechart5.innerHTML = 'Appointment Type By Language';
      this.titleline.innerHTML = 'Grand Total By Email Type (LineChart)';


      // ตัวอย่างข้อมูล

      // รายวัน
      const daily = aggregateBy(line, 'day');   // -> date: "yyyy-MM-dd"

      // รายสัปดาห์ (ผลรวม)
      const weekly = aggregateBy(line, 'week', 'sum');

      // รายเดือน (ค่าเฉลี่ยต่อวันในเดือนนั้น)
      const monthlyAvg = aggregateBy(line, 'month', 'avg');

      renderAutoChart(weekly, {
        canvasId: 'line-chart-canvas',
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
        showValueLabels: true,
        valueLabelOptions: {
          align: 'top',
          fontSize: 14,          // ตัวเลขใหญ่ขึ้น
          fontWeight: '600',
          color: '#000'
        }
      });

      renderAutoChart(data.chart1, {
        canvasId: 'bar-chart-canvas',
        typeColors: 'group-country',
        chartType: 'bar',
        colorMode: 'point',
        yScale: 'logarithmic'
      });

      renderAutoChart(data.chart2, {
        canvasId: 'bar-chart-canvas2',
        typeColors: 'by-type',
        chartType: 'bar',
        colorMode: 'dataset',
        yScale: 'logarithmic'
      });

      renderAutoChart(data.chart3, {
        canvasId: 'bar-chart-canvas3',
        typeColors: 'group-country',
        chartType: 'bar',
        colorMode: 'dataset',
        yScale: 'logarithmic'
      });

      renderAutoChart(data.chart4, {
        canvasId: 'bar-chart-canvas4',
        typeColors: 'group-country',
        chartType: 'bar',
        colorMode: 'dataset',
        yScale: 'logarithmic'
      });

      renderAutoChart(data.chart5, {
        canvasId: 'bar-chart-canvas5',
        typeColors: 'group-country',
        chartType: 'bar',
        colorMode: 'dataset',
        yScale: 'logarithmic'
      });

      renderPieChartBoxes(Object.keys(data.chart6), data.chart6, 'colorByCountry');

    } else if (actionId === 'plot-all') {
      this.showChart1Element.classList.remove('hidden');
      this.barChartBox.classList.remove('hidden');
      this.titlechart.innerHTML = 'Total Email by type';

      renderAutoChart(data.chart1, {
        canvasId: 'bar-chart-canvas',
        typeColors: 'by-type',
        chartType: 'bar',
        colorMode: 'dataset',
        yScale: 'logarithmic'
      });

    } else {
      console.warn("Unknown data format for chart rendering:", data);
    }
  }

}


export default ChartRenderer;