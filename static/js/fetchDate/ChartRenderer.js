import { renderAutoChart, renderLineChart } from "../charts.js";

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
    let chart2 = 'dataForChart2' in data ? data.dataForChart2 : data.dataForChart;
    this.hideAllCharts();

    if (actionId === 'top-center') {
      this.showChartElement.classList.remove('grid-cols-2', 'grid-cols-3');
      this.showChartElement.classList.add('grid-cols-1');
      this.titlechart.innerHTML = 'Top 20 Center';
      renderAutoChart(data, undefined, actionId, 'bar');

    } else if (actionId === 'total-month') {
      this.showChartElement.classList.remove('grid-cols-1', 'grid-cols-3');
      this.showChartElement.classList.add('grid-cols-2');
      this.barHorizontalElement.classList.remove('hidden');
      this.titlechart.innerHTML = 'Grand total by language';
      renderAutoChart(data.dataForChart, undefined, 'plot-all', 'bar');
      renderAutoChart(data.dataForChart2, 'barChartHorizontal', 'top-center', 'bar');

    } else if (actionId === 'plot-all') {
      this.showChartElement.classList.remove('grid-cols-1', 'grid-cols-3');
      this.showChartElement.classList.add('grid-cols-2');
      this.pieChartElement.classList.remove('hidden');
      this.titlechart.innerHTML = 'Total Email by type';
      console.log('from plot-all:',data.dataForChart, data.dataForChart2)
      renderAutoChart(data.dataForChart, undefined, 'plot-all', 'bar');
      renderLineChart(data.dataForChart2, undefined, 'top-center');

      } else {
      this.showChartElement.classList.remove('grid-cols-1', 'grid-cols-3');
      this.showChartElement.classList.add('grid-cols-1');
      // this.pieChartElement.classList.remove('hidden');
      
      if (actionId === 'inquiry') {
        this.titlechart.innerHTML = 'Type Inquiry';
        renderAutoChart(data, undefined, 'inquiry', 'bar')

      } else if (actionId === 'appointment') {
        this.titlechart.innerHTML = 'Type Appointment';
        renderAutoChart(data, undefined, 'inquiry', 'bar')

      } else if (actionId === 'feedback') {
        this.titlechart.innerHTML = 'Type Feedback';
        renderAutoChart(data, undefined, 'inquiry', 'bar')

      } else {
        console.warn("Unknown data format for chart rendering:", data);
      }
    }
  }
}

export default ChartRenderer;