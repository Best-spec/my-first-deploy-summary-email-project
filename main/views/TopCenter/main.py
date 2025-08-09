import logging
from main.views.TopCenter.controllers.top_clinic_controller import find_top_clinics_summary

logger = logging.getLogger(__name__)


def find_top_clinics_summary_main(date_param=None):
    try:
        if len(date_param) <= 1:
            for_table, pop_total, total = find_top_clinics_summary(date_param)
            return {
                "table": for_table,
                "topcenter": pop_total,
                "total": total,
            }
        else:
            for_table, pop_total, total = sumf_top(startset1, endset1)
            for_table2, pop_total2, total2 = sumf_top(startset2, endset2)
            return {
                "table": Resultcompare(for_table, for_table2, date_param),
                "topcenter": pop_total,
                "total": total,
            }
    except Exception:
        logger.exception("🔥 ERROR in topCetner():")
        return [], []

