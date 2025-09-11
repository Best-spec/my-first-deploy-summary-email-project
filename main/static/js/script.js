
import { setDateRange1, setDateRange2, get_btn_id, getDateRange1 } from './datetime.js';
import Appfetch from './fetchDate/Appfetch.js';
import { toggle_period_lineChart } from './fetchDate/aggreateLine.js'
import DataFetcher from './fetchDate/DataFetcher.js';
import { permissions } from './config.js';
import { hiddenSidebar } from './perm_ui.js';

let appInstance;
const perm = permissions()
// Object.keys(perm).forEach(key => {console.log(key, perm[key])})
// console.log('period:', period());
document.addEventListener('DOMContentLoaded', async () => {
  await loadFiles();
  renderFiles();
  updateFileCount();
  appInstance = new Appfetch();
  appInstance.init();
  sidebar_toggle();
  analysisOpen();
  toggle_period_lineChart();
  console.log = function () {};
});

// Setup CSRF token for AJAX requests
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');
let files = [];
export let period = {};
let fileIdCounter = 1;

if (!perm.isStaff) {hiddenSidebar()}

function sidebar_toggle() {
    const col1 = document.getElementById('col1');
    const col2 = document.getElementById('col2');
    const menu_on = document.getElementById('menu-on');
    const menu_off = document.getElementById('menu-off');

    const side_open = !col1.classList.contains('hidden');

    if (side_open) {
        menu_off.classList.add('hidden');
    }

    menu_on.addEventListener('click', () => {
        col1.classList.add('hidden');
        menu_off.classList.remove('hidden');
    });

    menu_off.addEventListener('click', () => {
        col1.classList.remove('hidden');
        menu_off.classList.add('hidden');
    })
}


function updateFileCount() {
    const fileCount = document.getElementById('fileCount');
    fileCount.textContent = files.length;
    
    const emptyState = document.getElementById('emptyState');
    const fileItems = document.getElementById('fileItems');
    
    if (files.length === 0) {
        emptyState.classList.remove('hidden');
        fileItems.classList.add('hidden');
    } else {
        emptyState.classList.add('hidden');
        fileItems.classList.remove('hidden');
    }
}

function getFileIcon(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    const icons = {
        'pdf': '📄',
        'doc': '📝',
        'docx': '📝',
        'txt': '📄',
        'jpg': '🖼️',
        'jpeg': '🖼️',
        'png': '🖼️',
        'gif': '🖼️',
        'mp4': '🎥',
        'mp3': '🎵',
        'zip': '📦',
        'rar': '📦',
        'xlsx': '📊',
        'xls': '📊',
        'ppt': '📊',
        'pptx': '📊'
    };
    return icons[extension] || '📄';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function addFile(file) {
    const fileObj = {
        id: fileIdCounter++,
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
    };
    
    files.push(fileObj);
    // await loadFiles();
    // renderFiles();
    // updateFileCount();
    // console.log('เพิ่มไฟล์:', fileObj);
}

async function uploadToModels(files) {
    console.log('เลือกไฟล์แล้ว', files);
    
    if (files.length === 0) {
        console.log('ยังไม่มีไฟล์...');
        return;
    }

    const formData = new FormData();
    for (let file of files) {
        formData.append('files', file); // หลายไฟล์ใช้ชื่อเดียวกัน
        console.log('ชื่อไฟล์:', file.name);
    }

    try {
        const response = await fetch('/upload/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),  // ต้องมี!
            }
        });

        const data = await response.json();
        if (data.success) {
            await loadFiles();
            renderFiles();
            updateFileCount();
            console.log('อัปโหลดสำเร็จ:', data);
            showSuccessToast('อัปโหลดเสร็จเรียบร้อย');
        } else {
            console.error('อัปโหลดไม่สำเร็จ:', data.error);
            showErrorToast('อัปโหลดไม่สำเร็จ');
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
        showErrorToast('เกิดข้อผิดพลาดตอนอัปโหลด');
    }
}

async function loadFiles() {
    try {
        const response = await fetch('/load_files/');
        const data = await response.json();
        
        if (!data.success) {
            showErrorToast('ดึงรายชื่อไฟล์ไม่สำเร็จ');
            return;
        }
        files = data.files;
        
        
        
    } catch (err) {
        console.error('Error loading files:', err);
        showErrorToast('โหลดไฟล์ผิดพลาด');
    }
}

