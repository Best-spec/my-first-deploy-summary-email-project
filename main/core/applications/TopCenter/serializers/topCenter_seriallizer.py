from rest_framework import serializers

class TopCenterSerializer(serializers.Serializer):
    table = serializers.ListField()
    chart1 = serializers.ListField()
    chart2 = serializers.ListField()