import { initAnalyzeButtons } from './fetchApi.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadFiles();
  renderFiles();
  updateFileCount();
  initAnalyzeButtons();
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
let fileIdCounter = 1;

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
    await loadFiles();
    renderFiles();
    updateFileCount();
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

}



// Event Listeners
document.getElementById('uploadArea').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});


// Drag and Drop
document.getElementById('fileInput').addEventListener('change', async (e) => {
    const selectedFiles = Array.from(e.target.files);
    // selectedFiles.forEach(file => addFile(file));
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

function analyzeAll() {
    const showdata = document.getElementById('contentAnalysis');
    const wealcomeData = document.getElementById('wealcomeData');
    wealcomeData.classList.add('hidden');
    showdata.classList.remove('hidden');
  fetch('/analyze-all/')
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // document.getElementById('kpi-container').innerHTML = data.results;
        // มึงจะโชว์ตารางหรือกราฟก็ได้ตรงนี้
      } else {
        showErrorToast("เกิดข้อผิดพลาด ดึงข้อมูลไม่ได้", "red")
      }
    })
}

window.analyzeAll = analyzeAll;



async function deleteFile(fileId) {
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

window.deleteFile = deleteFile;


// ฟังก์ชันแสดงข้อความสำเร็จ
function showSuccessToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // แสดง toast
    setTimeout(() => {
        toast.classList.add('translate-x-0', 'opacity-100');
    }, 100);
    
    // ซ่อน toast หลัง 2 วินาที
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// ฟังก์ชันแสดงข้อความผิดพลาด
function showErrorToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // แสดง toast
    setTimeout(() => {
        toast.classList.add('translate-x-0', 'opacity-100');
    }, 100);
    
    // ซ่อน toast หลัง 3 วินาที
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
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

// window.rangeObj = "2024-01-01";

// $('input[name="daterange"]').daterangepicker({
//   autoUpdateInput: false,
//   locale: {
//     format: 'YYYY-MM-DD',
//     cancelLabel: 'Clear'
//   }
// });

// $('input[name="daterange"]').on('apply.daterangepicker', function (ev, picker) {
//   $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));

//   rangeObj = {
//     startDate: picker.startDate.format('YYYY-MM-DD'),   
//     endDate: picker.endDate.format('YYYY-MM-DD'),
//     startDay: picker.startDate.date(),
//     endDay: picker.endDate.date(),
//     startMonth: picker.startDate.month() + 1,
//     endMonth: picker.endDate.month() + 1,
//     startYear: picker.startDate.year(),
//     endYear: picker.endDate.year()
//   };

//   console.log("🔧 ช่วงวันที่เลือก:", rangeObj);
// });

    