

export function change_colors(type) {
  const cat_colors = {
    'default_colors': ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#F87171', '#34D399'],
    'top-center-first': ['#76448a','#c39bd3'],
    'top-center': generatePurpleShades(20), 
    'plot-all': ['#512e5f','#76448a','#9b59b6','#c39bd3','#ebdef0','#f5eef8'],
    'by-type': generatePurpleShades(8),
    'group-country': [
      '#234f8e', // อังกฤษ - Royal Blue เข้ม (h220 s70 l35)
      '#a62233', // ไทย - Siam Crimson เข้ม (h350 s70 l33)
      '#1e4f6d', // รัสเซีย - Azure Blue เข้ม (h205 s65 l35)
      '#a67c00', // เยอรมัน - Imperial Gold เข้ม (h45 s85 l40)
      '#8b0f1a', // จีน - China Red สดเข้ม (h2 s85 l28)
      '#145c38'  // อาหรับ - Pan-Arab Green เข้ม (h122 s65 l30)
    ]

  }

  if (type && cat_colors[type]) {
    return cat_colors[type];
  }
  return cat_colors['default_colors'];
}

// 👇 ฟังก์ชันสร้างม่วงอ่อนไล่เฉด
function generatePurpleShades(count = 20) {
  const shades = [];
  for (let i = 0; i < count; i++) {
    const lightness = 50 + (i * (35 / (count - 1))); // ไล่จาก 50% -> 85%
    shades.push(`hsl(270, 40%, ${lightness}%)`); // h=270 คือม่วง, s=40% อ่อนลง
  }
  return shades;
}
