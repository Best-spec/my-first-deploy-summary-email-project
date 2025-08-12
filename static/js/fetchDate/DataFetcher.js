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
        showErrorToast(`ไม่สามารถดึงข้อมูลได้: ${errorData.message || 'เกิดปัญหาจากเซิร์ฟเวอร์'}`);
        throw new Error(errorData.message || 'Failed to fetch data from server.');
      }

      const result = await res.json();
      console.log('api data from backend:',result.data);
      if (result.data.error) {
        showErrorToast(`${result.data.error}`);
        throw new Error(result.data.error);
      } else {
        return result.data;
      }

    } catch (error) {
      console.error(error);
    }
  }
}

export default DataFetcher;