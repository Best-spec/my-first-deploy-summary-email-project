let chartInstances = {};  // เก็บ instance ตาม canvas id


export function renderAutoChart(data, canvasId = 'barChart', type_colors = 'null', chartType = 'bar') {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.error('📉 No data provided', data);
    return;
  }
  console.log("from chart:",data)

  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`🛑 Canvas with id "${canvasId}" not found`);
    return;
  }

  // ล้างกราฟเก่า+reset canvas style เพื่อไม่ให้มันยืดยาว
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

  // สีชุดข้อมูลสวยๆ
  const colors = change_colors(type_colors)

  // สร้าง dataset สำหรับแต่ละ key
  const datasets = yKeys.map((key, i) => ({
    label: key.replace(/_/g, ' ').toUpperCase(),
    data: data.map(d => d[key]),
    backgroundColor: colors[i % colors.length],
    borderColor: colors[i % colors.length],
    borderWidth: 1,
  }));
  data.map(d => console.log(d))
  // console.log(data)

  // สร้างกราฟใหม่
  chartInstances[canvasId] = new Chart(ctx, {
    type: chartType,
    data: {
      labels,
      datasets
    },
    options: {
      responsive: true,
      // maintainAspectRatio: false,  // เปิดให้ canvas ยืดตาม container
      plugins: {
        // legend: { position: 'top' },
        // title: {
        //   display: true,
        //   text: `Chart: ${yKeys.join(', ')} by ${xKey}`
        // }
      },
      scales: {
        y: {
          type: 'logarithmic',
          min: 1
        }
      }
    }
  });
}

// export function renderLineChart(data, canvasId = 'mylineChart', type_colors = 'null') {

//   const canvas = document.getElementById(canvasId);
//     // ล้างกราฟเก่า+reset canvas style เพื่อไม่ให้มันยืดยาว
//   if (chartInstances[canvasId]) {
//     chartInstances[canvasId].destroy();
//     chartInstances[canvasId] = null;

//     canvas.style.width = null;
//     canvas.style.height = null;
//   }

//   const ctx = canvas.getContext('2d');

//   chartInstances[canvasId] = new Chart(ctx, {
//     type: 'line', // กราฟเส้น
//     data: {
//         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // ค่าแกน X
//         datasets: [
//             {
//               label: 'ยอดขาย (บาท)',
//               data: [120, 190, 300, 250, 400, 500], // ค่าแกน Y
//               borderColor: 'rgb(75, 192, 192)',
//               backgroundColor: 'rgba(75, 192, 192, 0.2)',
//               tension: 0.3, // ทำเส้นโค้ง (0 = เส้นตรง)
//               // fill: true, // เติมสีใต้กราฟ
//               pointBackgroundColor: '#fff', // จุดสีขาว
//               pointBorderColor: 'rgb(75, 192, 192)',
//               pointRadius: 5 // ขนาดจุด
//             },

//             {
//               label: 'รายรับ',
//               data: [100, 200], // ค่าแกน Y
//               borderColor: 'rgb(75, 192, 192)',
//               backgroundColor: 'rgba(75, 192, 192, 0.2)',
//               tension: 0.3, // ทำเส้นโค้ง (0 = เส้นตรง)
//               // fill: true, // เติมสีใต้กราฟ
//               pointBackgroundColor: '#fff', // จุดสีขาว
//               pointBorderColor: 'rgb(75, 192, 192)',
//               pointRadius: 5 // ขนาดจุด
//             }
//         ]
//     },
//     options: {
//         responsive: true,
//         plugins: {
//             title: {
//                 display: true,
//                 text: 'กราฟยอดขายรายเดือน',
//                 font: { size: 18 }
//             },
//             // tooltip: {
//             //     callbacks: {
//             //         label: (context) => ` ${context.raw} บาท`
//             //     }
//             // }
//         },
//         scales: {
//             y: {
//                 beginAtZero: true,
//                 ticks: { stepSize: 100 }
//             }
//         }
//     }
//   });
// }

export function renderLineChart(
  data,
  canvasId = 'mylineChart',
  type_colors = 'null',
  chartType = 'line' // 👈 ส่ง 'line' มาได้
) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.error('📉 No data provided', data);
    // return;
  }
  console.log("from chart:", data);

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
  const default_colors = [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#F87171', '#34D399'
        ];
  const cat_colors = {
    'inquiry': ['#1976d2','#1e88e5','#2196f3','#64b5f6','#bbdefb','#e3f2fd'],
    'top-center': ['#48c9b0','#1abc9c','#17a589','#148f77','#117864','#0e6251'],
    'plot-all': ['#512e5f','#76448a','#9b59b6','#c39bd3','#ebdef0','#f5eef8']
  }

  if (type === 'inquiry') {
    return cat_colors['inquiry']

  } else if (type === 'top-center') {
    return cat_colors['top-center']

  } else if (type === 'plot-all') {
    return cat_colors['plot-all']

  } else {
    return default_colors
  }
}
