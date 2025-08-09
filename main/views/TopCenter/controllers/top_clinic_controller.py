# app/controllers/top_clinic_controller.py
from main.views.TopCenter.services.csv_service import load_csv_appointments
from main.views.TopCenter.services.clinic_summary_service import summarize_clinic_data
from ..serializers.topCenter_seriallizer import TopCenterSerializer
from main.views.compare.result_compare import Resultcompare
from .model import mock
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)

def date_to_cal(date_ranges, folder_path="media/uploads"):
    langs = ["ar", "de", "en", "ru", "th", "zh-hans"]
    dr = date_ranges
    start = datetime.strptime(dr['startDate'], "%Y-%m-%d")
    end = datetime.strptime(dr['endDate'], "%Y-%m-%d")
    normal = load_csv_appointments(folder_path, langs, start, end, file_type="appointment")
    recommended = load_csv_appointments(folder_path, langs, start, end, file_type="recommended")
    all_data = normal + recommended
    processed_data, pop_total, spit_total = summarize_clinic_data(all_data)
    return processed_data, pop_total, spit_total


def find_top_clinics_summary(date_ranges): # data_ranges = [{'startDate': 0,'endDate': 0},{...}]
    try :
        if len(date_ranges) < 2 and date_ranges != None:
            logger.debug('%s %s', date_ranges, 'one')
            summary, pop_total, spit_total = date_to_cal(date_ranges[0])

            data = {
                'table': mock,
                'chart1': mock,
                'chart2': mock
            }
            json = TopCenterSerializer(data)
            # print(json.dumps(json.data, indent=2))
            print(json.data, 'json')
            return json.data
        
        else :
            logger.debug('%s %s', date_ranges, 'two')
            summary1, pop_total, spit_total = date_to_cal(date_ranges[0])
            summary2, pop_total2, spit_total2 = date_to_cal(date_ranges[1])

            data = {
                'table': Resultcompare(summary1, summary2, date_ranges),
                'chart1': pop_total,
                'chart2': spit_total
            }
            json = TopCenterSerializer(data)

            return json.data

    
    except Exception:
        logger.exception('topcenter:')



        
#====================== mock ===========================================================================
# mock data omitted
