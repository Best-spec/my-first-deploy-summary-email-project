let chartInstances = {};  // เก็บ instance ตาม canvas id
import { change_colors } from './color_chart.js';
import { 
  generateEnglishShades,
  generateThaiShades,
  generateRussianShades,
  generateGermanShades,
  generateChineseShades,
  generateArabicShades
} from './flagColor.js';

export function renderAutoChart(data, config = {}) {
  // Default config
  const {
    canvasId = 'bar-chart-box',
    typeColors = 'null',
    chartType = 'bar',
    colorMode = 'dataset', // 'dataset' หรือ 'point'
    yScale = 'logarithmic' // หรือ 'linear'
  } = config;

  // Validate data
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.error('📉 No data provided', data);
    return;
  }

  // Get canvas
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`🛑 Canvas with id "${canvasId}" not found`);
    return;
  }

  // Destroy chart ถ้ามีของเก่า
  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
    chartInstances[canvasId] = null;
  }

  const ctx = canvas.getContext('2d');
  const keys = Object.keys(data[0]);
  if (keys.length < 2) {
    console.error('❗ Data must have at least 2 fields');
    return;
  }

  const xKey = keys[0];
  const yKeys = keys.slice(1);
  const labels = data.map(d => d[xKey]);
  const colors = change_colors(typeColors);

  // ✅ ใช้ helper function
  const datasets = buildDatasets(data, yKeys, colors, colorMode);

  // ✅ ใช้ helper function สำหรับ options
  const options = buildChartOptions(chartType, yScale);

  chartInstances[canvasId] = new Chart(ctx, {
    type: chartType,
    data: { labels, datasets },
    options
  });
}

/**
 * สร้าง datasets ตามโหมดสี
 */
function buildDatasets(data, yKeys, colors, colorMode) {
  return yKeys.map((key, i) => {
    const color = colors[i % colors.length];
    const pointColors = data.map((_, idx) => colors[idx % colors.length]);

    return {
      label: key.replace(/_/g, ' ').toUpperCase(),
      data: data.map(d => d[key]),
      backgroundColor: colorMode === 'point' ? pointColors : color,
      borderWidth: 1,
      fill: false,
      tension: 0.3
    };
  });
}

/**
 * สร้าง option สำหรับ chart (clean)
 */
function buildChartOptions(chartType, yScale) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: chartType === 'line' ? 'linear' : yScale,
        min: chartType === 'line' ? 0 : 1
      }
    }
  };
}

function createPieChartBox(lang) {
    const box = document.createElement('div');
    box.className = "bg-white rounded-xl p-6 h-120";

    const title = document.createElement('h3');
    title.className = "text-xl font-bold text-gray-800 mb-4";
    title.textContent = `Pie Chart - ${lang}`;

    const canvas = document.createElement('canvas');
    canvas.id = `pie-chart-canvas-${lang}`;

    box.appendChild(title);
    box.appendChild(canvas);

    return box;
}

export function renderPieChartBoxes(langs, pieData, typeColors) {
    const container = document.getElementById('pie-charts-container');
    container.innerHTML = ''; // เคลียร์เก่าก่อน
    langs.forEach(lang => {
        const box = createPieChartBox(lang);
        container.appendChild(box);
    });

    Object.entries(pieData).forEach(([lang, chartData]) => {
        const ctx = document.getElementById(`pie-chart-canvas-${lang}`).getContext('2d');
        const labels = Object.keys(chartData);
        const values = Object.values(chartData);

        let countryColors;
        const cat_colors = {
          'English': generateEnglishShades(8),
          'Thai': generateThaiShades(8),
          'Russia': generateRussianShades(8),
          'German': generateGermanShades(8),
          'Chinese': generateChineseShades(8),
          'Arabic': generateArabicShades(8)
        }
        
        if (lang && cat_colors[lang]) {
          countryColors = cat_colors[lang];
        }
    
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: cat_colors[lang]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: {
                        display: false
                    }
                }
            }
        });
    });

}




export function renderLineChart(
  data,
  canvasId = 'mylineChart',
  type_colors = 'null',
  chartType = 'line' // 👈 ส่ง 'line' มาได้
) {

  if (
    !data ||
    !Array.isArray(data) ||
    data.length === 0 ||
    data.every(item => Object.keys(item).length === 0)
  ) {
    console.error("📉 No data provided", data);
    return;
  }

  console.log("from line:", data);

  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`🛑 Canvas with id "${canvasId}" not found`);
    return;
  }

  // ล้างกราฟเก่า+reset canvas style
  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
    chartInstances[canvasId] = null;

    canvas.style.width = null;
    canvas.style.height = null;
  }

  const ctx = canvas.getContext('2d');

  // กำหนดข้อมูลและ labels
  const keys = Object.keys(data[0]);
  if (keys.length < 2) {
    console.error('❗ Data must have at least 2 fields');
    return;
  }

  const xKey = keys[0];
  const yKeys = keys.slice(1);
  const labels = data.map(d => d[xKey]);

  // สีชุดข้อมูล
  const colors = change_colors(type_colors);

  // dataset สำหรับแต่ละ key
  const datasets = yKeys.map((key, i) => ({
    label: key.replace(/_/g, ' ').toUpperCase(),
    data: data.map(d => d[key]),
    backgroundColor: chartType === 'bar' 
      ? colors[i % colors.length] 
      : 'transparent', // line chart ไม่ fill สี block
    borderColor: colors[i % colors.length],
    borderWidth: 2,
    fill: chartType === 'line' ? false : true, // line ไม่ fill
    tension: chartType === 'line' ? 0.3 : 0,   // เส้นโค้งเฉพาะ line
    pointBackgroundColor: chartType === 'line' ? '#fff' : undefined,
    pointRadius: chartType === 'line' ? 4 : undefined,
  }));

  // สร้าง chart ใหม่
  chartInstances[canvasId] = new Chart(ctx, {
    type: chartType, // 👈 เลือก 'bar' หรือ 'line'
    data: {
      labels,
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'top' }
      },
      scales: {
        y: {
          // ถ้าเป็น line ใช้ linear, ถ้าเป็น bar คงใช้ log ได้
          type: chartType === 'line' ? 'linear' : 'logarithmic',
          beginAtZero: chartType === 'line',
          min: chartType === 'line' ? 0 : 1
        }
      }
    }
  });
}

