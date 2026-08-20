"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronsLeft,
  UploadCloud,
  Play,
  Trash2,
  FileText,
  FileSpreadsheet,
  FileImage,
  Archive,
  File,
  Loader2,
  Folder,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface UploadedFileItem {
  id: number | string;
  name: string;
  size: number;
  url: string;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onFilesSelected?: (files: FileList | null) => void;
  onStart?: () => void;
}

export default function Sidebar({ isOpen, onToggle, onStart }: SidebarProps) {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const loadFiles = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/backend/load_files/', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        cache: 'no-store'
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && !res.redirected && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          setFiles(data.files || []);
        } else {
          console.error('Failed to load files:', data);
        }
      }
    } catch (err) {
      console.error('Error loading files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleUpload = async (selectedFiles: FileList | File[] | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append('files', file);
    });

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/backend/upload/', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && !res.redirected && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          showToast('อัปโหลดเสร็จเรียบร้อย', 'success');
          await loadFiles();
        } else {
          showToast(data.error || 'อัปโหลดไม่สำเร็จ', 'error');
        }
      } else {
        showToast('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่', 'error');
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast('เกิดข้อผิดพลาดตอนอัปโหลด', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteFile = async (fileId: number | string) => {
    setDeletingId(fileId);
    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();
      formData.append('file_id', String(fileId));

      const res = await fetch('/backend/delete_file/', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && !res.redirected && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          showToast('ลบไฟล์สำเร็จ', 'success');
          await loadFiles();
        } else {
          showToast(data.message || 'ลบไม่สำเร็จ', 'error');
        }
      } else {
        showToast('เกิดข้อผิดพลาดในการลบไฟล์', 'error');
      }
    } catch (err) {
      console.error('Delete file error:', err);
      showToast('เกิดข้อผิดพลาดขณะลบไฟล์', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAllFiles = async () => {
    if (!confirm('คุณต้องการลบไฟล์ทั้งหมดใช่หรือไม่?')) return;

    setDeletingAll(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/backend/delete_all_files/', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && !res.redirected && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          showToast(data.message || 'ลบไฟล์ทั้งหมดสำเร็จ', 'success');
          await loadFiles();
        } else {
          showToast(data.message || 'ลบไฟล์ทั้งหมดไม่สำเร็จ', 'error');
        }
      } else {
        showToast('เกิดข้อผิดพลาดในการลบไฟล์ทั้งหมด', 'error');
      }
    } catch (err) {
      console.error('Delete all error:', err);
      showToast('เกิดข้อผิดพลาดขณะลบไฟล์ทั้งหมด', 'error');
    } finally {
      setDeletingAll(false);
    }
  };

  // Drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />;
    }
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) {
      return <FileImage className="w-5 h-5 text-blue-500 shrink-0" />;
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext || '')) {
      return <Archive className="w-5 h-5 text-amber-500 shrink-0" />;
    }
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) {
      return <FileText className="w-5 h-5 text-indigo-500 shrink-0" />;
    }
    return <File className="w-5 h-5 text-gray-500 shrink-0" />;
  };

  if (!isOpen) return null;

  return (
    <div className="w-full lg:w-96 h-screen bg-white border-r border-gray-200 shadow-md flex flex-col transition-all duration-300 relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`absolute top-20 right-4 left-4 z-50 flex items-center p-3 rounded-xl text-sm shadow-lg transition-all ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-rose-50 text-rose-700 border border-rose-300'
          }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 mr-2 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2 shrink-0 text-rose-600" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-20 flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-br from-indigo-500 to-purple-700 text-white">
        <h1 className="text-xl font-semibold flex items-center gap-3">
          <Folder className="w-6 h-6" /> File Manager
        </h1>
        <div
          onClick={onToggle}
          className="relative flex items-center justify-center cursor-pointer w-[40px] h-[40px] transition-opacity duration-300 opacity-100 hover:bg-black/20 rounded-lg"
          title="ซ่อน Sidebar"
        >
          <ChevronsLeft className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto z-0 flex flex-col space-y-6">
        {/* Upload Area */}
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${dragActive
            ? 'border-blue-500 bg-blue-50 scale-[1.02]'
            : 'border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
            }`}
        >
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3">
            {uploading ? (
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6 text-indigo-600" />
            )}
          </div>
          <div className="text-gray-700 mb-1 font-medium text-sm">
            {uploading ? 'กำลังอัปโหลดไฟล์...' : 'ลากไฟล์มาวางที่นี่'}
          </div>
          <div className="text-xs text-gray-500 mb-2">
            หรือคลิกเพื่อเลือกไฟล์ (.csv, .xls, .xlsx)
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv,.xls,.xlsx"
            className="hidden"
            multiple
            onChange={(e) => handleUpload(e.target.files)}
          />
        </div>

        {/* Start Button */}
        {/* <div className="flex justify-center">
          <button 
            onClick={onStart}
            className="w-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white py-2.5 px-6 rounded-lg font-medium inline-flex items-center justify-center gap-2 hover:opacity-95 hover:shadow-md transition-all active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-current" />
            START
          </button>
        </div> */}

        {/* Uploaded File List Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
            <span className="font-semibold text-gray-800 text-sm">ไฟล์ที่อัปโหลด</span>
            <div className="flex items-center gap-2">
              {files.length > 0 && (
                <button
                  onClick={handleDeleteAllFiles}
                  disabled={deletingAll}
                  className="text-xs text-rose-600 hover:bg-rose-50 font-medium py-1 px-2.5 rounded-full transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  {deletingAll && <Loader2 className="w-3 h-3 animate-spin" />}
                  DELETE ALL
                </button>
              )}
              <span className="bg-indigo-100 text-indigo-700 py-0.5 px-2.5 rounded-full text-xs font-semibold">
                {files.length}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-center text-gray-400 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              <span className="text-xs">กำลังโหลดรายการไฟล์...</span>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 px-4 text-gray-400 flex-1 flex flex-col items-center justify-center">
              <div className="text-4xl mb-2">📂</div>
              <div className="text-sm font-medium text-gray-600 mb-1">ยังไม่มีไฟล์</div>
              <div className="text-xs text-gray-400">ลากไฟล์มาวางหรือคลิกเพื่ออัปโหลด</div>
            </div>
          ) : (
            <div className="space-y-2.5 overflow-y-auto max-h-[360px] pr-1">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="group flex items-center justify-between p-2.5 bg-gray-50 hover:bg-indigo-50/50 rounded-lg border border-gray-100 transition-all hover:border-indigo-200"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    {renderFileIcon(file.name)}
                    <div className="min-w-0 flex-1">
                      <a
                        href={file.url.startsWith('/') ? `/backend${file.url}` : file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-xs text-slate-800 hover:text-indigo-600 truncate block leading-tight"
                        title={file.name}
                      >
                        {file.name}
                      </a>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    disabled={deletingId === file.id}
                    className="text-gray-400 hover:text-rose-600 transition-colors p-1.5 rounded-full hover:bg-rose-50 ml-2 shrink-0 disabled:opacity-50"
                    title="ลบไฟล์"
                  >
                    {deletingId === file.id ? (
                      <Loader2 className="w-4 h-4 text-rose-500 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
