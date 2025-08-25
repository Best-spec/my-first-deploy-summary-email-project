// ===================================
// File: UIHandler.js
// หน้าที่: จัดการการโต้ตอบกับ UI
// ===================================
class UIHandler {
  constructor() {
    // อ้างอิงถึง element ของ Modal และ input ต่างๆ
    // ไม่มี this.toggleElement แล้ว เพราะไม่มี checkbox ใน Modal นี้
    this.webTag2Element = document.getElementById("web-tag2"); // div ที่ครอบ input webcom2_i
    this.closeModalButton = document.getElementById("closeModal");
    this.modalElement = document.getElementById("myModal");
    this.webcom1Input = document.getElementById("webcom1_i");
    this.webcom2Input = document.getElementById("webcom2_i");
    this.okButton = document.getElementById("ok");
    this.titleElement = document.getElementById('title'); // สมมติว่ามี element ที่มี id="title" สำหรับแสดงหัวข้อ
    this.btn = document.getElementById('btnFetch');
    this.mode = document.getElementById('mode');
    this.status = document.getElementById('status');
    
    this.controller = null;
    this.debounceTimer = null;

    // ตัวแปรเก็บ reference ของ event handlers เพื่อใช้ในการ remove
    this.okButtonHandler = null;
    this.closeModalHandler = null;
    this.modalClickHandler = null;
  }

  // เมธอดสำหรับอัปเดตหัวข้อของหน้า (ตาม actionId)
  updateTitle(actionId) {
    if (this.titleElement) {
      if (actionId === 'plot-all') {
        this.titleElement.innerHTML = 'ประเภท ' + 'Total Email by Type';
      } else if (actionId === 'total-month') {
        this.titleElement.innerHTML = 'ประเภท ' + 'Total Email by Language';
      } else {
        this.titleElement.innerHTML = 'ประเภท ' + actionId;
      }
    } else {
      console.warn("Title element with ID 'title' not found.");
    }
  }

  /**
   * ตั้งค่าและแสดง Modal สำหรับ Web Commerce Selection.
   * @param {function} onOkCallback - Callback ที่จะถูกเรียกเมื่อผู้ใช้กดปุ่ม OK ใน Modal
   * @param {boolean} showWebcom2Initially - ค่า true ถ้าต้องการให้แสดง input "ข้อมูลชุดสอง" (web-tag2) ทันที
   */
  setupModal(onOkCallback, showWebcom2Initially = false) { 
    // รีเซ็ตค่า input และสถานะการแสดงของ web-tag2 ทุกครั้งที่เปิด Modal
    this.webcom1Input.value = '';
    this.webcom2Input.value = '';

    this.removeModalListeners(); // ลบ Event Listener เดิมออกก่อนเพื่อป้องกันการซ้ำซ้อน
    
    // ควบคุมการแสดง web-tag2 โดยตรงตามพารามิเตอร์ showWebcom2Initially
    if (this.webTag2Element) {
        if (showWebcom2Initially) {
            this.webTag2Element.classList.remove('hidden');
        } else {
            this.webTag2Element.classList.add('hidden');
        }
    } else {
        console.warn("Web-tag2 element with ID 'web-tag2' not found.");
    }
    
    // แสดง Modal
    if (this.modalElement) {
      this.modalElement.classList.remove("hidden");
      this.modalElement.classList.add("flex");
    } else {
      console.warn("Modal element with ID 'myModal' not found.");
      return; // ออกจากฟังก์ชันถ้า Modal ไม่พร้อม
    }

    // กำหนด Event Handler สำหรับปุ่ม OK
    this.okButtonHandler = () => {
      const webcomValues = [this.webcom1Input.value, this.webcom2Input.value];
      this.modalElement.classList.remove("flex");
      this.modalElement.classList.add("hidden"); // ซ่อน Modal
      onOkCallback(webcomValues); // เรียก callback ที่ App.js ส่งมา
      this.removeModalListeners(); // ลบ Event Listener หลังจาก Modal ถูกปิด
    };

    // กำหนด Event Handler สำหรับปุ่ม Close
    this.closeModalHandler = () => {
      this.modalElement.classList.remove("flex");
      this.modalElement.classList.add("hidden"); // ซ่อน Modal
      this.removeModalListeners(); // ลบ Event Listener
    };

    // กำหนด Event Handler สำหรับคลิกนอก Modal
    this.modalClickHandler = (e) => {
      if (e.target === this.modalElement) { // ถ้าคลิกที่พื้นหลัง Modal
        this.closeModalHandler(); // เรียกฟังก์ชันปิด Modal
      }
    };

    // เพิ่ม Event Listener ให้กับปุ่มและ Modal
    if (this.okButton) this.okButton.addEventListener("click", this.okButtonHandler);
    if (this.closeModalButton) this.closeModalButton.addEventListener("click", this.closeModalHandler);
    if (this.modalElement) this.modalElement.addEventListener("click", this.modalClickHandler);
  }

  // เมธอดสำหรับลบ Event Listener ของ Modal เพื่อป้องกัน Memory Leak
  removeModalListeners() {
    if (this.okButtonHandler && this.okButton) {
      this.okButton.removeEventListener("click", this.okButtonHandler);
      this.okButtonHandler = null;
    }
    if (this.closeModalHandler && this.closeModalButton) {
      this.closeModalButton.removeEventListener("click", this.closeModalHandler);
      this.closeModalHandler = null;
    }
    if (this.modalClickHandler && this.modalElement) {
      this.modalElement.removeEventListener("click", this.modalClickHandler);
      this.modalClickHandler = null;
    }
  }

  // ไม่จำเป็นต้องมีเมธอด forceWebcom2Toggle แล้ว เพราะ setupModal จัดการโดยตรง
  fetchToLineChart() {
    this.btn.addEventListener('click', () => {
      clearTimeout(this.debounceTimer);
      debounceTimer = setTimeout(()=> doFetch(this.controller), 200);
    });
  }
}

export default UIHandler;