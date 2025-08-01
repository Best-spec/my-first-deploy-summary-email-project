let chartInstances = {};  // เก็บ instance ตาม canvas id


// export function renderAutoChart(data, canvasId = 'bar-chart-box', type_colors = 'null', chartType = 'bar') {
//   if (!data || !Array.isArray(data) || data.length === 0) { 
//     console.error('📉 No data provided', data);
//     return;
//   }
//   console.log("from bar:",data)

//   const canvas = document.getElementById(canvasId);
//   if (!canvas) {
//     console.error(`🛑 Canvas with id "${canvasId}" not found`);
//     return;
//   }

//   // ล้างกราฟเก่า+reset canvas style เพื่อไม่ให้มันยืดยาว
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

//   // สีชุดข้อมูลสวยๆ
//   const colors = change_colors(type_colors)

//   // สร้าง dataset สำหรับแต่ละ key
//   const datasets = yKeys.map((key, i) => ({
//     label: key.replace(/_/g, ' ').toUpperCase(),
//     data: data.map(d => d[key]),
//     // backgroundColor: colors[i % colors.length],
//     backgroundColor: data.map((_, idx) => colors[idx % colors.length]),
//     borderColor: colors[i % colors.length],
//     borderWidth: 1,
//   }));
//   data.map(d => console.log(d))
//   // console.log(data)

//   // สร้างกราฟใหม่
//   chartInstances[canvasId] = new Chart(ctx, {
//     type: chartType,
//     data: {
//       labels,
//       datasets
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,  // เปิดให้ canvas ยืดตาม container
//       plugins: {
//         // legend: { position: 'top' },
//         // title: {
//         //   display: true,
//         //   text: `Chart: ${yKeys.join(', ')} by ${xKey}`
//         // }
//       },
//       scales: {
//         y: {
//           type: 'logarithmic',
//           min: 1
//         }
//       }
//     }
//   });
// }

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
      borderColor: color,
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


export function change_colors(type) {
  const cat_colors = {
    'default_colors': ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#F87171', '#34D399'],
    'inquiry': ['#1976d2','#1e88e5','#2196f3','#64b5f6','#bbdefb','#e3f2fd'],
    'top-center': generatePurpleShades(20), 
    'plot-all': ['#512e5f','#76448a','#9b59b6','#c39bd3','#ebdef0','#f5eef8']
  }

  if (type && cat_colors[type]) {
    return cat_colors[type];
  }
  return cat_colors['default_colors'];
}

// 👇 ฟังก์ชันสร้างม่วงเข้มไปอ่อน N เฉดอัตโนมัติ
function generatePurpleShades(count = 20) {
  const shades = [];
  for (let i = 0; i < count; i++) {
    const lightness = 25 + (i * (50 / (count - 1))); // ไล่จาก 25% -> 75%
    shades.push(`hsl(270, 60%, ${lightness}%)`); // h=270 คือม่วง
  }
  return shades;
}

