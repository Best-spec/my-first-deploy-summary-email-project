# 📊 Summary Email Analysis & Dashboard System

ระบบแดชบอร์ดวิเคราะห์และสรุปผลข้อมูลอีเมลภาษาและศูนย์บริการ (Summary Email Analysis System) ที่ได้รับการพัฒนาและปรับเปลี่ยนสถาปัตยกรรมจาก Django Legacy Frontend มาสู่ **Modern Next.js Frontend** ทำงานร่วมกับ **Django REST API Backend** เพื่อประสิทธิภาพ ประสบการณ์การใช้งานที่สวยงาม ตอบสนองอย่างรวดเร็ว (Responsive) และวิเคราะห์ข้อมูลได้อย่างเที่ยงตรง

---

## 🌟 ฟีเจอร์หลัก (Key Features)

- **📁 File Management System**:
  - รองรับการอัปโหลดและจัดการไฟล์ข้อมูลอีเมล (`.csv`, `.xls`, `.xlsx`) ผ่าน Sidebar
  - สามารถดาวน์โหลด และลบไฟล์ข้อมูลได้อย่างง่ายดาย
- **📅 Dynamic Date Range Selection (MUI X DateRangePicker)**:
  - เลือกระยะเวลาการวิเคราะห์ข้อมูลด้วย MUI X DateRangePicker
  - รองรับ **COMPARE Mode (โหมดเปรียบเทียบข้อมูล)** แสดงช่องเลือกช่วงเวลาที่ 2 ต่อลงมาด้านล่างอัตโนมัติ
- **📊 Advanced Data Visualizations (Chart.js & react-chartjs-2)**:
  - **Top Center Charts**: กราฟแท่งเปรียบเทียบ 20 ศูนย์บริการชั้นนำ (Top Appointment vs Appointment Recommended & Top Total 20 Center) เรียงต่อกันจากบนลงล่าง อ่านง่าย
  - **Grand Total By Language & Email Type**: สรุปรวมจำนวนอีเมลแยกตามภาษาและประเภทอีเมล
  - **Grouped Category Bar Charts**: จำแนกประเภท Inquiry และ Appointment ตาม 6 ภาษาหลัก (Thai, English, Arabic, Japanese, Chinese, Myanmar)
  - **Language Distribution Breakdown**: กราฟวงกลม (Pie Chart) พร้อมหลอดแสดงเปอร์เซ็นต์ (Progress Bars) และระบบปรับสีตัวอักษรเพื่อความคมชัด 100%
- **📋 Interactive Data Table Summary**:
  - ตารางสรุปผลการวิเคราะห์ข้อมูลจำแนกอย่างละเอียด
  - รองรับการเปรียบเทียบข้อมูล 2 ช่วงเวลาแบบย่อย (Sub-rows)

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

### **Frontend**:
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) + React 19
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Charts Library**: `chart.js` + `react-chartjs-2` + `chartjs-plugin-datalabels`
- **Date Pickers**: `@mui/x-date-pickers-pro` + `dayjs` + `@mui/material`
- **Icons**: `lucide-react`

