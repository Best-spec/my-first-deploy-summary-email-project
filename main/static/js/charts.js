let chartInstances = {};  // เก็บ instance ตาม canvas id
import { change_colors } from './color_chart.js';
import { buildDatasets, valueLabelPlugin } from './chartsPlugin.js';
import { createGradient } from './chartsHelper.js';
// import { buildDatasets } from './chartsConfig.js';
import { 
  generateEnglishShades,
  generateThaiShades,
  generateRussianShades,
  generateGermanShades,
  generateChineseShades,
  generateArabicShades
} from './flagColor.js';

// export function renderAutoChart(data, config = {}) {
//   // Default config
//   const {
//     canvasId = 'bar-chart-box',
//     typeColors = 'null',
//     chartType = 'bar',
//     colorMode = 'dataset', // 'dataset' หรือ 'point'
//     yScale = 'logarithmic' // หรือ 'linear'
//   } = config;

//   // Validate data
//   if (!data || !Array.isArray(data) || data.length === 0) {
//     console.error('📉 No data provided', data);
//     return;
//   }

//   // Get canvas
//   const canvas = document.getElementById(canvasId);
//   if (!canvas) {
//     console.error(`🛑 Canvas with id "${canvasId}" not found`);
//     return;
//   }

//   // Destroy chart ถ้ามีของเก่า
//   if (chartInstances[canvasId]) {
//     chartInstances[canvasId].destroy();
//     chartInstances[canvasId] = null;
//   }

//   const ctx = canvas.getContext('2d');
//   const keys = Object.keys(data[0]);
//   if (keys.length < 2) {
//     console.error('❗ Data must have at least 2 fields');
//     return;
//   }

//   const xKey = keys[0];
//   const yKeys = keys.slice(1);
//   const labels = data.map(d => d[xKey]);
//   const colors = change_colors(typeColors);

//   // ✅ ใช้ helper function
//   const datasets = buildDatasets(data, yKeys, colors, colorMode);

//   // ✅ ใช้ helper function สำหรับ options
//   const options = buildChartOptions(chartType, yScale);

//   chartInstances[canvasId] = new Chart(ctx, {
//     type: chartType,
//     data: { labels, datasets },
//     options
//   });
// }

// 📌 ปลั๊กอินโชว์ตัวเลขบนแท่ง/จุด

// export function renderAutoChart(data, config = {}) {
//   // Default config
//   const {
//     canvasId = 'bar-chart-box',
//     typeColors = 'null',
//     chartType = 'bar',
//     colorMode = 'dataset', // 'dataset' หรือ 'point'
//     yScale = 'logarithmic', // หรือ 'linear'
//     showValueLabels = true, // ✅ เปิดตัวเลขบนแทงกราฟ
//     valueLabelOptions = {   // ✅ ปรับแต่งตัวเลขได้
//       align: 'top',
//       offset: 6,
//       fontSize: 11,
//       fontWeight: '600',
//       color: '#222',
//       formatter: (v) => new Intl.NumberFormat().format(v)
//     }
//   } = config;

//   if (!data || !Array.isArray(data) || data.length === 0) {
//     console.error('📉 No data provided', data);
//     return;
//   }

//   const canvas = document.getElementById(canvasId);
//   if (!canvas) {
//     console.error(`🛑 Canvas with id "${canvasId}" not found`);
//     return;
//   }

//   if (chartInstances[canvasId]) {
//     chartInstances[canvasId].destroy();
//     chartInstances[canvasId] = null;
//   }

//   const ctx = canvas.getContext('2d');
//   const keys = Object.keys(data[0]);
//   if (keys.length < 2) {
//     console.error('❗ Data must have at least 2 fields');
//     return;
//   }

//   const xKey = keys[0];
//   const yKeys = keys.slice(1);
//   const labels = data.map(d => d[xKey]);
//   const colors = change_colors(typeColors);

