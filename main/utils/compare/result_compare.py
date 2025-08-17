from . import data_loader as dl
from . import data_comparator as dc
from . import raw_to_json as tj

def Resultcompare(data1, data2, dateParam):
    # print("from resultcompare")
    raw = dc.compareData(data1, data2)
    forCompareTable = tj.raw_to_json_res(raw, data1, data2, dateParam)

    return forCompareTable