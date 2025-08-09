
# ป้องกันการนำเข้า pandas จริงระหว่างการทดสอบ
import os
import sys
import types

# ทำให้โฟลเดอร์โปรเจ็กต์อยู่ใน PYTHONPATH
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

pandas_stub = types.ModuleType("pandas")
pandas_stub.read_csv = lambda *args, **kwargs: None
sys.modules.setdefault("pandas", pandas_stub)

