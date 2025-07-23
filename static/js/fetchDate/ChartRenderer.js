import { renderAutoChart } from "../charts.js";

class ChartRenderer {
  constructor() {
    this.showChartElement = document.getElementById('showchart');
    this.pieChartElement = document.getElementById('piechart');
    this.barHorizontalElement = document.getElementById('barHorizontal');
    this.titlechart = document.getElementById('titlechart');
    this.titlechart2 = document.getElementById('titlechart2');
  }

  hideAllCharts() {
    this.pieChartElement.classList.add('hidden');
    this.barHorizontalElement.classList.add('hidden');
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
    // const dataForChart1 = data[0];
    // const dataForChart2 = data[1];
    this.hideAllCharts();

    if (actionId === 'top-center') {
      this.showChartElement.classList.remove('grid-cols-2', 'grid-cols-3');
      this.showChartElement.classList.add('grid-cols-1');
      renderAutoChart(data);

    } else if (actionId === 'total-month') {
      this.showChartElement.classList.remove('grid-cols-1', 'grid-cols-3');
      this.showChartElement.classList.add('grid-cols-2');
      this.barHorizontalElement.classList.remove('hidden');
      this.titlechart.innerHTML = 'Grand total by language';
      renderAutoChart(data);
      renderAutoChart(data, 'barChartHorizontal');

    } else if (actionId === 'plot-all') {
      this.showChartElement.classList.remove('grid-cols-1', 'grid-cols-3');
      this.showChartElement.classList.add('grid-cols-2');
      this.pieChartElement.classList.remove('hidden');
      if (Array.isArray(data) && data.length > 0) {
        renderAutoChart(data[0]);
      
      } else {
        console.warn("Expected data for 'plot-all' charts.");
      }

    } else {
      this.showChartElement.classList.remove('grid-cols-1', 'grid-cols-3');
      this.showChartElement.classList.add('grid-cols-2');
      this.pieChartElement.classList.remove('hidden');
      if (Array.isArray(data)) {
        renderAutoChart(data, undefined, 'inquiry')
      
      } else {
        console.warn("Unknown data format for chart rendering:", data);
      }
    }
  }
}

export default ChartRenderer;