function renderFiles() {
    const fileItems = document.getElementById('fileItems');
    fileItems.innerHTML = '';

    files.forEach(file => {
        const fileElement = document.createElement('div');
        fileElement.className = 'file-item mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 fade-in';
        fileElement.setAttribute('data-file-id', file.id);
        
        fileElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3 flex-1 min-w-0">
                    <span class="text-2xl">${getFileIcon(file.name)}</span>
                    <div class="flex-1 min-w-0">
                        <a href="${file.url}" target="_blank" class="font-medium text-blue-700 hover:underline max-w-40 break-words leading-tight" title="${file.name}">
                            ${file.name}
                        </a>
                        <div class="text-sm text-gray-500">${formatFileSize(file.size)}</div>
                    </div>
                </div>
                <button onclick="deleteFile('${file.id}')" 
                        class="delete-btn text-red-500 hover:text-red-700 transition-all p-2 rounded-full hover:bg-red-50">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
        `;

        fileItems.appendChild(fileElement);
    });
    console.log('เรนเดอร์ไฟล์:', files);

}



// Event Listeners
document.getElementById('uploadArea').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});


// Drag and Drop
document.getElementById('fileInput').addEventListener('change', async (e) => {
    const selectedFiles = Array.from(e.target.files);
    uploadToModels(selectedFiles);
    e.target.value = ''; // เคลียร์ input
});

const uploadArea = document.getElementById('uploadArea');

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('border-blue-400', 'bg-blue-50');
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('border-blue-400', 'bg-blue-50');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('border-blue-400', 'bg-blue-50');
    
    const droppedFiles = Array.from(e.dataTransfer.files);
     uploadToModels(droppedFiles);
    droppedFiles.forEach(file => addFile(file));
});

// Initialize
updateFileCount();

// Sample data for demo (เพิ่มไฟล์ตัวอย่าง)
setTimeout(() => {
    const sampleFiles = [
        { name: 'document.pdf', size: 1024000 },
        { name: 'image.jpg', size: 2048000 },
        { name: 'spreadsheet.xlsx', size: 512000 }
    ];
    
    sampleFiles.forEach(fileData => {
        const file = new File([''], fileData.name, { type: 'application/octet-stream' });
        Object.defineProperty(file, 'size', { value: fileData.size });
        // addFile(file); // ยกเลิก comment เพื่อแสดงไฟล์ตัวอย่าง
    });
}, 1000);

function analysisOpen() {
    const showdata = document.getElementById('contentAnalysis');
    const wealcomeData = document.getElementById('wealcomeData');

    document.getElementById('startButton').addEventListener('click', () => {
        // wealcomeData.classList.add('hidden');
        showdata.classList.remove('hidden');
    });
}



async function deleteFile(fileId) {
    if (perm.canDelete) {
        
        const fileElement = document.querySelector(`[data-file-id="${fileId}"]`);
        
        if (!fileElement) {
            alert("ลบไม่สำเร็จ: ไม่เจอ element");
            return;
        }
    
        // แสดง loading state บน element ที่จะลบ
        const originalContent = fileElement.innerHTML;
        fileElement.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="text-gray-500">กำลังลบ...</span>
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
            </div>
        `;
    
        try {
            // ยิง POST ไปลบที่ backend
            const response = await fetch('/delete_file/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: `file_id=${fileId}`
            });
    
            const data = await response.json();
    
            if (data.success) {
                // แสดงข้อความสำเร็จ
                showSuccessToast('ลบไฟล์สำเร็จ');
                
                // เพิ่ม animation ก่อนลบ
                fileElement.classList.add('slide-out', 'opacity-50');
                
                // รอ animation เสร็จแล้ว reload หน้าเว็บ
                setTimeout(async () => {
                    await loadFiles();
                    renderFiles();
                    updateFileCount();
                }, 300);
                
            } else {
                // คืนค่า original content กรณีลบไม่สำเร็จ
                fileElement.innerHTML = originalContent;
                showErrorToast(data.message || 'ลบไม่สำเร็จ');
            }
            
        } catch (err) {
            console.error('ลบไฟล์ผิดพลาด:', err);
            
            // คืนค่า original content กรณีเกิดข้อผิดพลาด
            fileElement.innerHTML = originalContent;
            showErrorToast('ลบไฟล์ผิดพลาด');
        }
    }
}

window.deleteFile = deleteFile;

