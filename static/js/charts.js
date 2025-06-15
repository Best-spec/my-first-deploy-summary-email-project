document.addEventListener('DOMContentLoaded', function() {
    // ข้อมูลสำหรับกราฟผลประกอบการรายไตรมาส
    const quarterlyData = {
        labels: ['มค-มีค 24', 'เมย-มิย 24', 'กค-กย 24', 'ตค-ธค 24'],
        datasets: [{
            label: 'ยอดขาย',
            data: [15.2, 18.7, 22.3, 25.8],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.3,
            fill: true
        }, {
            label: 'กำไรสุทธิ',
            data: [3.8, 4.5, 5.2, 6.1],
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.3,
            fill: true
        }]
    };

    // ข้อมูลสำหรับกราฟวงกลม
    const categoryData = {
        labels: [
            'เครื่องใช้ไฟฟ้า',
            'เครื่องประดับ',
            'เฟอร์นิเจอร์',
            'เสื้อผ้า',
            'อาหารและเครื่องดื่ม'
        ],
        datasets: [{
            data: [35, 25, 20, 15, 5],
            backgroundColor: [
                'rgb(59, 130, 246)',   // น้ำเงิน
                'rgb(34, 197, 94)',    // เขียว
                'rgb(245, 158, 11)',   // ส้ม
                'rgb(239, 68, 68)',    // แดง
                'rgb(107, 114, 128)'   // เทา
            ]
        }]
    };

    // สร้างกราฟเส้นแสดงผลประกอบการรายไตรมาส
    const quarterlyCtx = document.getElementById('quarterlyChart');
    if (quarterlyCtx) {
        new Chart(quarterlyCtx, {
            type: 'line',
            data: quarterlyData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let value = context.parsed.y;
                                return context.dataset.label + ': ' + 
                                    value.toLocaleString('th-TH', {
                                        minimumFractionDigits: 1,
                                        maximumFractionDigits: 1
                                    }) + ' ล้านบาท';
                            }
                        }
                    }
                },
                hover: {
                    mode: 'nearest',
                    intersect: false
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('th-TH') + ' ล้าน';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                }
            }
        });
    }

    // สร้างกราฟวงกลมแสดงสัดส่วนประเภทสินค้า
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: categoryData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                size: 12
                            },
                            padding: 15
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.raw + '%';
                            }
                        }
                    }
                }
            }
        });
    }
});
