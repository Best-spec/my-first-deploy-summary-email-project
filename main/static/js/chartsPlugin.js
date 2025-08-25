// 🔧 helper: แปลง HEX/HSL เป็น rgba ด้วย opacity
function toRgba(color, opacity = 1) {
  if (!color) return `rgba(0,0,0,${opacity})`;
  if (color.startsWith('#')) {
    const hex = color.length === 4
      ? '#' + [...color.slice(1)].map(c => c + c).join('')
      : color;
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  if (color.startsWith('hsl')) {
    // hsl(H,S%,L%) -> ใช้ค่าเดิม แค่แปลงเป็น hsla
    return color.replace(/^hsl\(/i, 'hsla(').replace(/\)\s*$/, `, ${opacity})`);
  }
  return color; // กรณีเป็น rgba อยู่แล้ว
}

/**
 * ✅ ใหม่: รองรับออปชัน “เส้นสวย ๆ” โดยไม่ทำลาย signature เดิม
 * - ใส่ borderColor, จุดใหญ่ขึ้น, เส้นโค้ง, และ fill ใต้เส้นด้วยความโปร่งใส
 * - ใช้ options.chartType เพื่อตัดสินใจสไตล์ (line/bar)
 * - ใช้ options.datasetStyle เพื่อจูนละเอียด
 */
export function buildDatasets(
  data,
  yKeys,
  colors,
  colorMode,
  options = {}              // ← เพิ่มออปชันใหม่แบบ optional
) {
  const {
    chartType = 'bar',
    datasetStyle = {}       // { borderWidth, tension, fill, pointRadius, ... , backgroundOpacity }
  } = options;

  return yKeys.map((key, i) => {
    const color = colors[i % colors.length];
    const pointColors = data.map((_, idx) => colors[idx % colors.length]);

    // ค่าเริ่มต้นสวย ๆ สำหรับ line
    const isLine = chartType === 'line';
    const dflt = {
      borderWidth: isLine ? 3 : 1,
      tension: isLine ? 0.4 : 0.3,
      fill: isLine ? false : false,          // เปิดเองได้ผ่าน datasetStyle.fill
      pointRadius: isLine ? 4 : 0,
      pointHoverRadius: isLine ? 6 : 0,
      backgroundOpacity: 0.15
    };

    const ds = {
      label: key.replace(/_/g, ' ').toUpperCase(),
      data: data.map(d => d[key]),
      // สีตัวแผน (bar จะใช้ backgroundColor เดิม, line ใช้ borderColor เป็นหลัก)
      backgroundColor: colorMode === 'point' ? pointColors : color,
      borderColor: color,
      ...dflt,
      ...datasetStyle
    };

    // ถ้าเป็น line และเปิด fill ให้ทำพื้นหลังจาง ๆ ใต้เส้น
    if (isLine && ds.fill) {
      ds.backgroundColor =
        colorMode === 'point'
          ? pointColors.map(c => toRgba(c, ds.backgroundOpacity ?? 0.15))
          : toRgba(color, ds.backgroundOpacity ?? 0.15);
    }

    // แต่งจุดให้ดูชัด
    ds.pointBackgroundColor = colorMode === 'point' ? pointColors : color;
    ds.pointBorderColor = '#fff';
    ds.pointHoverBackgroundColor = '#fff';
    ds.pointHoverBorderColor = color;

    return ds;
  });
}



export const valueLabelPlugin = {
  id: 'valueLabel',
  afterDatasetsDraw(chart, args, pluginOptions) {
    const {
      align = 'top',
      offset = 10,
      fontSize = 16,
      fontWeight = '400',
      color = '#222',
      formatter = (v) => {
        if (v === null || v === undefined || Number.isNaN(v)) return '';
        try { return new Intl.NumberFormat().format(v); } catch { return String(v); }
      }
    } = pluginOptions || {};

    const { ctx } = chart;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${fontWeight} ${fontSize}px system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial`;
    ctx.fillStyle = color;

    chart.data.datasets.forEach((dataset, dsIndex) => {
      const meta = chart.getDatasetMeta(dsIndex);
      if (meta.hidden) return;

      meta.data.forEach((element, i) => {
        const raw = dataset.data?.[i];
        const label = formatter(raw);
        if (!label) return;

        const pos = element.tooltipPosition();
        let x = pos.x;
        let y = pos.y;

        switch (align) {
          case 'top':    y -= offset; break;
          case 'bottom': y += offset; break;
          case 'left':   x -= offset; ctx.textAlign = 'right';  break;
          case 'right':  x += offset; ctx.textAlign = 'left';   break;
        }

        ctx.fillText(label, x, y);
      });
    });

    ctx.restore();
  }
};
