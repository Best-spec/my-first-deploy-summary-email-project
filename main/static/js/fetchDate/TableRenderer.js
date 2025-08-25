class TableRenderer {
  constructor() {
    this.frameTable = document.getElementById('frame-table');
    this.headerRowElement = document.getElementById('header-row');
    this.dataRowsElement = document.getElementById('data-rows');
  }

  renderTable(data, datetimeset) {
    this.frameTable.classList.remove('hidden');
    // console.log('from rendertable:',data)
    if (!data || data.length === 0) {
      this.headerRowElement.innerHTML = `
        <div class="col-span-full text-center text-gray-300">ไม่มีข้อมูลให้แสดง</div>
      `;
      this.dataRowsElement.innerHTML = '';
      return;
    }

    let headers;
    if (Object.keys(data[0]).length >= 5 && data[0].hasOwnProperty('sub')) {
      const excludeKeys = ['sub'];
      headers = Object.keys(data[0]).filter(key => !excludeKeys.includes(key));
    } else {
      headers = Object.keys(data[0]);
    }

    const gridClass = `grid grid-cols-[repeat(${headers.length},minmax(0,1fr))]`;

    const headerHtml = headers.map(h => `
      <div class="text-center font-semibold capitalize">${h.replace(/_/g, ' ')}</div>
    `).join('');
    this.headerRowElement.className = `${gridClass} bg-gradient-to-r from-indigo-500 to-purple-700 text-white p-4`;
    this.headerRowElement.innerHTML = headerHtml;

    const primaryKey = headers[0];
    const rowsHtml = data.map(row => {
      const cells = headers.map(key => {
        let value = row[key];
        let labelClass = '';

        const isNumber = !isNaN(+String(value)) && String(value).trim() !== '';

        if (isNumber && datetimeset.length >= 2) {
          const numValue = +value;
          const isPositive = numValue >= 0;
          const arrow = isPositive ? '▲' : '▼';
          const color = isPositive ? 'text-green-600' : 'text-red-600';
          value = `<span class="${color}">${arrow} ${Math.abs(numValue)}%</span>`;
        } else {
          labelClass = 'font-semibold';
        }
        return `<div class="text-center flex items-center justify-center ${labelClass}">${value}</div>`;
      }).join('');

      const subRowsHtml = Array.isArray(row.sub) ? row.sub.map(sub => {
        const subCells = headers.map(key => {
          let value = sub[key] ?? '-';

          if (key === primaryKey && sub.date_range) {
            value = `<span class="">${sub.date_range}</span>`;
          } else if (key === primaryKey && sub.date_range2) {
            value = `<span class="">${sub.date_range2}</span>`;
          }

          return `<div class="text-center flex items-center justify-center">${value}</div>`;
        }).join('');
        const bgClass = sub.date_range2 ? 'text-gray-400' : '';

        return `<div class="${gridClass} px-4 py-2 ${bgClass}">${subCells}</div>`;
      }).join('') : '';

      return `<div>
        <div class="${gridClass} p-4 hover:bg-gray-50 transition-colors ">${cells}</div>
        ${subRowsHtml}
      </div>`;
    }).join('');

    this.dataRowsElement.innerHTML = rowsHtml;
  }
}

export default TableRenderer;