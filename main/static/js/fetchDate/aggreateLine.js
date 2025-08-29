// import { line }from './mock.js';
import { getCsrfToken } from './utility.js';
import { renderAutoChart } from '../charts.js';
import { getDateRange1, getDateRange2, set_btn_id } from '../datetime.js';
import { showSuccessToast, showErrorToast, showLoadingToast, hideToast } from '../script.js';


export async function renderLineChart() {
  const dataLine = await fetchLineData();
  createLine(dataLine.primary);
}

export async function fetchLineData() {
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

  const date1 = getDateRange1();
  const date2 = getDateRange2();
  
  const datetimeset = date2 === null ? [date1] : [date1, date2];
  const isCompareDateSelected = date2 !== null; // ตรวจสอบว่ามีวันที่เปรียบเทียบหรือไม่

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

    hideToast(loadingToast);
    showSuccessToast('โหลดข้อมูลกราฟเส้นสำเร็จ!'); // ✅ แจ้งว่าทำงานเสร็จ
    return json;
  } catch (err) {
    // แนะนำเพิ่ม catch toast ด้วย
    showErrorToast(`โหลดข้อมูลล้มเหลว: ${err.message}`);
  } finally {
    controller = null;
  }
}

// ทำงานตอนกดเปลี่ยนช่วงเวลา
export function toggle_period_lineChart() {
  const mode = document.getElementById('mode');
  let debounceTimer = null;

  // เด้งโหลดเมื่อเปลี่ยน period
  mode?.addEventListener('change', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(renderLineChart, 200);
  });
}


function createLine(data) {
  renderAutoChart(data, {
    canvasId: 'line-chart-canvas',
    typeColors: 'by-type',
    chartType: 'line',
    colorMode: 'dataset',
    yScale: 'logarithmic', // (คอมเมนต์เดิมเขียนว่าเส้นตรง แต่ที่ตั้งจริงคือ log)

    // ✅ บอกคู่ที่ต้องการเทียบ (เพิ่ม/ลดได้)
    twinMap: {
      "Appointment": "Appointment_compare",
      "General Inquiry": "General Inquiry compare", 
      "Estimated Cost": "Estimated Cost_compare", 
      "Other": "Other_compare", 
      "Contact Doctor": "Contact Doctor_compare",
      "Package Inquiry": "Package Inquiry_compare",
      "Feedback & Suggestion": "Feedback & Suggestion_compare",
      "Appointment": "Appointment_compare", 
      "Appointment Recommended": "Appointment Recommended_compare" 
        // ตัวอย่างเพิ่ม:
      // "General Inquiry": ["General Inquiry target", "General Inquiry prev"]
    },

    twinOptions: {
      sameColor: true,              // twin ใช้สีเดียวกับเส้นหลัก เพื่ออ่านง่าย
      labelSuffix: ' (recommended)',// ถ้าไม่กำหนดรายชื่อ จะใช้ suffix นี้
      style: {
        borderDash: [6, 4],         // เส้นประให้ twin
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: false,                // twin ส่วนใหญ่ไม่ต้อง fill
        backgroundOpacity: 0.12
      },
      // ตั้งชื่อเฉพาะราย key (ถ้ามีหลาย twin)
      labelSuffixByName: {
        "Appointment Recommended": " (recommended)"
      }
    },

    // ✅ แต่งเส้นให้สวย (คงของเดิม)
    datasetStyle: {
      borderWidth: 3,
      tension: 0.45,
      fill: true,
      backgroundOpacity: 0.18,
      pointRadius: 5,
      pointHoverRadius: 8
    },
    useGradient: true,

    // ✅ โชว์เลขบนจุด (ถ้าข้อมูลแน่น อาจตั้งเป็น false กันรก)
    showValueLabels: true,
    valueLabelOptions: {
      align: 'top',
      fontSize: 14,
      fontWeight: '600',
      color: '#000'
    }
  });
}

