import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, XCircle, Loader2, Camera, Users, ClipboardCheck } from 'lucide-react';

interface AttendanceResult {
  present: string[];
  absent: string[];
}

const AttendanceSystem: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AttendanceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/detect-attendance', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to connect to the server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Smart Attendance</h1>
          <p className="text-slate-500 mt-2 font-medium">Use AI to detect and mark attendance instantly.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 font-semibold text-slate-700">
            <Users size={18} className="text-primary-500" />
            <span>Classroom View</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2 space-y-6">
          <div 
            className={`relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer bg-white group hover:border-primary-400 hover:bg-primary-50/30 ${preview ? 'border-primary-200' : 'border-slate-200'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <div className="w-full space-y-4">
                <img src={preview} alt="Upload preview" className="w-full h-80 object-cover rounded-2xl shadow-lg" />
                <div className="flex justify-center">
                  <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full group-hover:bg-primary-100 group-hover:text-primary-600">Click to change image</span>
                </div>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                  <Upload size={36} />
                </div>
                <p className="text-xl font-bold text-slate-800">Upload Classroom Photo</p>
                <p className="text-slate-400 mt-2 font-medium text-center max-w-sm">Capture or select a group photo from your class to detect students.</p>
                <div className="mt-8 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold transition-all hover:bg-slate-800 shadow-lg shadow-slate-200">
                  Select File
                </div>
              </>
            )}
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          <div className="flex justify-center">
            <button 
              onClick={handleUpload}
              disabled={loading || !file}
              className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary-200/50 ${loading || !file ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-none' : 'bg-primary-600 text-white hover:bg-primary-700 hover:-translate-y-1 active:scale-95'}`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin text-white" size={24} />
                  <span>Analyzing Faces...</span>
                </>
              ) : (
                <>
                  <Camera size={24} />
                  <span>Detect Attendance</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 font-medium animate-in fade-in zoom-in duration-300">
              <XCircle size={20} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 h-full">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                <ClipboardCheck size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Report</h2>
            </div>
            
            {!result && !loading && (
              <div className="flex flex-col items-center justify-center h-96 text-center space-y-4 opacity-40">
                <Users size={64} className="text-slate-300" />
                <p className="text-slate-400 font-medium">No results to show.<br/>Upload an image to start.</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center h-96 space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-600">
                    <Camera size={20} />
                  </div>
                </div>
                <p className="text-slate-400 font-bold animate-pulse">Running AI Model</p>
              </div>
            )}

            {result && (
              <div className="space-y-8 animate-in slide-in-from-right duration-500">
                {/* Present Students */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Present
                    </h3>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-100">
                      {result.present.length} Students
                    </span>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {result.present.length > 0 ? (
                      result.present.map((name, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100/50 rounded-xl hover:bg-white hover:shadow-sm transition-all group">
                          <CheckCircle size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                          <span className="text-slate-700 font-semibold">{name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 italic text-sm p-4 bg-slate-50 rounded-xl border border-dashed text-center">No students detected.</p>
                    )}
                  </div>
                </div>

                {/* Absent Students */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 bg-slate-300 rounded-full"></span>
                      Absent
                    </h3>
                    <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-xs font-black uppercase tracking-wider border border-slate-100">
                      {result.absent.length} Students
                    </span>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {result.absent.length > 0 ? (
                      result.absent.map((name, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl text-slate-400">
                          <XCircle size={18} className="text-slate-300" />
                          <span className="font-medium italic line-through decoration-slate-200">{name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 italic text-sm p-4 bg-slate-50 rounded-xl border border-dashed text-center">Everyone is present!</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSystem;
