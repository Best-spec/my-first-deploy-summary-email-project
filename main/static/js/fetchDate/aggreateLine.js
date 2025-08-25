// import { line }from './mock.js';
import { getCsrfToken } from './utility.js';
import { renderAutoChart } from '../charts.js';
import { getDateRange1, getDateRange2, set_btn_id } from '../datetime.js';
import { showSuccessToast, showErrorToast, showLoadingToast, hideToast } from '../script.js';
import { data_compare } from './mock.js';


//ทํางานตอนกดเปลื่ยนช่วงเวลา
// export function dataLineChart() {
//   const btn = document.getElementById('btnFetch');
//   const mode = document.getElementById('mode');
//   const status = document.getElementById('status');
//   let controller = null;
//   let debounceTimer = null;
  
//   const date1 = getDateRange1();
//   const date2 = getDateRange2();
  
//   const datetimeset = date2 === null ? [date1] : [date1, date2];
//   const isCompareDateSelected = date2 !== null; // ตรวจสอบว่ามีวันที่เปรียบเทียบหรือไม่

//   async function doFetch() {
//     if (controller) controller.abort();
//     controller = new AbortController();

//     let loadingToast = showLoadingToast("⏳ กำลังโหลดข้อมูลกราฟเส้น...");
//     const payload = {
//       period: mode.value,
//       mode: 'sum',
//       range: getDateRange1(),
//     };

//     try {
//       const res = await fetch('aggregate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-CSRFToken': getCsrfToken(),
//         },
//         credentials: 'include',
//         signal: controller.signal,
//         body: JSON.stringify(payload)
//       });

//       if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
//       const json = await res.json();

//       if (isCompareDateSelected) {
//         console.log('compare', [date1, date2])
//         renderLine(data_compare);
//       } else {
//         console.log('not compare', date1)
//         renderLine(json.primary);
//       }
//       console.log("จำนวน data:", json.primary.length);
//       hideToast(loadingToast);
//       showSuccessToast('โหลดข้อมูลกราฟเส้นสำเร็จ!');
//     } catch (err) {
//       hideToast(loadingToast);
//       // showErrorToast(`โหลดข้อมูลล้มเหลว: ${err.message}`);
//     } finally {
//       controller = null;
//     }
//   }

//   mode.addEventListener('change', () => {
//     clearTimeout(debounceTimer);
//     debounceTimer = setTimeout(() => doFetch(), 200);
//   });

//   doFetch(); // 👉 เรียกทันทีตอนโหลด
// }


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
    console.log(json);

      if (isCompareDateSelected) {
        console.log('compare', [date1, date2])
        renderLine(data_compare);
      } else {
        console.log('not compare', date1)
        renderLine(json.primary);
      }
    renderLine(json.primary);
    // renderLine(data_compare);
    console.log("จำนวน data:", json.primary.length);
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

// ทำงานตอนกดเปลี่ยนช่วงเวลา
export function dataLineChart() {
  const btn = document.getElementById('btnFetch');
  const mode = document.getElementById('mode');
  let controller = null;
  let debounceTimer = null;

  async function doFetch() {
    // ยกเลิกรีเควสต์ก่อนหน้า (ถ้ามี)
    if (controller) controller.abort();
    controller = new AbortController();

    // ✅ ดึงช่วงวันที่ใหม่ทุกครั้ง (ไม่เก็บตั้งแต่ตอนประกาศฟังก์ชัน)
    const date1 = getDateRange1();                       // {startDate, endDate}
    const date2 = getDateRange2();                       // null หรือ {startDate, endDate}
    const hasCompare = !!(date2 && date2.startDate && date2.endDate);

    const loadingToast = showLoadingToast("⏳ กำลังโหลดข้อมูลกราฟเส้น...");

    // ✅ แนบ compareRange เฉพาะตอนมีจริง
    const payload = {
      period: (mode?.value) || 'day',
      mode: 'sum',
      range: date1,
      ...(hasCompare ? { compareRange: date2 } : {})
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
      // 👇 สมมุติ backend คืน { primary: [...], compare: [...] } เวลาแนบ compareRange ไป
      if (hasCompare && Array.isArray(json.compare)) {
        console.log('compare', date1, date2);
        renderLine(json.compare);
      } else {
        console.log('not compare', date1);
        renderLine(json.primary);
      }

      console.log("จำนวน primary:", Array.isArray(json.primary) ? json.primary.length : 0);
      hideToast(loadingToast);
      showSuccessToast('โหลดข้อมูลกราฟเส้นสำเร็จ!');
    } catch (err) {
      hideToast(loadingToast);
      showErrorToast(`โหลดข้อมูลล้มเหลว: ${err.message}`);
    } finally {
      controller = null;
    }
  }

  // เด้งโหลดเมื่อเปลี่ยน period
  mode?.addEventListener('change', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(doFetch, 200);
  });

  // เด้งโหลดเมื่อกดปุ่ม
  btn?.addEventListener('click', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(doFetch, 200);
  });

  // 👉 โหลดรอบแรกตอนเข้าเพจ
  doFetch();
}


function renderLine(data) {
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


// function renderLine(data) {
//   renderAutoChart(data, {
//     canvasId: 'line-chart-canvas',
//     typeColors: 'by-type',
//     chartType: 'line',       // 📌 กราฟเส้น
//     colorMode: 'dataset',    // สีตาม dataset
//     yScale: 'logarithmic',        // แกน Y เส้นตรง

//     // ✅ แต่งเส้นให้สวย
//     datasetStyle: {
//       borderWidth: 3,        // เส้นหนา
//       tension: 0.45,         // โค้งนุ่ม
//       fill: true,            // เติมสีใต้เส้น
//       backgroundOpacity: 0.18,
//       pointRadius: 5,        // จุดใหญ่ขึ้น
//       pointHoverRadius: 8
//     },
//     useGradient: true,       // ✅ ไล่สีพื้นหลังใต้เส้น

//     // ✅ โชว์เลขบนจุด
//     showValueLabels: true,
//     valueLabelOptions: {
//       align: 'top',
//       fontSize: 14,          // ตัวเลขใหญ่ขึ้น
//       fontWeight: '600',
//       color: '#000'
//     }
//   });
// }

