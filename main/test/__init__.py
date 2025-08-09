import os
import sys
import types

# เพิ่มเส้นทางโปรเจ็กต์ลงใน PYTHONPATH
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

# สร้างโมดูล pandas ปลอมเพื่อหลีกเลี่ยงการติดตั้งจริง
pandas_stub = types.ModuleType("pandas")
pandas_stub.read_csv = lambda *args, **kwargs: None
sys.modules.setdefault("pandas", pandas_stub)

