// charts/utils/helpers.js

// ใส่ alpha ให้สี (รองรับ #hex และ hsl(...))
export function toAlpha(color, a = 0.15) {
  if (!color) return `rgba(0,0,0,${a})`;
  if (typeof color === 'string' && color.startsWith('#')) {
    const hex = color.length === 4
      ? '#' + [...color.slice(1)].map(c => c + c).join('')
      : color;
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  if (typeof color === 'string' && color.startsWith('hsl')) {
    return color.replace(/^hsl\(/i, 'hsla(').replace(/\)\s*$/, `, ${a})`);
  }
  return color; // กรณีเป็น rgba อยู่แล้ว
}

// ทำ gradient ใต้เส้นตามสี base
export function createGradient(ctx, canvas, baseColor, startOpacity = 0.18, endOpacity = 0.02) {
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, toAlpha(baseColor, startOpacity));
  g.addColorStop(1, toAlpha(baseColor, endOpacity));
  return g;
}