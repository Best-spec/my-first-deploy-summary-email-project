from main.services.inquiry_service import InquiryService
from .compare.result_compare import Resultcompare


def find_inquiry(date_param):
    try:
        if len(date_param) <= 1:
            start = date_param[0]['startDate']
            end = date_param[0]['endDate']
            for_table, for_chart = InquiryService.cal_inquiry(start, end)
            return {
                "dataForTable": for_table,
                "dataForChart": for_chart,
            }
        else:
            startset1 = date_param[0]['startDate']
            endset1 = date_param[0]['endDate']
            startset2 = date_param[1]['startDate']
            endset2 = date_param[1]['endDate']
            table1, chart1 = InquiryService.cal_inquiry(startset1, endset1)
            table2, chart2 = InquiryService.cal_inquiry(startset2, endset2)
            return {
                "dataForTable": Resultcompare(table1, table2, date_param),
                "dataForChart": chart1,
            }
    except Exception as e:
        print("🔥 ERROR in find_inquiry():", e)
        return [], []


def get_total_languages_summary(date_param):
    try:
        table, _ = InquiryService.cal_inquiry(
            date_param['startDate'], date_param['endDate']
        )
        result = []
        for row in table:
            lang = row.get("language")
            total = row.get("Total Language", 0)
            if lang and "Total Language" in row:
                result.append({"language": lang, "Total Language": total})
        return result
    except Exception as e:
        print("🔥 ERROR (get_total_languages_summary):", e)
        return []
