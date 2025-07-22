// ===================================
// File: App.js (Main Entry Point)
// หน้าที่: ประสานงานและเริ่มต้นแอปพลิเคชัน
// ===================================
import DataFetcher from './DataFetcher.js';
import ChartRenderer from './ChartRenderer.js';
import TableRenderer from './TableRenderer.js';
import UIHandler from './UIHandler.js';
import DatePickerManager from './DatePickerManager.js';

import { getDateRange1, getDateRange2, set_btn_id } from '../datetime.js';
import { showSuccessToast, showErrorToast } from '../script.js';

class App {
  constructor() {
    this.dataFetcher = new DataFetcher();
    this.chartRenderer = new ChartRenderer();
    this.tableRenderer = new TableRenderer();
    
    this.uiHandler = new UIHandler(); 
    // DatePickerManager จะไม่ส่ง isFromToggle มาแล้ว
    this.datePickerManager = new DatePickerManager(this.handleAnalysis.bind(this));
  }

  init() {
    this.setupAnalyzeButtons();
    this.datePickerManager.init(); 
  }

  setupAnalyzeButtons() {
    const buttons = document.querySelectorAll('.analyze-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const actionId = btn.dataset.actionId;
        console.log('ปุ่มวิเคราะห์ถูกคลิก:', actionId);
        // เมื่อกดปุ่ม Analyze จะเรียก handleAnalysis ตามปกติ
        this.handleAnalysis(actionId); 
      });
    });
  }

  // **ปรับปรุง:** ลบ isFromToggle ออกจากพารามิเตอร์แล้ว
  async handleAnalysis(actionId) { 
    this.uiHandler.updateTitle(actionId);
    set_btn_id(actionId); 

    const date1 = getDateRange1();
    const date2 = getDateRange2(); 

    const datetimeset = date2 === null ? [date1] : [date1, date2];

    if (actionId === "total-month") {
        console.log('Action ID is total-month. Opening modal...');
        const isCompareDateSelected = date2 !== null; // ตรวจสอบว่ามีวันที่เปรียบเทียบหรือไม่
        
        // **การเปลี่ยนแปลงหลัก:** เราจะเรียก setupModal เสมอเมื่อ actionId เป็น "total-month"
        // แต่การแสดง/ซ่อน web-tag2 จะถูกควบคุมโดย isCompareDateSelected
        this.uiHandler.setupModal((webcomValues) => {
            this.dataFetcher.setWebCommerce(webcomValues);
            this.performDataFetchAndRender(actionId, datetimeset);
        }, isCompareDateSelected);
        
    } else {
      this.dataFetcher.setWebCommerce(null);
      this.performDataFetchAndRender(actionId, datetimeset);
    }
  }

  async performDataFetchAndRender(actionId, datetimeset) {
    try {
      const fetchedData = await this.dataFetcher.fetchData(actionId, datetimeset);

      let dataForTable;
      let dataForCharts;

      if (actionId === 'top-center') {
        dataForTable = fetchedData;
        dataForCharts = fetchedData;
      } else if (actionId === 'total-month') {
        dataForTable = fetchedData[0];
        dataForCharts = fetchedData;
      } else if (actionId === 'plot-all') {
        dataForTable = fetchedData[0];
        dataForCharts = fetchedData;
      } else {
        if (Array.isArray(fetchedData)) {
          if (fetchedData.length === 1) {
            dataForTable = fetchedData[0];
            dataForCharts = fetchedData[0];
          } else if (fetchedData.length === 2) {
            dataForTable = fetchedData[0];
            dataForCharts = fetchedData;
          } else {
             console.warn("Unexpected data structure for default case:", fetchedData);
             showErrorToast('รูปแบบข้อมูลไม่ถูกต้องสำหรับการแสดงผล');
             this.tableRenderer.renderTable([], datetimeset);
             this.chartRenderer.hideAllCharts();
             return;
          }
        } else {
          console.warn("Fetched data is not an array:", fetchedData);
          showErrorToast('ข้อมูลที่ได้รับมีรูปแบบที่ไม่รองรับ');
          this.tableRenderer.renderTable([], datetimeset);
          this.chartRenderer.hideAllCharts();
          return;
        }
      }

      this.chartRenderer.renderCharts(actionId, dataForCharts);
      this.tableRenderer.renderTable(dataForTable, datetimeset);

      showSuccessToast('โหลดข้อมูลสำเร็จ!');

    } catch (error) {
      console.error("การวิเคราะห์ล้มเหลว:", error);
      showErrorToast('เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + error.message);
      this.tableRenderer.renderTable([], datetimeset);
      this.chartRenderer.hideAllCharts();
    }
  }
}

// let appInstance;

// document.addEventListener('DOMContentLoaded', () => {
//   appInstance = new App();
//   appInstance.init();
// });


// export function initAnalyzeButtons(actionId) {
//     if (appInstance) {
//       console.log('initAnalyzeButtons wrapper called, redirecting to App.handleAnalysis:', actionId);
//       appInstance.handleAnalysis(actionId);
//     } else {
//       console.warn('App instance not initialized yet when initAnalyzeButtons was called.');
//     }
//   }
  
export default App;