
const sidebarOpen_btn = document.getElementById('menu-off');
const sidebar = document.getElementById('col1');

export function hiddenSidebar() {
    sidebarOpen_btn.classList.add('hidden')
    sidebar.classList.add('hidden')
}