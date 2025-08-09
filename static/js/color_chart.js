

export function change_colors(type) {
  const cat_colors = {
    'default_colors': ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#F87171', '#34D399'],
    'top-center-first': ['#1C69A8','#5C9DFF'],
    'top-center': generatePurpleShades(20), 
    'plot-all': ['#512e5f','#76448a','#9b59b6','#c39bd3','#ebdef0','#f5eef8'],
    'by-type': generatePurpleShades(8),
    'group-country': ['#a3c9f1', '#f9c6c9', '#c3d2f2', '#ffd6a5', '#ffb3ba', '#c7f9cc']
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
