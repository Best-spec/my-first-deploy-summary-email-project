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
    const realData = result.data;

    if (!realData || realData.length === 0) {
      document.getElementById('header-row').innerHTML = `
        <div class="col-span-6 text-center text-gray-300">No data available</div>
      `;
      return;
    }

    const headers = Object.keys(realData[0]);
    document.getElementById('header-row').innerHTML = headers.map(h => `
      <div class="text-center font-semibold capitalize">${h.replace(/_/g, ' ')}</div>
    `).join('');

    const rowsHtml = realData.map(category => `
      <div class="grid grid-cols-6 p-4 hover:bg-gray-50 transition-colors">
        <div class="text-center flex items-center justify-center font-semibold text-gray-700">${category.language}</div>
        <div class="text-center flex items-center justify-center text-blue-600 font-medium">฿ ${category.general_inquiry}</div>
        <div class="text-center flex items-center justify-center text-green-600 font-medium">฿ ${category.estimated_cost}</div>
        <div class="text-center flex items-center justify-center">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-green-100 text-green-800">↑ ${category.contact_doctor}%</span>
        </div>
        <div class="text-center flex items-center justify-center text-purple-600 font-medium">${category.other}</div>
        <div class="text-center flex items-center justify-center">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-gray-200 text-gray-800 font-bold">${category.total}</span>
        </div>
      </div>
    `).join('');
    
    document.getElementById('data-rows').innerHTML = rowsHtml;

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
