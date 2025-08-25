from .Total_Email_of_Language import cal_TotalMonth
# from main.views.Type_email import cal_all_type_email
from ..models.chart2 import cal_all_type_email
from main.utils.compare.result_compare import Resultcompare
from ..models.chart1 import Grand_Total_By_Language 
from ..models.chart3 import Total_Email_Type_By_Language
from ..models.chart4 import inquiry_by_lang 
from ..models.chart5 import appointment_by_lang 
from ..models.chart6 import group_by_country_type
# from ..models.main_json import data_json
from ..serializers.total_serializer import TotalSerializer



def find_TotalMonth(date_ranges, web):
    try:
        if len(date_ranges) < 2:
            data_json = {}
            print("it 1")
            summary, plot_data, transposed = cal_TotalMonth(date_ranges[0], web[0])
            data_json['table'] = summary
            data_json['chart1'] = Grand_Total_By_Language(summary)
            data_json['chart2'] = [cal_all_type_email(date_ranges[0])]
            # data_json['chart2'] = summary
            data_json['chart3'] = Total_Email_Type_By_Language(summary)
            data_json['chart4'] = inquiry_by_lang(summary)
            data_json['chart5'] = appointment_by_lang(summary)
            data_json['chart6'] = group_by_country_type(summary)
            
            json = TotalSerializer(data_json)

            return json.data
        else :
            print("it 2")
            summary1, plot_data, transposed = cal_TotalMonth(date_ranges[0], web[0])
            summary2, plot_data, transposed = cal_TotalMonth(date_ranges[1], web[1])
            type_email = cal_all_type_email(date_ranges[0])
            compare = Resultcompare(summary1, summary2, date_ranges) 
            data_json = {
                "table": compare,
                "chart1": Grand_Total_By_Language(summary1),
                "chart2": [cal_all_type_email(date_ranges[0])],
                "chart3": Total_Email_Type_By_Language(summary1),
                "chart4": inquiry_by_lang(summary1),
                "chart5": appointment_by_lang(summary1),
                "chart6": group_by_country_type(summary1),
                "compare": Resultcompare(summary1, summary2, date_ranges),
            }

            json = TotalSerializer(data_json)
            return json.data
        
    except Exception as e:
        print("error from cal total",e)