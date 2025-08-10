from typing import List, Dict
from django.db import transaction
from django.core.files.uploadedfile import UploadedFile as DjangoUploadedFile
from main.models import UploadedFile


class FileService:
    """จัดการอัปโหลดและลบไฟล์แบบแยกชั้น service"""

    allowed_extensions = [".csv", ".xls", ".xlsx"]

    def upload_files(self, files: List[DjangoUploadedFile]) -> List[Dict]:
        uploaded_files: List[Dict] = []
        with transaction.atomic():
            for file in files:
                if not self._is_allowed(file.name):
                    raise ValueError(
                        f"ไฟล์ {file.name} ไม่ใช่ไฟล์ CSV หรือ Excel ที่รองรับ"
                    )
                uploaded_file = UploadedFile.objects.create(name=file.name, file=file)
                uploaded_files.append(
                    {
                        "id": uploaded_file.id,
                        "name": uploaded_file.name,
                        "timestamp": uploaded_file.uploaded_at.isoformat(),
                    }
                )
        return uploaded_files

    def delete_file(self, file_id: int) -> None:
        file = UploadedFile.objects.get(id=file_id)
        file.file.delete()
        file.delete()

    def list_files(self) -> List[Dict]:
        return list(UploadedFile.objects.values("id", "name", "uploaded_at"))

    def all(self):
        return UploadedFile.objects.all()

    def _is_allowed(self, filename: str) -> bool:
        return any(filename.endswith(ext) for ext in self.allowed_extensions)
    
    @transaction.atomic
    def delete_all_files(self) -> int:
        """
        ลบไฟล์ทั้งหมดทั้งใน storage และใน DB
        return: จำนวนไฟล์ที่ถูกลบ
        """
        count = 0
        # ใช้ iterator ให้กินแรมน้อย และเรียก delete ของ instance เพื่อให้ FileField ลบไฟล์จริง
        for obj in UploadedFile.objects.all().iterator():
            # ถ้ามี field ชื่อ file / path ปรับตามจริง
            if hasattr(obj, "file") and obj.file:
                try:
                    # ลบไฟล์ออกจาก storage ก่อน
                    obj.file.delete(save=False)
                except Exception:
                    # ไม่ให้พังทั้งล็อต; จะถูก rollback ถ้าอยากให้พังรวมค่อยยก Exception ขึ้น
                    pass
            obj.delete()   # ลบ row
            count += 1
        return count
