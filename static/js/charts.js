let chartInstances = {};  // เก็บ instance ตาม canvas id


export function renderAutoChart(data, canvasId = 'barChart', type_colors = 'null') {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.error('📉 No data provided', data);
    // return;
  }
  console.log(type_colors)

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
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#F87171', '#34D399'
  ];

  // สร้าง dataset สำหรับแต่ละ key
  const datasets = yKeys.map((key, i) => ({
    label: key.replace(/_/g, ' ').toUpperCase(),
    data: data.map(d => d[key]),
    backgroundColor: colors[i % colors.length],
    borderColor: colors[i % colors.length],
    borderWidth: 1,
  }));

  // สร้างกราฟใหม่
  chartInstances[canvasId] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets
    },
    options: {
      responsive: true,
      // maintainAspectRatio: false,  // เปิดให้ canvas ยืดตาม container
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: `Chart: ${yKeys.join(', ')} by ${xKey}`
        }
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

export function change_colors(type) {
  const default_colors = [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#F87171', '#34D399'
        ];
  const cat_colors = {
    // 'inquiry': [];
  }
  if (type === 'inquiry') {

  } else if (type === ''){

  } else {
    return default_colors
  }
}
