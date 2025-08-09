import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from main.services.file_service import FileService
from main.models import UploadedFile


@pytest.mark.django_db
def test_upload_files_success():
    service = FileService()
    file = SimpleUploadedFile('test.csv', b'a,b\n1,2')
    result = service.upload_files([file])
    assert len(result) == 1
    assert UploadedFile.objects.count() == 1


def test_upload_files_invalid_extension():
    service = FileService()
    bad_file = SimpleUploadedFile('test.txt', b'data')
    with pytest.raises(ValueError):
        service.upload_files([bad_file])
