from TopCenter.controllers.top_clinic_controller import find_top_clinics_summary

def find_top_clinics_summary_main(date_param=None):

    try:
        if len(date_param) <= 1:
            print(date_param, len(date_param))
            start = date_param[0]['startDate']
            end = date_param[0]['endDate']
            for_table, pop_total, total = sumf_top(start, end)
            return {
               "table": for_table,
               "topcenter": pop_total,
               "total": total
            }
        else:
            print('มากกว่าสอง')
            startset1 = date_param[0]['startDate']
            endset1 = date_param[0]['endDate']
            startset2 = date_param[1]['startDate']
            endset2 = date_param[1]['endDate']
            for_table, pop_total, total = sumf_top(startset1, endset1)
            for_table2, pop_total2, total2 = sumf_top(startset2, endset2)
            return {
                "table": Resultcompare(for_table, for_table2, date_param),
                "topcenter": pop_total,
                "total": total
            }



    except Exception as e:
        print("🔥 ERROR in topCetner():", e)
        return [], [] 