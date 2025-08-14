# apps/metrics/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .aggregator import aggregate_by_range

class AggregateView(APIView):
    """
    POST /api/metrics/aggregate
    body: {
      "data": [{ "date":"2025-04-01" , "emails": 10, "errors": 1 }, ...],
      "period": "day"|"week"|"month",
      "mode": "sum"|"avg",
      "range": { "startDate":"YYYY-MM-DD", "endDate":"YYYY-MM-DD" },
      "compareRange": { ... } // optional
    }
    """
    def post(self, request):
        body = request.data
        data = body.get('data') or []
        period = body.get('period', 'day')
        mode = body.get('mode', 'sum')
        rng = body.get('range')
        cmp_rng = body.get('compareRange')
        try:
            res = aggregate_by_range(data, period=period, mode=mode, range_obj=rng, compare_range=cmp_rng)
            return Response(res)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