### **Backend**:
- **Framework**: [Django 4.x / 5.x](https://www.djangoproject.com/) (Python)
- **Data Processing**: `pandas`, `openpyxl`
- **Database**: SQLite3 (Development)

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
my-first-deploy-summary-email-project/
├── frontend-next/                 # แอปพลิเคชัน Frontend (Next.js)
│   ├── src/
│   │   ├── app/                   # Next.js App Router (pages, layout)
│   │   ├── components/            # UI Components
│   │   │   ├── AnalysisActions.tsx  # ส่วนเลือกช่วงเวลา & ปุ่ม Action (MUI X DateRangePicker)
│   │   │   ├── Charts.tsx           # ระบบแสดงผลกราฟ Chart.js
│   │   │   ├── Header.tsx           # ส่วนหัวของแดชบอร์ด & ควบคุม Sidebar
│   │   │   ├── KpiCards.tsx         # ตารางสรุปผลการวิเคราะห์ข้อมูล
│   │   │   └── Sidebar.tsx          # จัดการไฟล์อัปโหลด (.csv, .xlsx)
│   ├── next.config.ts             # การตั้งค่า Rewrite Proxy ไปยัง Django API
│   └── package.json
├── main/                          # แอปพลิเคชัน Backend (Django)
│   ├── controllers/               # Controller สรุปผลตามหัวข้อวิเคราะห์
│   ├── services/                  # Business Logic & การประมวลผลข้อมูล
│   ├── views/                     # API View Endpoints (/backend/analyze/, /backend/aggregate/)
│   └── urls.py
├── manage.py                      # Django CLI
├── requirements.txt               # Python Dependencies
├── run_backend.sh                 # สคริปต์รัน Django Backend Server
└── README.md
```

---

## 🚀 ขั้นตอนการติดตั้งและรันใช้งาน (Installation & Setup)

### **1. สิ่งที่ต้องเตรียมก่อนติดตั้ง (Prerequisites)**
- **Node.js**: v18.0.0 หรือสูงกว่า
- **Python**: v3.10 หรือสูงกว่า
- **npm** หรือ **yarn**

---

### **2. ตั้งค่า Backend (Django)**

1. Clone Repository เข้ามายังเครื่องของคุณ:
   ```bash
   git clone <repository-url>
   cd my-first-deploy-summary-email-project
   ```

2. สร้างและเปิดใช้งาน Virtual Environment:
   ```bash
   # Linux/macOS
   python3 -m venv venv
   source venv/bin/activate

   # Windows
   python -m venv venv
   venv\Scripts\activate
   ```

3. ติดตั้ง Python Packages:
   ```bash
   pip install -r requirements.txt
   ```

4. ทำการ Migration ฐานข้อมูล:
   ```bash
   python manage.py migrate
   ```

5. เริ่มต้นทำงาน Django Backend Server (พอร์ต 8000):
   ```bash
   python manage.py runserver 8000
   # หรือรันผ่านสคริปต์
   ./run_backend.sh
   ```

---

### **3. ตั้งค่า Frontend (Next.js)**

1. เปิด Terminal ใหม่แล้วเข้าไปยังโฟลเดอร์ `frontend-next`:
   ```bash
   cd frontend-next
   ```

2. ติดตั้ง Dependencies:
   ```bash
   npm install
   ```

3. เริ่มต้นทำงาน Next.js Development Server:
   ```bash
   npm run dev
   ```

4. เปิดเบราว์เซอร์แล้วเข้าไปที่: **`http://localhost:3000`**

---

## 💡 วิธีการใช้งาน (Usage Guide)

1. **จัดการไฟล์ข้อมูล**:
   - ลากและวางไฟล์ `.csv` หรือ `.xlsx` ข้อมูลอีเมลลงในกล่องอัปโหลดด้านซ้าย (Sidebar)
2. **เลือกช่วงเวลาการวิเคราะห์**:
   - คลิกเลือกช่วงเวลาที่ต้องการวิเคราะห์ที่ช่อง **ช่วงเวลาที่ 1**
   - หากต้องการเปรียบเทียบ ให้เปิดสวิตช์ **COMPARE Mode** แล้วเลือกช่วงเวลาที่ช่อง **ช่วงเวลาที่ 2 (ช่องล่าง)**
3. **เริ่มคำนวณและแสดงผล**:
   - กดคลิกที่ปุ่มหัวข้อที่ต้องการคำนวณ เช่น **Top Center** หรือ **Total Email by Language**
   - ระบบจะทำการดึงข้อมูลจาก API มาประมวลผลและแสดงเป็นแดชบอร์ดกราฟและตารางสรุปโดยอัตโนมัติ

---

## 📄 License
โปรเจกต์นี้จัดทำขึ้นเพื่อการประมวลผลและวิเคราะห์ข้อมูลภายในองค์กร
