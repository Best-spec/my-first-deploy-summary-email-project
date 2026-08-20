import React, { useRef } from 'react';
import { ChevronsRight, UploadCloud, Play } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onFilesSelected?: (files: FileList | null) => void;
  onStart?: () => void;
}

export default function Sidebar({ isOpen, onToggle, onFilesSelected, onStart }: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div className="w-full lg:w-96 h-screen bg-white border-r border-gray-200 shadow-md flex flex-col transition-all duration-300">
      <div className="sticky top-0 z-20 flex justify-between p-6 border-b border-gray-200 bg-gradient-to-br from-indigo-500 to-purple-700 text-white">
        <h1 className="text-xl font-semibold flex items-center gap-3">
          <span role="img" aria-label="folder">📁</span> File Manager
        </h1>
        <div 
          onClick={onToggle}
          className="relative flex items-center justify-center cursor-pointer w-[40px] h-[40px] transition-opacity duration-300 opacity-100 hover:bg-black/20 hover:rounded-lg"
        >
          <ChevronsRight className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto z-0">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-all cursor-pointer bg-gray-50 hover:border-blue-500 hover:bg-blue-50 hover:scale-105"
        >
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
            <UploadCloud className="w-6 h-6 text-gray-600" />
          </div>
          <div className="text-gray-600 mb-2 font-medium">ลากไฟล์มาวางที่นี่</div>
          <div className="text-sm text-gray-500 mb-4">หรือเลือกไฟล์ที่ต้องการอัปโหลด</div>
          <input 
            type="file" 
            ref={fileInputRef} 
            accept=".csv,.xls,.xlsx" 
            className="hidden" 
            multiple 
            onChange={(e) => onFilesSelected && onFilesSelected(e.target.files)}
          />
        </div>
        <div className="flex justify-center mt-6">
          <button 
            onClick={onStart}
            className="bg-gradient-to-br from-purple-500 to-blue-700 text-white py-2 px-8 rounded-lg font-medium inline-flex items-center gap-2 hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            START
          </button>
        </div>
      </div>
    </div>
  );
}
