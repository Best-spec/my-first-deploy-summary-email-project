from .Total_Email_of_Language import cal_TotalMonth
from main.views.Type_email import cal_all_type_email
from main.views.compare.result_compare import Resultcompare
from ..models.chart1 import Grand_Total_By_Language
from ..models.chart3 import Total_Email_Type_By_Language
from ..models.chart4 import inquiry_by_lang
from ..models.chart5 import appointment_by_lang
from ..models.chart6 import group_by_country_type
# from ..models.main_json import data_json
from ..serializers.total_serializer import TotalSerializer
import logging

logger = logging.getLogger(__name__)


def find_TotalMonth(date, web):
    try:
        if len(date) <= 1:
            data_json = {}
            logger.debug("it 1")
            summary, plot_data, transposed = cal_TotalMonth(date[0], web[0])
            data_json['table'] = summary
            data_json['chart1'] = Grand_Total_By_Language(summary)
            data_json['chart2'] = [cal_all_type_email(date[0])]
            data_json['chart3'] = Total_Email_Type_By_Language(summary)
            data_json['chart4'] = inquiry_by_lang(summary)
            data_json['chart5'] = appointment_by_lang(summary)
            data_json['chart6'] = group_by_country_type(summary)
            
            json = TotalSerializer(data_json)

            return json.data
        else :
            logger.debug("it 2")
            totalset1, plot_data, transposed = cal_TotalMonth(date[0], web[0])
            totalset2, plot_data, transposed = cal_TotalMonth(date[1], web[1])
            type_email = cal_all_type_email(date[0])
            compare = Resultcompare(totalset1, totalset2, date) 
            return {
                "table": compare,
                "chart1": compare,
                "chart2": type_email
            }
    except Exception:
        logger.exception("error from cal total")
