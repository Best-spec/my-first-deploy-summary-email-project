import pytest
from main.TopCenter.controllers.top_clinic_controller import find_top_clinics_summary

def test_output():
    assert isinstance(find_top_clinics_summary, list)