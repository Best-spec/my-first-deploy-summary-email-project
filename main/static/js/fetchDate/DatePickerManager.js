// ===================================
// File: DatePickerManager.js
// หน้าที่: จัดการ Date Range Pickers และ Toggle สำหรับการเปรียบเทียบ
// ===================================
import { getDateRange1, getDateRange2, setDateRange1, setDateRange2, get_btn_id } from '../datetime.js';
import { period } from '../script.js';

class DatePickerManager {
  constructor(analyzeCallback) {
    this.analyzeCallback = analyzeCallback;

    this.toggle = document.getElementById("toggle"); 
    this.compareDiv = document.getElementById("rangecompare");
    this.compareInput = document.querySelector('input[name="datecompare"]');
    this.mainDateInput = document.querySelector('input[name="daterange"]');

    this.rangedateset1 = {
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
    };
    this.rangedateset2 = {
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
    };

    this.handleMainDateApply = this.handleMainDateApply.bind(this);
    this.handleCompareDateApply = this.handleCompareDateApply.bind(this);
    this.handleToggleChange = this.handleToggleChange.bind(this);
  }

  initMainDatePicker() {
    $(this.mainDateInput).daterangepicker({
      autoUpdateInput: true,
      startDate: moment(this.rangedateset1.startDate),
      endDate: moment(this.rangedateset1.endDate),
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
        // 'Start - End': [moment(), moment()] // ตัวอย่างช่วง 3 เดือน
      }
    }, this.handleMainDateApply);
  }

  handleMainDateApply(start, end, label) {
    this.rangedateset1 = {
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD'),
      startDay: start.date(),
      endDay: end.date(),
      startMonth: start.month() + 1,
      endMonth: end.month() + 1,
      startYear: start.year(),
      endYear: end.year()
    };
    setDateRange1(this.rangedateset1);
    const btn_id = get_btn_id();
    console.log('Main Date Range Applied, triggering analyze with ID:', btn_id);
    this.analyzeCallback(btn_id); // ยังคงเรียก analyzeCallback เมื่อวันที่หลักเปลี่ยน
    console.log("📆 Main Date Range Selected:", label, this.rangedateset1);
  }

  initCompareDatePicker() {
    $(this.compareInput).daterangepicker({
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

    $(this.compareInput).on('apply.daterangepicker', this.handleCompareDateApply);
  }

  handleCompareDateApply(ev, picker) {
    this.rangedateset2 = {
      startDate: picker.startDate.format('YYYY-MM-DD'),
      endDate: picker.endDate.format('YYYY-MM-DD'),
      startDay: picker.startDate.date(),
      endDay: picker.endDate.date(),
      startMonth: picker.startDate.month() + 1,
      endMonth: picker.endDate.month() + 1,
      startYear: picker.startDate.year(),
      endYear: picker.endDate.year()
    };
    setDateRange2(this.rangedateset2);
    const btn_id = get_btn_id();
    console.log('Compare Date Range Applied, triggering analyze with ID:', btn_id);
    // เมื่อมีการ Apply วันที่เปรียบเทียบ จะเรียก analyzeCallback เสมอ
    this.analyzeCallback(btn_id); 
    console.log("📆 Compare Date Range Selected:", this.rangedateset2);
  }

  initToggleListener() {
    if (this.toggle) {
      this.toggle.addEventListener("change", this.handleToggleChange);
    } else {
      console.warn("Toggle element with ID 'toggle' not found for DatePickerManager.");
    }
  }

  handleToggleChange() {
    // **การเปลี่ยนแปลงหลักอยู่ตรงนี้:**
    // ลบการเรียก this.analyzeCallback(btn_id, true); ออกไปจาก handleToggleChange()
    // เพราะหน้าที่ของ Toggle คือแค่แสดง/ซ่อนช่องวันที่ ไม่ใช่สั่งให้วิเคราะห์ใหม่
    if (this.toggle.checked) {
      this.compareDiv.classList.remove("hidden");
      if (!this.compareDiv.dataset.inited) {
        this.initCompareDatePicker();
        this.compareDiv.dataset.inited = "true";
        // เมื่อเปิด toggle ครั้งแรก ให้ตั้งค่า rangedateset2 ด้วยค่าเริ่มต้นของ picker
        const picker = $(this.compareInput).data('daterangepicker');
        if (picker) {
             this.rangedateset2 = {
                 startDate: picker.startDate.format('YYYY-MM-DD'),
                 endDate: picker.endDate.format('YYYY-MM-DD'),
                 startDay: picker.startDate.date(),
                 endDay: picker.endDate.date(),
                 startMonth: picker.startDate.month() + 1,
                 endMonth: picker.endDate.month() + 1,
                 startYear: picker.startDate.year(),
                 endYear: picker.endDate.year()
             };
             setDateRange2(this.rangedateset2);
         }
      }
    } else {
      this.compareDiv.classList.add("hidden");
      this.compareInput.value = ''; // เคลียร์ค่าในช่องวันที่เปรียบเทียบ
      setDateRange2(null); // ตั้งค่าช่วงวันที่เปรียบเทียบเป็น null
    }
    // สังเกตว่าไม่มีการเรียก analyzeCallback(get_btn_id()); ที่นี่แล้ว!
  }

  init() {
    this.initMainDatePicker();
    this.initToggleListener();
    setTimeout(() => {
        const mainPicker = $(this.mainDateInput).data('daterangepicker');
        if (mainPicker) {
            mainPicker.clickApply();
        } else {
            console.warn("Main daterangepicker not initialized yet for initial apply.");
        }
    }, 0);
  }
}

export default DatePickerManager;