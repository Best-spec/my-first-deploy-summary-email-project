import pytest

from main.services.type_email_service import TypeEmailService


def test_cal_all_type_email(monkeypatch):
    def fake_cal_inquiry(start, end):
        return None, [{'General Inquiry': 1, 'Estimated Cost': 2, 'Other': 3, 'Contact Doctor': 4}]

    def fake_FPtotal(date):
        return [{'Packages': 5, 'Feedback': 6}]

    def fake_find_appointment_summary(date):
        return [{'Appointment': 7, 'Appointment Recommended': 8}]

    monkeypatch.setattr('main.services.type_email_service.cal_inquiry', fake_cal_inquiry)
    monkeypatch.setattr('main.services.type_email_service.FPtotal', fake_FPtotal)
    monkeypatch.setattr('main.services.type_email_service.find_appointment_summary', fake_find_appointment_summary)

    result = TypeEmailService.cal_all_type_email({'startDate': '2024-01-01', 'endDate': '2024-01-01'})

    assert result['General Inquiry'] == 1
    assert result['Estimated Cost'] == 2
    assert result['Other'] == 3
    assert result['Contact Doctor'] == 4
    assert result['Package Inquiry'] == 5
    assert result['Feedback & Suggestion'] == 6
    assert result['Appointment'] == 7
    assert result['Appointment Recommended'] == 8


def test_find_all_type_email_single_range(monkeypatch):
    monkeypatch.setattr(TypeEmailService, 'cal_all_type_email', classmethod(lambda cls, d: {'value': 1}))
    monkeypatch.setattr(TypeEmailService, 'map_spit_date', classmethod(lambda cls, d: [{'Date': d['startDate'], 'value': 1}]))

    data = TypeEmailService.find_all_type_email([
        {'startDate': '2024-01-01', 'endDate': '2024-01-01'}
    ])

    assert data['table'] == [{'value': 1}]
    assert data['chart1'] == [{'value': 1}]
    assert data['chart2'] == [{'Date': '2024-01-01', 'value': 1}]


def test_find_all_type_email_two_ranges(monkeypatch):
    monkeypatch.setattr(TypeEmailService, 'cal_all_type_email', classmethod(lambda cls, d: {'value': d['startDate']}))
    monkeypatch.setattr(TypeEmailService, 'map_spit_date', classmethod(lambda cls, d: [{'Date': d['startDate']}]))

    def fake_Resultcompare(d1, d2, dates):
        return [{'compare': True}]

    monkeypatch.setattr('main.services.type_email_service.Resultcompare', fake_Resultcompare)

    data = TypeEmailService.find_all_type_email([
        {'startDate': '2024-01-01', 'endDate': '2024-01-01'},
        {'startDate': '2024-02-01', 'endDate': '2024-02-01'}
    ])

    assert data['table'] == [{'compare': True}]
    assert data['chart1'] == [{'compare': True}]
    assert data['chart2'] == [{'Date': '2024-01-01'}]