//   const datasets = buildDatasets(data, yKeys, colors, colorMode);
//   const options = buildChartOptions(chartType, yScale);

//   // ✅ ยัดปลั๊กอินโชว์ตัวเลข
//   const plugins = [];
//   if (showValueLabels) {
//     // ห่อ option ไว้ให้ plugin
//     plugins.push({ ...valueLabelPlugin, options: valueLabelOptions });
//   }

//   chartInstances[canvasId] = new Chart(ctx, {
//     type: chartType,
//     data: { labels, datasets },
//     options: {
//       ...options,
//       plugins: {
//         ...options?.plugins,
//         // เผื่ออยากเปิด/ปิด legend/title ผ่าน buildChartOptions
//       }
//     },
//     plugins
//   });
// }

export function renderAutoChart(data, config = {}) {
  const {
    canvasId = 'bar-chart-box',
    typeColors = 'null',
    chartType = 'bar',
    colorMode = 'dataset',
    yScale = 'logarithmic',

    // สไตล์เส้น (ถ้าเป็น line)
    datasetStyle = {
      borderWidth: chartType === 'bar' ? 0 : 3, 
      tension: 0.45,
      fill: chartType === 'line',
      backgroundOpacity: 0.18,
      pointRadius: 5,
      pointHoverRadius: 8
    },
    useGradient = chartType === 'line',

    showValueLabels = true,
    valueLabelOptions = {
      align: 'top',
      offset: 6,
      fontSize: 14,
      fontWeight: '600',
      color: '#222',
      formatter: (v) => new Intl.NumberFormat().format(v)
    }
  } = config;

  if (!data || !Array.isArray(data) || data.length === 0) {
    console.error('📉 No data provided', data);
    return;
  }

  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`🛑 Canvas with id "${canvasId}" not found`);
    return;
  }

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

  // ส่ง style เข้า buildDatasets (ต้องเป็นเวอร์ชันที่รองรับ options)
  const datasets = buildDatasets(
    data,
    yKeys,
    colors,
    colorMode,
    { chartType, datasetStyle }
  );

  // ใช้ gradient ใต้เส้น (เฉพาะ line + fill true)
  if (chartType === 'line' && useGradient) {
    datasets.forEach((ds, i) => {
      if (!ds.fill) return;
      const base = colors[i % colors.length];
      ds.backgroundColor = createGradient(
        ctx,
        canvas,
        base,
        ds.backgroundOpacity ?? 0.18,
        0.02
      );
    });
  }

  const options = buildChartOptions(chartType, yScale);

  const plugins = [];
  if (showValueLabels) {
    plugins.push({ ...valueLabelPlugin, options: valueLabelOptions });
  }

  chartInstances[canvasId] = new Chart(ctx, {
    type: chartType,
    data: { labels, datasets },
    options: {
      ...options,
      plugins: { ...options?.plugins }
    },
    plugins
  });
}


/**
 * สร้าง datasets ตามโหมดสี
 */
// function buildDatasets(data, yKeys, colors, colorMode) {
//   return yKeys.map((key, i) => {
//     const color = colors[i % colors.length];
//     const pointColors = data.map((_, idx) => colors[idx % colors.length]);

//     return {
//       label: key.replace(/_/g, ' ').toUpperCase(),
//       data: data.map(d => d[key]),
//       backgroundColor: colorMode === 'point' ? pointColors : color,
//       borderWidth: 1, 
//       fill: false,
//       tension: 0.3
//     };
//   });
// }

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


