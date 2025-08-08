// อังกฤษ (แดง-ขาว-น้ำเงิน)
export function generateEnglishShades(count = 20) {
  const shades = [];
  for (let i = 0; i < count; i++) {
    if (i < count / 3) {
      const lightness = 50 + (i * (30 / (count / 3 - 1)));
      shades.push(`hsl(0, 60%, ${lightness}%)`);
    } else if (i < (count * 2) / 3) {
      const lightness = 90 + ((i - count / 3) * (8 / (count / 3 - 1)));
      shades.push(`hsl(0, 0%, ${lightness}%)`);
    } else {
      const lightness = 45 + ((i - (count * 2) / 3) * (25 / (count / 3 - 1)));
      shades.push(`hsl(220, 60%, ${lightness}%)`);
    }
  }
  return shades;
}

// ไทย (แดง-ขาว-น้ำเงินเข้ม)
export function generateThaiShades(count = 20) {
  const shades = [];
  for (let i = 0; i < count; i++) {
    if (i < count / 3) {
      const lightness = 50 + (i * (25 / (count / 3 - 1)));
      shades.push(`hsl(0, 60%, ${lightness}%)`);
    } else if (i < (count * 2) / 3) {
      const lightness = 92 + ((i - count / 3) * (5 / (count / 3 - 1)));
      shades.push(`hsl(0, 0%, ${lightness}%)`);
    } else {
      const lightness = 30 + ((i - (count * 2) / 3) * (25 / (count / 3 - 1)));
      shades.push(`hsl(240, 60%, ${lightness}%)`);
    }
  }
  return shades;
}

// รัสเซีย (ขาว-น้ำเงิน-แดง)
export function generateRussianShades(count = 20) {
  const shades = [];
  for (let i = 0; i < count; i++) {
    if (i < count / 3) {
      const lightness = 90 + (i * (5 / (count / 3 - 1)));
      shades.push(`hsl(0, 0%, ${lightness}%)`);
    } else if (i < (count * 2) / 3) {
      const lightness = 50 + ((i - count / 3) * (20 / (count / 3 - 1)));
      shades.push(`hsl(220, 60%, ${lightness}%)`);
    } else {
      const lightness = 50 + ((i - (count * 2) / 3) * (25 / (count / 3 - 1)));
      shades.push(`hsl(0, 60%, ${lightness}%)`);
    }
  }
  return shades;
}

// เยอรมัน (ดำ-แดง-เหลือง)
export function generateGermanShades(count = 20) {
  const shades = [];
  for (let i = 0; i < count; i++) {
    if (i < count / 3) {
      const lightness = 20 + (i * (15 / (count / 3 - 1)));
      shades.push(`hsl(0, 0%, ${lightness}%)`);
    } else if (i < (count * 2) / 3) {
      const lightness = 50 + ((i - count / 3) * (20 / (count / 3 - 1)));
      shades.push(`hsl(0, 60%, ${lightness}%)`);
    } else {
      const lightness = 60 + ((i - (count * 2) / 3) * (20 / (count / 3 - 1)));
      shades.push(`hsl(45, 80%, ${lightness}%)`);
    }
  }
  return shades;
}

// จีน (แดง-เหลือง)
export function generateChineseShades(count = 20) {
  const shades = [];
  for (let i = 0; i < count; i++) {
    if (i < count / 2) {
      const lightness = 50 + (i * (25 / (count / 2 - 1)));
      shades.push(`hsl(0, 65%, ${lightness}%)`);
    } else {
      const lightness = 65 + ((i - count / 2) * (20 / (count / 2 - 1)));
      shades.push(`hsl(45, 80%, ${lightness}%)`);
    }
  }
  return shades;
}

// อาหรับ (แดง-ขาว-ดำ-เขียว)
export function generateArabicShades(count = 20) {
  const shades = [];
  for (let i = 0; i < count; i++) {
    if (i < count / 4) {
      const lightness = 50 + (i * (20 / (count / 4 - 1)));
      shades.push(`hsl(0, 60%, ${lightness}%)`);
    } else if (i < count / 2) {
      const lightness = 90 + ((i - count / 4) * (5 / (count / 4 - 1)));
      shades.push(`hsl(0, 0%, ${lightness}%)`);
    } else if (i < (count * 3) / 4) {
      const lightness = 20 + ((i - count / 2) * (15 / (count / 4 - 1)));
      shades.push(`hsl(0, 0%, ${lightness}%)`);
    } else {
      const lightness = 50 + ((i - (count * 3) / 4) * (20 / (count / 4 - 1)));
      shades.push(`hsl(120, 60%, ${lightness}%)`);
    }
  }
  return shades;
}
