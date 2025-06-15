import json
from django.test import TestCase, RequestFactory
from main.views import showDF_file  # เปลี่ยนชื่อ view ให้ตรงของมึง

class ViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_csv_to_json_view(self):
        response = self.client.get('/analyze-all/')
        json_data = response.json()  # ✅ ใช้ได้

        print("✅ JSON:", json_data)
