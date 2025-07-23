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

    //ไว้เปิดหน้าต่าง modal เฉยๆ แล้วเรียก performDataFetchAndRender เพื่อดึงข้อมูล และ plot charts
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
      // console.log(fetchedData.dataForTable)
      console.log('from app:',fetchedData)

      let dataForTable;
      let dataForCharts;
      //เงื่อนไขไว้ render ตามหัวข้อ
      if (actionId === 'top-center') {
        dataForTable = fetchedData.dataForTable;
        dataForCharts = fetchedData.dataForChart;
      } else if (actionId === 'total-month') {
        dataForTable = fetchedData.dataForTable;
        dataForCharts = fetchedData.dataForTable;
      } else if (actionId === 'plot-all') {
        dataForTable = fetchedData[0];
        dataForCharts = fetchedData;
      } else {
        dataForTable = fetchedData.dataForTable;
        dataForCharts = fetchedData.dataForChart;
        // if (false) {
        //   if (fetchedData.length === 1) {
        //     dataForTable = fetchedData[0];
        //     dataForCharts = fetchedData[0];
        //   } else if (fetchedData.length === 2) {
        //     dataForTable = fetchedData.dataForTable;
        //     dataForCharts = fetchedData;
        //   } else {
        //      console.warn("Unexpected data structure for default case:", fetchedData);
        //      showErrorToast('รูปแบบข้อมูลไม่ถูกต้องสำหรับการแสดงผล');
        //      this.tableRenderer.renderTable([], datetimeset);
        //      this.chartRenderer.hideAllCharts();
        //      return;
        //   }
        // } else {
        //   console.warn("Fetched data is not an array:", fetchedData);
        //   showErrorToast('ข้อมูลที่ได้รับมีรูปแบบที่ไม่รองรับ');
        //   this.tableRenderer.renderTable([], datetimeset);
        //   this.chartRenderer.hideAllCharts();
        //   return;
        // }
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
  
export default App;