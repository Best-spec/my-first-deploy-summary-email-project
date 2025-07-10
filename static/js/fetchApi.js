import { renderAutoChart, renderAutoPieChart } from "./charts.js";
import { getDateRange1, getDateRange2 } from './datetime.js';

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
       }),
    });

    console.log('datetime',datetimeset)
    const result = await res.json();
    let realData;
    let data_chart;
    let data;
    let data_chart2;
    // document.getElementById('showchart').classList.add('grid-cols-3');

    if (actionId === 'top-center') {
      document.getElementById('showchart').classList.remove('grid-cols-3');
      document.getElementById('showchart').classList.add('grid-cols-1');
      document.getElementById('piechart').classList.add('hidden');
      document.getElementById('barHorizontal').classList.add('hidden')
      // document.getElementById('barChart').style.height = '600px';
      // document.getElementById('myPieChart').setAttribute('height', '300');
      console.log('this is top')
      realData = result.data;
      renderAutoChart(realData);
        // renderAutoPieChart(realData);
      data = realData;
      console.log("is one var", result.data)
    } else if (actionId === 'total-month') {
        console.log('this is total')
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
        data_chart2 = result.data[2];
        // renderAutoChart(data_chart);
        renderAutoChart(data_chart, 'barChart');              // ปกติ
        renderAutoChart(data_chart2, 'barChartHorizontal'); // ประเภทเป็นแกน x
        data = realData;
        console.log(data)
    } else if (actionId === 'plot-all'){
      realData = result.data[0];
      realData[0]["Web Commerce"] = webcom;
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
        console.log("Data is array, length:", dataLength);
        if (dataLength === 1) {
        realData = result.data[0];
        renderAutoChart(realData);
        renderAutoPieChart(realData);
        data = realData;
        console.log("is one var", result.data)
        } else if (dataLength === 2) {
        realData = result.data[0];
        data_chart = result.data[1];
        data = realData;
        renderAutoPieChart(realData);
        renderAutoChart(data_chart);
        console.log("is two var",result.data)
        }
      } else {
        console.warn("Unknown data format:", result.data);
      }
    }
      

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
      console.log("5 keys");
      excludeKeys = ['sub'];
      headers = Object.keys(data[0]).filter(key => !excludeKeys.includes(key));
    } else {
      console.log("4 keys")
      headers = Object.keys(data[0])
    }

    const gridClass = `grid grid-cols-${headers.length}`;

    const headerHtml = headers.map(h => `
      <div class="text-center font-semibold capitalize">${h.replace(/_/g, ' ')}</div>
    `).join('');
    document.getElementById('header-row').className = `${gridClass} bg-gradient-to-r from-indigo-500 to-purple-700 text-white p-4`;
    document.getElementById('header-row').innerHTML = headerHtml;

    const rowsHtml = data.map(row => {
      const cells = headers.map(key => {
        let value = row[key];
        // console.log(value)
        let changeKey;
        let changeVal;

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
        }
        return `<div class="text-center flex items-center justify-center">${value}</div>`;
      }).join('');

      const subRows = Array.isArray(row.sub) ? row.sub.map(sub => { //{key: v,key: v,key: v,key: v}
        // console.log("sub",sub)
        const subCells = headers.map(key => { // [key,key,key,key]
          // console.log("key",key)
          let value = sub[key] ?? '-';  // key : value

          // 👉 ถ้า key คือ clinic แล้วมี date_range → ใช้แทน clinic
          if (key === 'clinic' && sub.date_range) {
            value = `<span class="">${sub.date_range}</span>`;
          } else if (key === 'clinic' && sub.date_range2){
            value = `<span class="text-gray-400">${sub.date_range2}</span>`;
          } else if (key === 'appointment_count' && sub.appointment_count){
            value = `<span class="text-gray-400">${sub.appointment_count}</span>`;
          }

          return `<div class="text-center flex items-center justify-center">${value}</div>`;
        }).join('');

        return `<div class="${gridClass} px-4 py-2 ">${subCells}</div>`;
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
// let rangedateset2;

export function initAnalyzeButtons() {
  const buttons = document.querySelectorAll('.analyze-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const actionId = btn.dataset.actionId;
      const date1 = getDateRange1();
      const date2 = getDateRange2();

      const datetimeset = date2 === null  
        ? [date1]
        : [date1, date2]; // [{set1},{set2}] fomat
      // const datetimeset = window.rangedateset1;
      console.log("from fetch set1",date1)
      console.log("from fetch set2",date2)

      if (actionId === "plot-all") {
        console.log('แสดง modal นี้แหละ');
        modal.classList.remove("hidden");
        modal.classList.add("flex");

        okbutton.addEventListener("click", () => {
          const str = webdata.value;
          webcom = parseInt(str);
          console.log(":", webcom ,"type:", typeof webcom);
          modal.classList.remove("flex");
          modal.classList.add("hidden");

          fetchDataAndRender(actionId, datetimeset);
        });

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
        // ถ้าไม่ใช่ plot-all ก็เรียกตรงๆ เลย
        fetchDataAndRender(actionId, datetimeset);
      }
    });
  });
}