from rest_framework import serializers

class TotalSerializer(serializers.Serializer):
    table = serializers.ListField()
    chart1 = serializers.ListField()
    chart2 = serializers.ListField()
    chart3 = serializers.ListField()
    chart4 = serializers.IntegerField()
    chart5 = serializers.IntegerField()