import pytest
from main.TopCenter.controllers.top_clinic_controller import find_top_clinics_summary


def test_output():
    result = find_top_clinics_summary()
    assert isinstance(result, list)
