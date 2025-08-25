# apps/metrics/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .aggregator import aggregate_by_range
from .totalLanguageByType import loop_date_range, data_per_date
from .raw_data import line, linecompare

class AggregateView(APIView):   
    """
    POST /aggregate
    body: {
      "period": "day"|"week"|"month",
      "mode": "sum"|"avg",
      "range": { "startDate":"YYYY-MM-DD", "endDate":"YYYY-MM-DD" },
      "compareRange": { ... } // optional
    }
    """
    def post(self, request):
        body = request.data
        # data = body.get('data') or []
        period = body.get('period', 'day')
        mode = body.get('mode', 'sum')
        range_obj = body.get('range')
        compare_range = body.get('compareRange')

        if not range_obj:
            return Response({"error": "Missing range"}, status=400)
        
        try:
            # print(range_obj)
            # 🔥 ดึง raw data ตาม source และช่วงเวลา
            raw_data = linecompare

            cal = loop_date_range(range_obj)

            result = aggregate_by_range(
                cal,
                period=period,
                mode=mode,
                range_obj=range_obj,
                compare_range=compare_range
            )


            return Response(result)
        except Exception as e:
            return Response({'error': str(e)}, status=400)