import data_loader as dl
import data_comparator as dc
import raw_to_json as tj

def Resultcompare():
    date_1 = dl.loadSet1
    data_2 = dl.loadSet2
    raw = dc.compareData(date_1, data_2)
    json = tj.raw_to_json_res(raw)
    return json