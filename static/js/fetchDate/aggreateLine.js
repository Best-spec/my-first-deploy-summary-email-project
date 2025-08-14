import { line }from './mock.js';
import { getCsrfToken } from './utility.js';
import { renderAutoChart } from '../charts.js';
import { getDateRange1, getDateRange2, set_btn_id } from '../datetime.js';

export function dataLineChart() {
  const btn = document.getElementById('btnFetch');
  const mode = document.getElementById('mode');
  const status = document.getElementById('status');
  let controller = null;
  let debounceTimer = null;

  mode.addEventListener('change', () => {
    console.log('กดปุ่มแล้วนะ')
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(()=> doFetch(), 200);
  });

  async function doFetch(){
    if (controller) controller.abort();          // cancel previous
    controller = new AbortController();
    
    // const payload = { /* เตรียม payload ตามตัวอย่าง */ };
    // ตัวอย่าง payload
    const payload = {
      // data: [
      //   { date: '01/04/2025', emails: 12, errors: 1 },
      //   { date: '02/04/2025', emails: 7,  errors: 0 },
      //   { date: '2025-04-03', emails: 9,  errors: 2 }
      // ],      
      data : line,
      period: 'day',
      mode: 'sum',
      // range: { startDate: '2025-01-01', endDate: '2025-01-30' }
      range: getDateRange1()
    };
    payload.period = mode.value;

    try {
      const res = await fetch('aggregate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
        credentials: 'include',
        signal: controller.signal,
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = await res.json();
      console.log(json);
      console.log(line);
      console.log(getDateRange1());

      renderLine(json.primary);
      console.log('อัพเดทกราฟแล้ว')
    } catch (err) {
      
    } finally {
      controller = null;
    }
  }
}


function renderLine(data) {
  // this.lineChartBox.classList.remove('hidden');
  // this.titleline.innerHTML = 'Grand Total By Email Type (LineChart)';
  console.log(data)
  renderAutoChart(data, {
    canvasId: 'line-chart-canvas',
    typeColors: 'by-type',
    chartType: 'line',       // 📌 กราฟเส้น
    colorMode: 'dataset',    // สีตาม dataset
    yScale: 'logarithmic',        // แกน Y เส้นตรง

    // ✅ แต่งเส้นให้สวย
    datasetStyle: {
      borderWidth: 3,        // เส้นหนา
      tension: 0.45,         // โค้งนุ่ม
      fill: true,            // เติมสีใต้เส้น
      backgroundOpacity: 0.18,
      pointRadius: 5,        // จุดใหญ่ขึ้น
      pointHoverRadius: 8
    },
    useGradient: true,       // ✅ ไล่สีพื้นหลังใต้เส้น

    // ✅ โชว์เลขบนจุด
    showValueLabels: true,
    valueLabelOptions: {
      align: 'top',
      fontSize: 14,          // ตัวเลขใหญ่ขึ้น
      fontWeight: '600',
      color: '#000'
    }
  });
}