// ✅ Plugin โชว์ตัวเลขบนชิ้นพาย (ค่า + %)
const pieValueLabelPlugin = {
  id: 'pieValueLabel',
  afterDatasetsDraw(chart, args, pluginOptions) {
    const {
      fontSize = 12,
      fontWeight = '600',
      color = null,            // ถ้าไม่ใส่จะ auto ตามความสว่างของชิ้นพาย
      minPercentToShow = 3,    // % ต่ำกว่านี้จะไม่โชว์กันเละ
      formatter = (_, percent) => `${percent}%`,
    } = pluginOptions || {};

    const { ctx, data } = chart;
    const ds = data.datasets?.[0];
    if (!ds) return;

    const values = ds.data || [];
    const total = values.reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

    const bg = ds.backgroundColor || [];
    const getAutoTextColor = (c) => {
      // รองรับ hsl(...) และ hex (#rrggbb)
      if (typeof c !== 'string') return '#222';
      if (c.startsWith('hsl')) {
        const m = c.match(/hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)/i);
        if (m) {
          const L = parseFloat(m[3]);
          return L < 50 ? '#fff' : '#222';
        }
      }
      if (c.startsWith('#') && (c.length === 7 || c.length === 4)) {
        // คำนวณความสว่างแบบง่าย ๆ
        let r, g, b;
        if (c.length === 7) {
          r = parseInt(c.slice(1,3), 16);
          g = parseInt(c.slice(3,5), 16);
          b = parseInt(c.slice(5,7), 16);
        } else {
          r = parseInt(c[1] + c[1], 16);
          g = parseInt(c[2] + c[2], 16);
          b = parseInt(c[3] + c[3], 16);
        }
        const luminance = (0.2126*r + 0.7152*g + 0.0722*b) / 255;
        return luminance < 0.55 ? '#fff' : '#222';
      }
      return '#222';
    };

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${fontWeight} ${fontSize}px system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial`;

    chart.data.datasets.forEach((dataset, dsIndex) => {
      const meta = chart.getDatasetMeta(dsIndex);
      if (meta.hidden) return;

      meta.data.forEach((arc, i) => {
        const v = values[i];
        if (v == null || Number.isNaN(v)) return;

        const pct = total > 0 ? (v / total) * 100 : 0;
        if (pct < minPercentToShow) return;

        const pos = arc.tooltipPosition(); // ใจกลางชิ้นพาย
        const label = formatter(
          new Intl.NumberFormat().format(v),
          Math.round(pct)
        );

        ctx.fillStyle = color || getAutoTextColor(bg[i] || bg[0]);
        ctx.fillText(label, pos.x, pos.y);
      });
    });

    ctx.restore();
  }
};


export function renderPieChartBoxes(langs, pieData, typeColors) {
  const container = document.getElementById('pie-charts-container');
  container.innerHTML = '';

  langs.forEach(lang => {
    const box = createPieChartBox(lang);
    container.appendChild(box);
  });

  Object.entries(pieData).forEach(([lang, chartData]) => {
    const ctx = document.getElementById(`pie-chart-canvas-${lang}`).getContext('2d');
    const labels = Object.keys(chartData);
    const values = Object.values(chartData);

    const cat_colors = {
      'English': generateEnglishShades(8),
      'Thai': generateThaiShades(8),
      'Russia': generateRussianShades(8),
      'German': generateGermanShades(8),
      'Chinese': generateChineseShades(8),
      'Arabic': generateArabicShades(8)
    };

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: cat_colors[lang]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: false },
          // ✅ เปลี่ยน tooltip เป็น %
          tooltip: {
            callbacks: {
              label: (context) => {
                const dataset = context.dataset;
                const dataArr = dataset.data || [];
                const total = dataArr.reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
                const val = dataArr[context.dataIndex] || 0;
                const pct = total ? (val / total) * 100 : 0;
                const pctStr = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(pct);
                const label = context.label ?? '';
                // return `${label}: ${pctStr}%`; // โชว์แค่ %
                return `${pctStr}%`; // โชว์แค่ %
              }
            }
          }
        }
      },
      plugins: [
        // ถ้าใช้ปลั๊กอินเลขในชิ้นพายอยู่แล้วก็ใส่ต่อได้
        { ...pieValueLabelPlugin, options: { fontSize: 13, minPercentToShow: 3 } }
      ]
    });

  });
}


