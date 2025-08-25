import { renderAutoChart, renderAutoPieChart } from "./charts.js";
import { getDateRange1, getDateRange2, set_btn_id } from './datetime.js';
import { renderDataTable } from './table/fetchrender.js';


export function getCsrfToken() {
  return document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
}

let webcom;
export async function fetchDataAndRender(actionId, datetimeset) {
  try {
    const res = await fetch('/analyze/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken(),
      },
      body: JSON.stringify({ 
        action_id: actionId,
        date: datetimeset,
        Web_Commerce: webcom,
       }),
    });

    console.log('datetime',datetimeset)
    console.log('webcom: ',webcom)
    const result = await res.json();
    let realData;
    let data_chart;
    let data;
    let data_chart2;

    if (actionId === 'top-center') {
      document.getElementById('showchart').classList.remove('grid-cols-3');
      document.getElementById('showchart').classList.add('grid-cols-1');
      document.getElementById('piechart').classList.add('hidden');
      document.getElementById('barHorizontal').classList.add('hidden');
      // console.log('this is top')
      realData = result.data;
      renderAutoChart(realData);
        // renderAutoPieChart(realData);
      data = realData;
      
      console.log("is one var", result.data)

    } else if (actionId === 'total-month') {
        // console.log('this is total')
        const csslist = document.getElementById('showchart').classList;

        // ใช้ Array.from() เพื่อ clone ออกมาก่อนลูป
        Array.from(csslist).forEach(cls => {
          if (cls.startsWith('grid-cols-')) {
            csslist.remove(cls);
          }
        });
        csslist.add(`grid-cols-2`);
        document.getElementById('piechart').classList.add('hidden')
        document.getElementById('barHorizontal').classList.remove('hidden')
        realData = result.data[0];
        data_chart = result.data[1];
        // data_chart2 = result.data[2];
        renderAutoChart(data_chart);
        // renderAutoChart(data_chart, 'barChart');              // ปกติ
        // renderAutoChart(data_chart2, 'barChartHorizontal'); // ประเภทเป็นแกน x
        data = realData;
        console.log(data)
        

    } else if (actionId === 'plot-all'){
      realData = result.data[0];
      // realData[0]["Web Commerce"] = webcom;
      data = realData;
      renderAutoChart(data);
      renderAutoPieChart(data);
      document.getElementById('barHorizontal').classList.add('hidden')
      const csslist = document.getElementById('showchart').classList;

      // ใช้ Array.from() เพื่อ clone ออกมาก่อนลูป
      Array.from(csslist).forEach(cls => {
        if (cls.startsWith('grid-cols-')) {
          csslist.remove(cls);
        }
      });
      csslist.add(`grid-cols-2`);
      document.getElementById('piechart').classList.remove('hidden');

    } else {
      document.getElementById('barHorizontal').classList.add('hidden')
      const csslist = document.getElementById('showchart').classList;

      // ใช้ Array.from() เพื่อ clone ออกมาก่อนลูป
      Array.from(csslist).forEach(cls => {
        if (cls.startsWith('grid-cols-')) {
          csslist.remove(cls);
        }
      });
      csslist.add(`grid-cols-2`);
      document.getElementById('piechart').classList.remove('hidden');
      if (Array.isArray(result.data)) {
        // data เป็น array
        const dataLength = result.data.length;
        // console.log("Data is array, length:", dataLength);
        if (dataLength === 1) {
        realData = result.data[0];
        renderAutoChart(realData);
        renderAutoPieChart(realData);
        data = realData;
        // console.log("is one var", result.data)
        } else if (dataLength === 2) {
        realData = result.data[0];
        data_chart = result.data[1];
        data = realData;
        renderAutoPieChart(realData);
        renderAutoChart(data_chart);
        // console.log("is two var",result.data)
        }
      } else {
        // realData = result.data[0];
        // data = realData;
        console.warn("Unknown data format:", result.data);
      }
    }

    if (actionId === '')
      

    if (!data || data.length === 0) {
      document.getElementById('header-row').innerHTML = `
        <div class="col-span-full text-center text-gray-300">No data available</div>
      `;
      document.getElementById('data-rows').innerHTML = '';
      return;
    }

    let excludeKeys;
    let headers;

    if (Object.keys(data[0]).length >= 5) {
      // console.log("5 keys");
      excludeKeys = ['sub'];
      headers = Object.keys(data[0]).filter(key => !excludeKeys.includes(key));
    } else {
      console.log("4 keys")
      headers = Object.keys(data[0])  
    }

    // const gridClass = `grid grid-cols-${headers.length}`;
    const gridClass = `grid grid-cols-[repeat(${headers.length},minmax(0,1fr))]`;

    const headerHtml = headers.map(h => `
      <div class="text-center font-semibold capitalize">${h.replace(/_/g, ' ')}</div>
    `).join('');
    document.getElementById('header-row').className = `${gridClass} bg-gradient-to-r from-indigo-500 to-purple-700 text-white p-4`;
    document.getElementById('header-row').innerHTML = headerHtml;

    const primaryKey = headers[0]; // เอาคีย์ตัวแรกมาใช้แทน clinic แบบ dynamic
    const rowsHtml = data.map(row => {
      const cells = headers.map(key => {
        let value = row[key];
        // console.log(value)
        let changeKey;
        let changeVal;
        let label;

        changeVal = `${value}`;  
        // changeVal = key[changeKey];
        // console.log("changeKey",changeKey)
        // console.log("changeVal",typeof(changeVal)) 
        const isNumber = !isNaN(+changeVal) && changeVal.trim() !== '';

        if (isNumber && datetimeset.length >= 2) {
          // console.log('in if not str', changeVal)
          const isPositive = +changeVal >= 0;
          const arrow = isPositive ? '▲' : '▼';
          const color = isPositive ? 'text-green-600' : 'text-red-600';
          value = `<span class="${color}">${arrow} ${Math.abs(changeVal)}%</span>`;
        } else {
          value = changeVal;
          label = 'font-semibold';
        }
        return `<div class="text-center flex items-center justify-center ${label}">${value}</div>`;
      }).join('');

      const subRows = Array.isArray(row.sub) ? row.sub.map(sub => { //{key: v,key: v,key: v,key: v}
        // console.log("sub",sub)
        const subCells = headers.map(key => { // [key,key,key,key]
          // console.log("key",key)
          let value = sub[key] ?? '-';  // key : value

          // 👉 ถ้า key คือ clinic แล้วมี date_range → ใช้แทน clinic
          if (key === primaryKey && sub.date_range) {
            value = `<span class="">${sub.date_range}</span>`;
          } else if (key === primaryKey && sub.date_range2){
            value = `<span class="">${sub.date_range2}</span>`;
          }

          return `<div class="text-center flex items-center justify-center">${value}</div>`;
        }).join('');
          // 🔥 ใส่ class สีพื้นหลังถ้าเป็น date_range2
        const bgClass = sub.date_range2 ? 'text-gray-400' : '';

        return `<div class="${gridClass} px-4 py-2 ${bgClass}">${subCells}</div>`;
      }).join('') : '';

      return `<div>
        <div class="${gridClass} p-4 hover:bg-gray-50 transition-colors ">${cells}</div>
        ${subRows}
      </div>`;
    }).join('');

    document.getElementById('data-rows').innerHTML = rowsHtml;

    data = '';
    realData = '';
    data_chart = '';

  } catch (error) {
      console.error(error);
      document.getElementById('header-row').innerHTML = `
        <div class="col-span-6 text-center text-red-500">Error loading data</div>
      `;
    }
}

