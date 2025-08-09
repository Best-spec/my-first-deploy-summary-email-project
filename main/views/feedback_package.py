from .compare.result_compare import Resultcompare
from ..services.feedback_package_service import FeedbackPackageService

service = FeedbackPackageService()


def cal_FeedbackAndPackage(date_param):
    return service.cal_FeedbackAndPackage(date_param)


def find_FeedbackAndPackage(date_param):
    try:
        if len(date_param) <= 1:
            table = service.cal_FeedbackAndPackage(date_param[0])
            return {
                "dataForTable": table,
                "dataForChart": table,
            }

        data1 = service.cal_FeedbackAndPackage(date_param[0])
        data2 = service.cal_FeedbackAndPackage(date_param[1])
        table = Resultcompare(data1, data2, date_param)
        return {
            "dataForTable": table,
            "dataForChart": table,
        }
    except Exception:
        return [], []


def FPtotal(date_param):
    try:
        raw_json = service.cal_FeedbackAndPackage(date_param)
        total = {"Feedback": 0, "Packages": 0}
        for item in raw_json:
            total["Feedback"] += item.get("Feedback", 0)
            total["Packages"] += item.get("Packages", 0)
        return [total]
    except Exception:
        return []
