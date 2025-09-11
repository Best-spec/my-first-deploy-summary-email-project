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


  async fetchLineChartData(controller){
    if (controller) controller.abort();          // cancel previous
    controller = new AbortController();
    setStatus('Loading...');
    const payload = { /* เตรียม payload ตามตัวอย่าง */ };
    payload.period = mode.value;

    try {
      const res = await fetch('/api/metrics/aggregate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        signal: controller.signal,
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = await res.json();
      setStatus('OK');
      // update chart: updateChartFromResponse(json)
      console.log(json);
    } catch (err) {
      if (err.name === 'AbortError') setStatus('Cancelled', true);
      else setStatus('Error: ' + err.message, true);
    } finally {
      controller = null;
    }
  }

  // static async fetchPeriodData() {
  //   try {
  //     const res = await fetch('/get_period/', {
  //       method: 'get',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'X-CSRFToken': getCsrfToken(),
  //       },
  //     });
  //     if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  //     const json = await res.json();
  //     console.log('Period data from backend:', json);
  //     return json;

  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
}

export default DataFetcher;