async function deleteAllFiles() {
    if (perm.canDelete) {
        console.log('Staff กดลบไฟล์ทั้งหมดแล้ว')

        const fileListContainer = document.querySelector('.file-item'); // ปรับ selector ให้ตรงกับ container ของไฟล์
        if (!fileListContainer) {
            alert("ไม่พบรายการไฟล์");
            return;
        }
    
        // backup content
        const originalContent = fileListContainer.innerHTML;
    
        // แสดง loading state
        fileListContainer.innerHTML = `
            <div class="flex items-center justify-center py-4">
                <span class="text-gray-500 mr-2">กำลังลบไฟล์ทั้งหมด...</span>
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
            </div>
        `;
    
        try {
            const response = await fetch('/delete_all_files/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: '' // ไม่มีพารามิเตอร์
            });
    
            const data = await response.json();
    
            if (data.success) {
                showSuccessToast('ลบไฟล์ทั้งหมดสำเร็จ');
    
                // รอให้ user เห็นข้อความก่อน reload
                setTimeout(async () => {
                    await loadFiles();
                    renderFiles();
                    updateFileCount();
                }, 300);
    
            } else {
                // คืนค่าเดิมถ้าไม่สำเร็จ
                fileListContainer.innerHTML = originalContent;
                showErrorToast(data.message || 'ลบไฟล์ทั้งหมดไม่สำเร็จ');
            }
    
        } catch (err) {
            console.error('ลบไฟล์ทั้งหมดผิดพลาด:', err);
            fileListContainer.innerHTML = originalContent;
            showErrorToast('เกิดข้อผิดพลาดขณะลบไฟล์ทั้งหมด');
        }
    }
}

window.deleteAllFiles = deleteAllFiles;


function ensureToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-4 right-4 z-50 flex flex-col items-end space-y-2';
        document.body.appendChild(container);
    }
    return container;
}
// ฟังก์ชันแสดงข้อความสำเร็จ
export function showSuccessToast(message = "ทำรายการสำเร็จ") {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className =
        'flex items-center p-4 mb-4 rounded-xl text-sm border border-emerald-400 bg-emerald-50 text-emerald-500 z-50 shadow-lg transform transition-all duration-300 opacity-0 translate-x-full';

    toast.innerHTML = `
        <svg class="w-5 h-5 mr-2 min-w-[20px]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.0043 13.3333V9.16663M9.99984 6.66663H10.0073M9.99984 18.3333C5.39746 18.3333 1.6665 14.6023 1.6665 9.99996C1.6665 5.39759 5.39746 1.66663 9.99984 1.66663C14.6022 1.66663 18.3332 5.39759 18.3332 9.99996C18.3332 14.6023 14.6022 18.3333 9.99984 18.3333Z"
                stroke="#10B981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="font-semibold mr-1">สำเร็จ:</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // แสดง toast แบบลื่นๆ
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    }, 100);

    // ซ่อน toast หลัง 3 วิ
    setTimeout(() => {
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}


// ฟังก์ชันแสดงข้อความผิดพลาด
export function showErrorToast(message = "เกิดข้อผิดพลาดบางอย่าง") {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className =
        'flex items-center p-4 mb-4 rounded-xl text-sm bg-red-500 text-white z-50 shadow-lg transform transition-all duration-300 opacity-0 translate-x-full';

    toast.innerHTML = `
        <svg class="w-5 h-5 mr-2 min-w-[20px]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.0043 13.3333V9.16663M9.99984 6.66663H10.0073M9.99984 18.3333C5.39746 18.3333 1.6665 14.6023 1.6665 9.99996C1.6665 5.39759 5.39746 1.66663 9.99984 1.66663C14.6022 1.66663 18.3332 5.39759 18.3332 9.99996C18.3332 14.6023 14.6022 18.3333 9.99984 18.3333Z"
                stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="font-semibold mr-1">เกิดข้อผิดพลาด:</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // แสดง toast ด้วย transition
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');

    }, 100);

    // ซ่อน toast หลัง 3 วิ
    setTimeout(() => {
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300); // ลบจริงหลัง transition จบ
    }, 3000);
}

