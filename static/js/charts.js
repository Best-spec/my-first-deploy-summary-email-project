let autoChartInstance = null;

export function renderAutoChart(data, canvasId = 'barChart') {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.error('📉 No data provided');
    return;
  }

  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`🛑 Canvas with id "${canvasId}" not found`);
    return;
  }

  const ctx = canvas.getContext('2d');

  // เคลียร์ chart เดิมถ้ามี
  if (autoChartInstance) {
    autoChartInstance.destroy();
  }

  const keys = Object.keys(data[0]);
  if (keys.length < 2) {
    console.error('❗ Data must have at least 2 fields');
    return;
  }

  const xKey = keys[0]; // สมมุติ key แรกเป็น x-axis
  const yKeys = keys.slice(1); // ที่เหลือคือข้อมูลที่ plot

  const labels = data.map(d => d[xKey]);

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#F87171', '#34D399'
  ];

  const datasets = yKeys.map((key, i) => ({
    label: key.replace(/_/g, ' ').toUpperCase(),
    data: data.map(d => d[key]),
    backgroundColor: colors[i % colors.length],
    borderColor: colors[i % colors.length],
    borderWidth: 1
  }));

  autoChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: `Auto Chart: ${yKeys.join(', ')} by ${xKey}`
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

let pieInstance = null;

export function renderAutoPieChart(data, canvasId = 'myPieChart') {
  if (!data || data.length === 0) {
    console.error('📉 ไม่มีข้อมูล');
    return;
  }

  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`🛑 ไม่เจอ canvas id "${canvasId}"`);
    return;
  }

  const ctx = canvas.getContext('2d');

  if (pieInstance) pieInstance.destroy();

  const keys = Object.keys(data[0]);
  if (keys.length < 2) {
    console.error('❗ Data ต้องมีอย่างน้อย 2 field');
    return;
  }

  const labelKey = keys[0];      // อันแรกใช้เป็น label (เช่น "language")
  const valueKey = keys[1];      // อันถัดมาใช้เป็น value (เช่น "total")

  const labels = data.map(d => d[labelKey]);
  const values = data.map(d => d[valueKey]);

  const colors = [
    '#60A5FA', '#34D399', '#FBBF24', '#F87171',
    '#A78BFA', '#F472B6', '#FCD34D', '#4ADE80'
  ];

  pieInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        label: valueKey.toUpperCase(),
        data: values,
        backgroundColor: colors.slice(0, values.length),
        borderWidth: 1,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: {
          display: true,
          text: `Pie Chart: ${valueKey.replace(/_/g, ' ')} by ${labelKey}`
        }
      }
    }
  });
}

