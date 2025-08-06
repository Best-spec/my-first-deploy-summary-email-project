export function change_colors(type) {
  const cat_colors = {
    'default_colors': ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#F87171', '#34D399'],
    'top-center-first': ['#1C69A8','#5C9DFF'],
    'top-center': generatePurpleShades(20), 
    'plot-all': ['#512e5f','#76448a','#9b59b6','#c39bd3','#ebdef0','#f5eef8'],
    'by-type': generatePurpleShades(8)
  }

  if (type && cat_colors[type]) {
    return cat_colors[type];
  }
  return cat_colors['default_colors'];
}

// 👇 ฟังก์ชันสร้างม่วงเข้มไปอ่อน N เฉดอัตโนมัติ
function generatePurpleShades(count = 20) {
  const shades = [];
  for (let i = 0; i < count; i++) {
    const lightness = 25 + (i * (50 / (count - 1))); // ไล่จาก 25% -> 75%
    shades.push(`hsl(270, 60%, ${lightness}%)`); // h=270 คือม่วง
  }
  return shades;
}