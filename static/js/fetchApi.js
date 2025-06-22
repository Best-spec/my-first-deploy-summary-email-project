import { renderAutoChart, renderAutoPieChart } from "./charts.js";

export function getCsrfToken() {
  return document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
}

export async function fetchDataAndRender(actionId) {
  try {
    const res = await fetch('/analyze/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken(),
      },
      body: JSON.stringify({ action_id: actionId }),
    });



    const result = await res.json();
    let realData;
    let data_chart;
    let data;

    if (Array.isArray(result.data)) {
      // data เป็น array
      const dataLength = result.data.length;
      console.log("Data is array, length:", dataLength);
      // console.log("Data content:", result);

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
      } else {
        console.warn("Unknown data format:", result.data);
        }

    if (!data || data.length === 0) {
      document.getElementById('header-row').innerHTML = `
        <div class="col-span-full text-center text-gray-300">No data available</div>
      `;
      document.getElementById('data-rows').innerHTML = '';
      return;
    }

    const headers = Object.keys(data[0]);

    // 🧠 Set grid-cols dynamically
    const gridClass = `grid grid-cols-${headers.length}`;

    // 🟣 Header
    const headerHtml = headers.map(h => `
      <div class="text-center font-semibold capitalize">${h.replace(/_/g, ' ')}</div>
    `).join('');
    document.getElementById('header-row').className = `${gridClass} bg-gradient-to-r from-indigo-500 to-purple-700 text-white p-4`;
    document.getElementById('header-row').innerHTML = headerHtml;

    // 🟢 Rows
    const rowsHtml = data.map(row => {
      const cells = headers.map(key => {
        let value = row[key];

        // 🔧 Custom display
        if (typeof value === 'number' && key.includes('cost')) {
          value = `฿ ${value}`;
        } else if (typeof value === 'number' && key.includes('contact')) {
          value = `<span class="px-2 py-0.5 rounded-full text-sm bg-green-100 text-green-800">↑ ${value}%</span>`;
        } else if (key === 'total') {
          value = `<span class="px-2 py-0.5 rounded-full text-sm bg-gray-200 text-gray-800 font-bold">${value}</span>`;
        }

        return `<div class="text-center flex items-center justify-center">${value}</div>`;
      }).join('');

      return `<div class="${gridClass} p-4 hover:bg-gray-50 transition-colors">${cells}</div>`;
    }).join('');

    document.getElementById('data-rows').innerHTML = rowsHtml;

    data = '';
    realData = '';
    data_chart = '';
  }
  } catch (error) {
    console.error(error);
    document.getElementById('header-row').innerHTML = `
      <div class="col-span-6 text-center text-red-500">Error loading data</div>
    `;
  }
}


export function initAnalyzeButtons() {
  const buttons = document.querySelectorAll('.analyze-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const actionId = btn.dataset.actionId;
      fetchDataAndRender(actionId);
      console.log(`Analyzing: ${actionId}`);
    });
  });
}
