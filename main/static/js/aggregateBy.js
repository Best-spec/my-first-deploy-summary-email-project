// แปลง "dd/MM/yyyy" เป็น Date
function parseDMY(dmy) {
  const [d, m, y] = dmy.split('/').map(Number);
  return new Date(y, m - 1, d);
}
function dayKey(d)   { return d.toISOString().slice(0,10); } // yyyy-MM-dd
function isoWeek(d0) {
  const d = new Date(Date.UTC(d0.getFullYear(), d0.getMonth(), d0.getDate()));
  const day = d.getUTCDay() || 7; d.setUTCDate(d.getUTCDate() + 4 - day);
  const yStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  const weekNo = Math.ceil((((d - yStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2,'0')}`;
}
function monthKey(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; }

export function aggregateBy(data, period = 'day', mode = 'sum') {
  const keyFn = period === 'day' ? dayKey : period === 'week' ? isoWeek : monthKey;
  const valueKeys = Object.keys(data[0]).filter(k => k !== 'date');
  const buckets = new Map(); // key -> {sum:..., count:...}

  for (const row of data) {
    const k = keyFn(parseDMY(row.date));
    if (!buckets.has(k)) buckets.set(k, { sums: Object.fromEntries(valueKeys.map(k=>[k,0])), n: 0 });
    const b = buckets.get(k);
    for (const vk of valueKeys) b.sums[vk] += Number(row[vk] || 0);
    b.n++;
  }

  const out = [];
  for (const [k, {sums, n}] of Array.from(buckets.entries()).sort((a,b)=>a[0].localeCompare(b[0]))) {
    const obj = { date: k };
    for (const vk of valueKeys) obj[vk] = (mode === 'avg') ? (sums[vk] / n) : sums[vk];
    out.push(obj);
  }
  return out;
}