export function showLoadingToast(message = "⏳ กำลังโหลดข้อมูล...") {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className =
        'flex items-center p-4 mb-4 rounded-xl text-sm border border-blue-400 bg-blue-50 text-blue-500 z-50 shadow-lg transform transition-all duration-300 opacity-0 translate-x-full';

    toast.innerHTML = `
        <svg class="w-5 h-5 mr-2 min-w-[20px] animate-spin" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
        </svg>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    }, 100);

    // return element ไว้ให้ hideToast() เรียกปิด
    return toast;
}

export function hideToast(toastElement) {
    if (!toastElement) return;
    toastElement.classList.remove('translate-x-0', 'opacity-100');
    toastElement.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => toastElement.remove(), 300);
}


// เพิ่ม CSS สำหรับ animation
const style = document.createElement('style');
style.textContent = `
    .slide-out {
        transform: translateX(-100%);
        transition: all 0.3s ease-out;
    }
    
    .toast-enter {
        transform: translateX(100%);
        opacity: 0;
    }
    
    .toast-show {
        transform: translateX(0);
        opacity: 1;
    }
`;
document.head.appendChild(style);

let rangedateset1;
let rangedateset2;

export function initComparePicker() {
    const toggle = document.getElementById("toggle");
    const compareDiv = document.getElementById("rangecompare");
    const compareInput = document.querySelector('input[name="datecompare"]');

    const openModal = document.getElementById("openModal");
    const closeModal = document.getElementById("closeModal");
    const modal = document.getElementById("myModal");
    const webdata = document.getElementById("name");
    const okbutton = document.getElementById("ok");

    rangedateset1 = {
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
    };


    rangedateset2 = {
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    };


    $('input[name="daterange"]').daterangepicker({
    autoUpdateInput: true, // <<< ให้มันอัปเดต input อัตโนมัติด้วย
    startDate: moment(rangedateset1.startDate),
    endDate: moment(rangedateset1.endDate),
    locale: {
        format: 'YYYY-MM-DD',
        cancelLabel: 'Clear'
    },
    ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [
        moment().subtract(1, 'month').startOf('month'),
        moment().subtract(1, 'month').endOf('month')
        ],
        'last 3 months': [moment().subtract(3, 'months'), moment()] // ตัวอย่างช่วง 3 เดือน
    }
    }, function(start, end, label) {
    // เวลาเลือกจาก predefined หรือเลือกเอง
    rangedateset1 = {
        startDate: start.format('YYYY-MM-DD'),
        endDate: end.format('YYYY-MM-DD'),
        startDay: start.date(),
        endDay: end.date(),
        startMonth: start.month() + 1,
        endMonth: end.month() + 1,
        startYear: start.year(),
        endYear: end.year()
    };
    setDateRange1(rangedateset1);
    const btn_id = get_btn_id();
    console.log('apply แล้ว', btn_id)
    initAnalyzeButtons(btn_id);

    console.log("📆 เลือกช่วงเวลา:", label, rangedateset1);
    });

    toggle.addEventListener("change", () => {
        if (toggle.checked) {
        compareDiv.classList.remove("hidden");

        if (!compareDiv.dataset.inited) {
            $(compareInput).daterangepicker({
            autoUpdateInput: true,
            startDate: moment(),
            endDate: moment(),
            locale: {
                format: 'YYYY-MM-DD',
                cancelLabel: 'Clear'
            },
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [
                moment().subtract(1, 'month').startOf('month'),
                moment().subtract(1, 'month').endOf('month')
                ]
            }
            });

            $(compareInput).on('apply.daterangepicker', function (ev, picker) {
                rangedateset2 = {
                    startDate: picker.startDate.format('YYYY-MM-DD'),
                    endDate: picker.endDate.format('YYYY-MM-DD'),
                    startDay: picker.startDate.date(),
                    endDay: picker.endDate.date(),
                    startMonth: picker.startDate.month() + 1,
                    endMonth: picker.endDate.month() + 1,
                    startYear: picker.startDate.year(),
                    endYear: picker.endDate.year()
                };
                setDateRange2(rangedateset2);
                const btn_id = get_btn_id();
                console.log('apply แล้ว', btn_id)
                initAnalyzeButtons(btn_id);
                console.log("📆 กำหนด compare ใหม่:", rangedateset2);
            });

            const picker = $(compareInput).data('daterangepicker');
            rangedateset2 = {
                startDate: picker.startDate.format('YYYY-MM-DD'),
                endDate: picker.endDate.format('YYYY-MM-DD'),
                startDay: picker.startDate.date(),
                endDay: picker.endDate.date(),
                startMonth: picker.startDate.month() + 1,
                endMonth: picker.endDate.month() + 1,
                startYear: picker.startDate.year(),
                endYear: picker.endDate.year()
            };
            setDateRange2(rangedateset2);



            compareDiv.dataset.inited = "true";
        }
        } else {
        compareDiv.classList.add("hidden");
        compareInput.value = '';
        setDateRange2(null);
        }
    });
}

window.forceReload = () => {
  window.location.href = window.location.pathname + '?_=' + Date.now();
};
