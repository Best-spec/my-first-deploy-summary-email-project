import React from 'react';

export default function Charts({ data }: { data?: any }) {
  if (!data) return null;

  return (
    <div className="w-full">
      {/* 2-column charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 m-4 lg:m-10">
        <div className="bg-white rounded-xl shadow-md p-6 h-96 border border-slate-100 transition-all hover:shadow-lg flex flex-col">
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-black to-purple-600 bg-clip-text text-transparent">
            Chart Title 1
          </h3>
          <div className="flex-1 w-full bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-dashed border-slate-200">
            {/* Canvas would go here */}
            <span>Bar Chart Canvas</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 h-96 border border-slate-100 transition-all hover:shadow-lg flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Chart Title 2</h3>
          <div className="flex-1 w-full bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-dashed border-slate-200">
            {/* Canvas would go here */}
            <span>Bar Chart Canvas</span>
          </div>
        </div>
      </div>

      {/* 1-column charts & Line chart */}
      <div className="grid grid-cols-1 gap-8 m-4 lg:m-10">
        <div className="bg-white rounded-xl shadow-md p-6 h-96 border border-slate-100 transition-all hover:shadow-lg flex flex-col">
          <div className="flex gap-4 items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Timeline Analysis</h3>
            <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
          <div className="flex-1 w-full bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-dashed border-slate-200">
            {/* Canvas would go here */}
            <span>Line Chart Canvas</span>
          </div>
        </div>
        
        {/* Pie Charts Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 h-72 border border-slate-100 transition-all hover:shadow-lg flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Distribution {i}</h3>
              <div className="flex-1 w-full bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-dashed border-slate-200 mx-auto" style={{ maxWidth: '200px', maxHeight: '200px' }}>
                <span>Pie</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
