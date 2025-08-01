import { renderAutoChart, renderLineChart } from "../charts.js";

class ChartRenderer {
  constructor() {
    this.showChartElement = document.getElementById('showchart');
    this.barChartBox = document.getElementById('bar-chart-box');
    this.barChartBox2 = document.getElementById('bar-chart-box2');
    this.lineChartBox = document.getElementById('line-chart-box');
    this.titlechart = document.getElementById('titlechart');
    this.titlechart2 = document.getElementById('titlechart2');
  }

  hideAllCharts() {
    this.lineChartBox.classList.add('hidden');
    this.barChartBox2.classList.add('hidden');
    Array.from(this.showChartElement.classList).forEach(cls => {
      if (cls.startsWith('grid-cols-')) {
        this.showChartElement.classList.remove(cls);
      }
    });
    this.showChartElement.classList.add('grid-cols-2');
    this.showChartElement.classList.remove('hidden');
  }

  renderCharts(actionId, data) {
    console.log('from rendercharts data: ', data)
    this.hideAllCharts();

    if (actionId === 'top-center') {
      this.showChartElement.classList.remove('grid-cols-2', 'grid-cols-3');
      this.showChartElement.classList.add('grid-cols-1');
      this.titlechart.innerHTML = 'Top Appointment & Appointment Recommended 20 Center';
      this.titlechart2.innerHTML = 'Top Total 20 Center';
      this.barChartBox2.classList.remove('hidden');

      renderAutoChart(data.topcenter, {
        canvasId: 'bar-chart-canvas',
        typeColors: 'inquiry',
        chartType: 'bar',
        colorMode: 'dataset',   // แต่ละจุดสีไม่เหมือนกัน
        yScale: 'logarithmic' // หรือ linear ได้เลย
      });
      renderAutoChart(data.total, {
        canvasId: 'bar-chart-canvas2',
        typeColors: 'top-center',
        chartType: 'bar',
        colorMode: 'point',   // แต่ละจุดสีไม่เหมือนกัน
        yScale: 'logarithmic' // หรือ linear ได้เลย
      });

    } else if (actionId === 'total-month') {
      this.showChartElement.classList.remove('grid-cols-2', 'grid-cols-3');
      this.showChartElement.classList.add('grid-cols-2');
      this.barHorizontalElement.classList.remove('hidden');
      this.titlechart.innerHTML = 'Grand total by language';
      renderAutoChart(data.dataForChart, 'bar-chart-box', 'plot-all', 'bar');
      renderAutoChart(data.dataForChart2, 'bar-chart-box2', 'top-center', 'bar');

    } else if (actionId === 'plot-all') {
      this.showChartElement.classList.remove('grid-cols-1', 'grid-cols-3');
      this.showChartElement.classList.add('grid-cols-1');
      this.pieChartElement.classList.remove('hidden');
      this.titlechart.innerHTML = 'Total Email by type';
      console.log('from plot-all:',data.dataForChart, data.dataForChart2)
      renderAutoChart(data.dataForChart, 'bar-chart-box', 'plot-all', 'bar');
      renderLineChart(data.dataForChart2, 'line-chart-box', 'default_colors');

      }
       else {
        console.warn("Unknown data format for chart rendering:", data);
      }
    }
}


export default ChartRenderer;