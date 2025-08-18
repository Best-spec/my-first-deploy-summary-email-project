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

const valueLabelPlugin = {
  id: 'valueLabel',
  afterDatasetsDraw(chart, args, pluginOptions) {
    const {
      align = 'top',
      offset = 10,
      fontSize = 16,
      fontWeight = '400',
      color = '#222',
      formatter = (v) => {
        if (v === null || v === undefined || Number.isNaN(v)) return '';
        try { return new Intl.NumberFormat().format(v); } catch { return String(v); }
      }
    } = pluginOptions || {};

    const { ctx } = chart;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${fontWeight} ${fontSize}px system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial`;
    ctx.fillStyle = color;

    chart.data.datasets.forEach((dataset, dsIndex) => {
      const meta = chart.getDatasetMeta(dsIndex);
      if (meta.hidden) return;

      meta.data.forEach((element, i) => {
        const raw = dataset.data?.[i];
        const label = formatter(raw);
        if (!label) return;

        const pos = element.tooltipPosition();
        let x = pos.x;
        let y = pos.y;

        switch (align) {
          case 'top':    y -= offset; break;
          case 'bottom': y += offset; break;
          case 'left':   x -= offset; ctx.textAlign = 'right';  break;
          case 'right':  x += offset; ctx.textAlign = 'left';   break;
        }

        ctx.fillText(label, x, y);
      });
    });

    ctx.restore();
  }
};


export function renderAutoChart(data, config = {}) {
  // Default config
  const {
    canvasId = 'bar-chart-box',
    typeColors = 'null',
    chartType = 'bar',
    colorMode = 'dataset', // 'dataset' หรือ 'point'
    yScale = 'logarithmic', // หรือ 'linear'
    showValueLabels = true, // ✅ เปิดตัวเลขบนแทงกราฟ
    valueLabelOptions = {   // ✅ ปรับแต่งตัวเลขได้
      align: 'top',
      offset: 6,
      fontSize: 11,
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

  const datasets = buildDatasets(data, yKeys, colors, colorMode);
  const options = buildChartOptions(chartType, yScale);

  // ✅ ยัดปลั๊กอินโชว์ตัวเลข
  const plugins = [];
  if (showValueLabels) {
    // ห่อ option ไว้ให้ plugin
    plugins.push({ ...valueLabelPlugin, options: valueLabelOptions });
  }

  chartInstances[canvasId] = new Chart(ctx, {
    type: chartType,
    data: { labels, datasets },
    options: {
      ...options,
      plugins: {
        ...options?.plugins,
        // เผื่ออยากเปิด/ปิด legend/title ผ่าน buildChartOptions
      }
    },
    plugins
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


// export function renderPieChartBoxes(langs, pieData, typeColors) {
//     const container = document.getElementById('pie-charts-container');
//     container.innerHTML = ''; // เคลียร์เก่าก่อน
//     langs.forEach(lang => {
//         const box = createPieChartBox(lang);
//         container.appendChild(box);
//     });

//     Object.entries(pieData).forEach(([lang, chartData]) => {
//         const ctx = document.getElementById(`pie-chart-canvas-${lang}`).getContext('2d');
//         const labels = Object.keys(chartData);
//         const values = Object.values(chartData);

//         let countryColors;
//         const cat_colors = {
//           'English': generateEnglishShades(8),
//           'Thai': generateThaiShades(8),
//           'Russia': generateRussianShades(8),
//           'German': generateGermanShades(8),
//           'Chinese': generateChineseShades(8),
//           'Arabic': generateArabicShades(8)
//         }
        
//         if (lang && cat_colors[lang]) {
//           countryColors = cat_colors[lang];
//         }
    
//         new Chart(ctx, {
//             type: 'pie',
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     data: values,
//                     backgroundColor: cat_colors[lang]
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 plugins: {
//                     legend: { position: 'top' },
//                     title: {
//                         display: false
//                     }
//                 }
//             }
//         });
//     });

// }




// export function renderLineChart(
//   data,
//   canvasId = 'mylineChart',
//   type_colors = 'null',
//   chartType = 'line' // 👈 ส่ง 'line' มาได้
// ) {

//   if (
//     !data ||
//     !Array.isArray(data) ||
//     data.length === 0 ||
//     data.every(item => Object.keys(item).length === 0)
//   ) {
//     console.error("📉 No data provided", data);
//     return;
//   }

//   console.log("from line:", data);

//   const canvas = document.getElementById(canvasId);
//   if (!canvas) {
//     console.error(`🛑 Canvas with id "${canvasId}" not found`);
//     return;
//   }

//   // ล้างกราฟเก่า+reset canvas style
//   if (chartInstances[canvasId]) {
//     chartInstances[canvasId].destroy();
//     chartInstances[canvasId] = null;

//     canvas.style.width = null;
//     canvas.style.height = null;
//   }

//   const ctx = canvas.getContext('2d');

//   // กำหนดข้อมูลและ labels
//   const keys = Object.keys(data[0]);
//   if (keys.length < 2) {
//     console.error('❗ Data must have at least 2 fields');
//     return;
//   }

//   const xKey = keys[0];
//   const yKeys = keys.slice(1);
//   const labels = data.map(d => d[xKey]);

//   // สีชุดข้อมูล
//   const colors = change_colors(type_colors);

//   // dataset สำหรับแต่ละ key
//   const datasets = yKeys.map((key, i) => ({
//     label: key.replace(/_/g, ' ').toUpperCase(),
//     data: data.map(d => d[key]),
//     backgroundColor: chartType === 'bar' 
//       ? colors[i % colors.length] 
//       : 'transparent', // line chart ไม่ fill สี block
//     borderColor: colors[i % colors.length],
//     borderWidth: 2,
//     fill: chartType === 'line' ? false : true, // line ไม่ fill
//     tension: chartType === 'line' ? 0.3 : 0,   // เส้นโค้งเฉพาะ line
//     pointBackgroundColor: chartType === 'line' ? '#fff' : undefined,
//     pointRadius: chartType === 'line' ? 4 : undefined,
//   }));

//   // สร้าง chart ใหม่
//   chartInstances[canvasId] = new Chart(ctx, {
//     type: chartType, // 👈 เลือก 'bar' หรือ 'line'
//     data: {
//       labels,
//       datasets
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: { display: true, position: 'top' }
//       },
//       scales: {
//         y: {
//           // ถ้าเป็น line ใช้ linear, ถ้าเป็น bar คงใช้ log ได้
//           type: chartType === 'line' ? 'linear' : 'logarithmic',
//           beginAtZero: chartType === 'line',
//           min: chartType === 'line' ? 0 : 1
//         }
//       }
//     }
//   });
// }


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

    // new Chart(ctx, {
    //   type: 'pie',
    //   data: {
    //     labels,
    //     datasets: [{
    //       data: values,
    //       backgroundColor: cat_colors[lang]
    //     }]
    //   },
    //   options: {
    //     responsive: true,
    //     plugins: {
    //       legend: { position: 'top' },
    //       title: { display: false }
    //     }
    //   },
    //   plugins: [
    //     // ✅ เปิดเลขบนชิ้นพาย
    //     { ...pieValueLabelPlugin, options: { fontSize: 13, minPercentToShow: 3 } }
    //   ]
    // });
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


