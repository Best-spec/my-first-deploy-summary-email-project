import { getCsrfToken } from './utility.js';
// สมมติว่า script.js มี showErrorToast
import { showErrorToast } from '../script.js';

class DataFetcher {
  constructor() {
    this.webcom = null; // เก็บค่า Web Commerce
  }

  setWebCommerce(value) {
    this.webcom = value;
  }

  async fetchData(actionId, datetimeset) {
    try {
      const res = await fetch('/analyze/', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
        body: JSON.stringify({
          action_id: actionId,
          date: datetimeset,
          Web_Commerce: this.webcom,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data from server.');
      }

      const result = await res.json();
      console.log('api data from backend:',result.data)
      return result.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      // showErrorToast(`ไม่สามารถดึงข้อมูลได้: ${error.message || 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ'}`);
      showErrorToast(`ไม่สามารถดึงข้อมูลได้: ยังไม่ได้อัพโหลดไฟล์ หรือข้อมูลจากหลังบ้านว่าง`);
      throw error;
    }
  }
}

export default DataFetcher;