const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const modal = document.getElementById("myModal");
const webdata = document.getElementById("name");
const okbutton = document.getElementById("ok");

export function initAnalyzeButtons(id = '') {
  const buttons = document.querySelectorAll('.analyze-btn');
  console.log('btn_id', id, typeof(id))

  if (id === '1') {
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const actionId = btn.dataset.actionId;
        console.log('จาก event btn', actionId)
        condition(actionId);
      });
    });
  } else {
    console.log('จาก apply')
    condition(id);
  }
}

function condition(actionId) {
    document.getElementById('title').innerHTML = 'Type '+ actionId; 
    const date1 = getDateRange1();
    const date2 = getDateRange2();
    set_btn_id(actionId);
  
    const datetimeset = date2 === null  
      ? [date1]
      : [date1, date2]; // [{set1},{set2}] fomat
  
    if (actionId === "total-month") {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
  
      okbutton.addEventListener("click", () => {
        const str = webdata.value;
        webcom = str;
        console.log(":", webcom ,"type:", typeof webcom);
        modal.classList.remove("flex");
        modal.classList.add("hidden");
  
        fetchDataAndRender(actionId, datetimeset);
      }, { once: true }); 
  
      closeModal.addEventListener("click", () => {
        modal.classList.remove("flex");
        modal.classList.add("hidden");
      });
  
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("flex");
          modal.classList.add("hidden");
        }
      });
  
    } else {
      fetchDataAndRender(actionId, datetimeset);
    }
  }

