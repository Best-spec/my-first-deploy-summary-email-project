function headerTable(headers) {
    return headers.map(h => `
      <div class="text-center font-semibold capitalize">${h.replace(/_/g, ' ')}</div>
    `).join('');
}

function rowTable(headers, data , gridClass) {
    const datetimeset =[1]
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

    return document.getElementById('t3-row').innerHTML = rowsHtml;
}

export function renderDataTable(data) {

    console.log('this table-3')
    if (!data || data.length === 0) {
      document.getElementById('t3-header').innerHTML = `
        <div class="col-span-full text-center text-gray-300">No data available</div>
      `;
      document.getElementById('t3-row').innerHTML = '';
      return;
    }

    let excludeKeys;
    let headers;

    if (Object.keys(data[0]).length >= 5) {
      console.log("5 keys");
      console.log(data[0]); 
      excludeKeys = ['sub'];
      headers = Object.keys(data[0]).filter(key => !excludeKeys.includes(key));
    } else {
      console.log("4 keys")
      headers = Object.keys(data[0])  
    }

    // const gridClass = `grid grid-cols-${headers.length}`;
    const gridClass = `grid grid-cols-[repeat(${headers.length},minmax(0,1fr))]`;
    const headerHtml = headerTable(headers);
    document.getElementById('t3-header').className = `${gridClass} bg-gradient-to-r from-indigo-500 to-purple-700 text-white p-4`;
    document.getElementById('t3-header').innerHTML = headerHtml;
    // rowTable(headers, data ,gridClass);
}
