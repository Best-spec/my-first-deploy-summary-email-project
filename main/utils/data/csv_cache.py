# utils/csv_cache.py
from __future__ import annotations
from dataclasses import dataclass
from threading import RLock
from pathlib import Path
from time import time
import pandas as pd
import os
import copy
from typing import Dict, Tuple, List, Optional

@dataclass
class _Entry:
    data: List[dict]
    filepath: str
    mtime: int
    expires_at: float  # epoch seconds

class CSVCache:
    def __init__(self):
        self._store: Dict[Tuple[str, str], _Entry] = {}
        self._lock = RLock()

    def _read_csv(self, filepath: str, file_type: str, lang_code: str) -> List[dict]:
        df = pd.read_csv(filepath)
        df.columns = (
            df.columns
            .str.strip()
            .str.replace('\ufeff', '', regex=False)  # ตัด BOM
        )
        records = df.to_dict(orient="records")
        for d in records:
            d["file_type"] = file_type
            d["lang_code"] = lang_code
        return records

    def preload(self, *, filepath: str, file_type: str, lang_code: str, ttl_s: int) -> int:
        """อ่านไฟล์แล้วใส่แคชทันที (ใช้ตอน startup หรือหลังอัปโหลด)"""
        path = Path(filepath)
        if not path.exists():
            raise FileNotFoundError(filepath)
        data = self._read_csv(str(path), file_type, lang_code)
        mtime = int(os.path.getmtime(path))
        with self._lock:
            self._store[(file_type, lang_code)] = _Entry(
                data=data,
                filepath=str(path),
                mtime=mtime,
                expires_at=time() + ttl_s,
            )
        return mtime  # ใช้เป็น version ก็ได้

    def get(self, *, file_type: str, lang_code: str, ttl_s: int, default_path: Optional[str] = None) -> List[dict]:
        """
        ดึงจากแคช ถ้าหมดอายุ/ไฟล์เปลี่ยน/ยังไม่มี → โหลดใหม่ (ใช้ default_path เป็นแหล่งโหลด)
        คืนสำเนา (deep copy) กันเผลอแก้ของกลาง
        """
        key = (file_type, lang_code)
        now = time()
        with self._lock:
            entry = self._store.get(key)

            def _fresh_enough(e: _Entry) -> bool:
                return e.expires_at > now

            def _file_unchanged(e: _Entry) -> bool:
                try:
                    return int(os.path.getmtime(e.filepath)) == e.mtime
                except FileNotFoundError:
                    return False

            need_reload = False
            if entry is None:
                need_reload = True
            else:
                if not _fresh_enough(entry) or not _file_unchanged(entry):
                    need_reload = True

            if need_reload:
                if not default_path and not entry:
                    raise KeyError(f"No cache for {key} and no default_path provided")

                filepath = default_path or entry.filepath
                data = self._read_csv(filepath, file_type, lang_code)
                mtime = int(os.path.getmtime(filepath))
                entry = _Entry(
                    data=data,
                    filepath=filepath,
                    mtime=mtime,
                    expires_at=now + ttl_s,
                )
                self._store[key] = entry

            # คืนสำเนาเพื่อความปลอดภัย
            return copy.deepcopy(entry.data)

    def invalidate(self, *, file_type: str, lang_code: str) -> None:
        with self._lock:
            self._store.pop((file_type, lang_code), None)

    def clear(self) -> None:
        with self._lock:
            self._store.clear()

# singleton
_cache: Optional[CSVCache] = None
def csv_cache() -> CSVCache:
    global _cache
    if _cache is None:
        _cache = CSVCache()
    return _cache
