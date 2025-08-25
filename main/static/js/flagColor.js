// helper: สร้างเฉดจากสีเดียว (คุม H,S คงที่ ไล่ L)
function generateSingleHueShades({
  hue,        // 0–360
  saturation, // 0–100
  lightStart = 35, // เริ่มที่เข้ม
  lightEnd = 70,   // ไปทางสว่างขึ้นนิด
  count = 20
}) {
  const n = Math.max(1, count);
  const shades = [];
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : i / (n - 1);
    const L = lightStart + (lightEnd - lightStart) * t;
    shades.push(`hsl(${hue}, ${saturation}%, ${L}%)`);
  }
  return shades;
}

/**
 * โทนที่เลือก (เข้มแบบ professional + จำง่าย):
 * - UK: Royal Blue (h≈220°, s≈70%)
 * - TH: Siam Crimson (แดงเข้ม h≈350°, s≈70%)  ← ไม่ชนกับจีน
 * - RU: Cobalt/Azure (h≈205°, s≈65%)          ← ต่างจาก UK ชัด
 * - DE: Imperial Gold (h≈45°, s≈85%)
 * - CN: China Red (h≈2°, s≈75%)
 * - AR: Pan-Arab Green (h≈122°, s≈65%)
 */

// อังกฤษ (สีเดียว: Royal Blue)
export function generateEnglishShades(count = 20) {
  return generateSingleHueShades({
    hue: 220, saturation: 70, lightStart: 35, lightEnd: 68, count
  });
}

// ไทย (สีเดียว: Siam Crimson – แดงเข้ม)
export function generateThaiShades(count = 20) {
  return generateSingleHueShades({
    hue: 350, saturation: 70, lightStart: 33, lightEnd: 65, count
  });
}

// รัสเซีย (สีเดียว: Azure/Cobalt Blue)
export function generateRussianShades(count = 20) {
  return generateSingleHueShades({
    hue: 205, saturation: 65, lightStart: 35, lightEnd: 68, count
  });
}

// เยอรมัน (สีเดียว: Imperial Gold / Golden Yellow)
export function generateGermanShades(count = 20) {
  return generateSingleHueShades({
    hue: 45, saturation: 85, lightStart: 40, lightEnd: 70, count
  });
}

// จีน (สีเดียว: China Red สด)
export function generateChineseShades(count = 20) {
  return generateSingleHueShades({
    hue: 2,           // แดงสดออกส้มเล็กน้อย
    saturation: 85,   // เพิ่มความสด
    lightStart: 28,   // เริ่มเข้มขึ้น
    lightEnd: 60,     // สว่างขึ้นแต่ยังสด
    count
  });
}

// อาหรับ (สีเดียว: Pan-Arab Green)
export function generateArabicShades(count = 20) {
  return generateSingleHueShades({
    hue: 122, saturation: 65, lightStart: 30, lightEnd: 60, count
  });
}
