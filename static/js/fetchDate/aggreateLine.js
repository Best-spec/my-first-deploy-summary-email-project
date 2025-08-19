// import { line }from './mock.js';
import { getCsrfToken } from './utility.js';
import { renderAutoChart } from '../charts.js';
import { getDateRange1, getDateRange2, set_btn_id } from '../datetime.js';
import { showSuccessToast, showErrorToast, showLoadingToast, hideToast } from '../script.js';

export function dataLineChart() {
  const btn = document.getElementById('btnFetch');
  const mode = document.getElementById('mode');
  const status = document.getElementById('status');
  let controller = null;
  let debounceTimer = null;

  async function doFetch() {
    if (controller) controller.abort();
    controller = new AbortController();

    let loadingToast = showLoadingToast("⏳ กำลังโหลดข้อมูลกราฟเส้น...");
    const payload = {
      period: mode.value,
      mode: 'sum',
      range: getDateRange1(),
    };

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

      renderLine(json.primary);
      hideToast(loadingToast);
      showSuccessToast('โหลดข้อมูลกราฟเส้นสำเร็จ!');
    } catch (err) {
      hideToast(loadingToast);
      // showErrorToast(`โหลดข้อมูลล้มเหลว: ${err.message}`);
    } finally {
      controller = null;
    }
  }

  mode.addEventListener('change', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => doFetch(), 200);
  });

  doFetch(); // 👉 เรียกทันทีตอนโหลด
}


export async function doFetch() {
  let controller = null
  if (controller) controller.abort(); // cancel previous
  controller = new AbortController();

  let loadingToast = showLoadingToast("⏳ กำลังโหลดข้อมูลกราฟเส้น..."); // ✅ แสดง toast ตอนเริ่มโหลด

  const payload = {
    period: 'day',
    mode: 'sum',
    range: getDateRange1(),
    // compareRange: getDateRange2()
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

    renderLine(json.primary);
    console.log('อัพเดทกราฟแล้ว');

    hideToast(loadingToast);
    showSuccessToast('โหลดข้อมูลกราฟเส้นสำเร็จ!'); // ✅ แจ้งว่าทำงานเสร็จ
  } catch (err) {
    // แนะนำเพิ่ม catch toast ด้วย
    showErrorToast(`โหลดข้อมูลล้มเหลว: ${err.message}`);
  } finally {
    controller = null;
  }
}

function renderLine(data) {
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

