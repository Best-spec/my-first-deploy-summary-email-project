'use client';

export default function ChartsSection() {
  return (
    <div className="m-10 space-y-8">
      {/* Row 1: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 h-96 shadow-sm">
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-black to-purple-600 bg-clip-text text-transparent">Grand Total By Language</h3>
          <div className="h-full bg-gray-50 flex items-center justify-center">[Canvas Chart 1]</div>
        </div>
        <div className="bg-white rounded-xl p-6 h-96 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Grand Total By Email Type</h3>
          <div className="h-full bg-gray-50 flex items-center justify-center">[Canvas Chart 2]</div>
        </div>
      </div>

      {/* Row 2: Full Width Line Chart */}
      <div className="bg-white rounded-xl p-6 h-96 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Grand Total By Email Type (LineChart)</h3>
          <select className="border rounded px-2 py-1">
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>
        <div className="h-full bg-gray-50 flex items-center justify-center">[Line Chart]</div>
      </div>
    </div>
  );
}