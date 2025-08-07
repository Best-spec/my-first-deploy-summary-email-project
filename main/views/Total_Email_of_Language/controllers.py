from .Total_Email_of_Language import cal_TotalMonth
from main.views.Type_email import cal_all_type_email
from main.views.compare.result_compare import Resultcompare
from .chart_parser.chart3 import Total_Email_Type_By_Language
from .chart_parser.chart1 import Grand_Total_By_Language 

def find_TotalMonth(date, web):
    try:
        if len(date) <= 1:
            print("it 1")
            total, plot_data, transposed = cal_TotalMonth(date[0], web[0])
            grand_total_by_lang = Grand_Total_By_Language(total)
            total_email_type_by_lang = Total_Email_Type_By_Language(total)
            type_email = cal_all_type_email(date[0])
            # return [total, plot_data, type_email[0]]
            return {
                "table": total,
                "chart1": grand_total_by_lang,
                "chart2": [type_email],
                "chart3": total_email_type_by_lang,
                "chart4": 0,
                "chart5": 0,
            }
        else :
            print("it 2")
            totalset1, plot_data, transposed = cal_TotalMonth(date[0], web[0])
            totalset2, plot_data, transposed = cal_TotalMonth(date[1], web[1])
            type_email = cal_all_type_email(date[0])
            compare = Resultcompare(totalset1, totalset2, date) 
            return {
                "table": compare,
                "chart1": compare,
                "chart2": type_email
            }
    except Exception as e:
        print("error from cal total",e)