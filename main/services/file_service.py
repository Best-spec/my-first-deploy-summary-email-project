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
