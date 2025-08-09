import pytest

from main.services.inquiry_service import InquiryService

def test_calculate_inquiry_summary():
    sample_data = [
        {"language": "English", "question": "General Inquiry"},
        {"language": "English", "question": "General Inquiry"},
        {"language": "Thai", "question": "สอบถามทั่วไป"},
        {"language": "Thai", "question": "อื่นๆ"},
    ]

    table, chart = InquiryService.calculate_inquiry_summary(sample_data)

    assert table[0]["General Inquiry"] == 2
    assert table[1]["General Inquiry"] == 1
    assert table[1]["Other"] == 1
    assert chart[0]["General Inquiry"] == 3


def test_cal_inquiry(monkeypatch):
    sample_data = [
        {"language": "English", "question": "General Inquiry"},
        {"language": "Thai", "question": "สอบถามทั่วไป"},
    ]

    monkeypatch.setattr(
        InquiryService,
        "load_csv_to_json",
        classmethod(lambda cls, start_date=None, end_date=None: sample_data),
    )

    table, chart = InquiryService.cal_inquiry("2024-01-01", "2024-01-31")

    assert table[-1]["Total Language"] == 2
    assert chart[0]["General Inquiry"] == 2
