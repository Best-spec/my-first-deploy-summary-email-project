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
import { showSuccessToast, showErrorToast, showLoadingToast, hideToast } from '../script.js';

class Appfetch {
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


  // setupLineButton() {
  //   this.funcFetchLine = this.dataFetcher.fetchLineChartData() 
  //   this.uiHandler.fetchToLineChart()
  // }

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
    let loadingToast = null;
    try {

      loadingToast = showLoadingToast();
      const fetchedData = await this.dataFetcher.fetchData(actionId, datetimeset);
      // console.log(fetchedData.dataForTable )
      console.log('from app:',fetchedData)

      // fetchedData = { 
      //   'table': [{...}, ..., {...}]
      //   'chart1': [{...}, ..., {...}]
      //   'chart2': [{...}, ..., {...}]
      // ตามโครงสร้างที่ backend ส่งมา 
      // }

      let dataForTable;
      let dataForCharts;
      //เงื่อนไขไว้ render ตามหัวข้อ
      if (actionId === 'top-center') {
        dataForTable = fetchedData.table;
        dataForCharts = fetchedData

      } else if (actionId === 'total-month') {
        dataForTable = fetchedData.table;
        dataForCharts = fetchedData

      } else if (actionId === 'plot-all') {
        dataForTable = fetchedData.table;
        dataForCharts = fetchedData
        
      }

      this.chartRenderer.renderCharts(actionId, dataForCharts);
      this.tableRenderer.renderTable(dataForTable, datetimeset);

      hideToast(loadingToast);
      showSuccessToast('โหลดข้อมูลสำเร็จ!');

    } catch (error) {
      // console.error("การวิเคราะห์ล้มเหลว:", error);
      hideToast(loadingToast);
      // showErrorToast('เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + error.message);
      this.tableRenderer.renderTable([], datetimeset);
    }
  }
}
  
export default Appfetch;