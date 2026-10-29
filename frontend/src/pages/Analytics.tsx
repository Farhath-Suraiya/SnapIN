import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserPlus, UserMinus, Loader2, AlertCircle, BarChart3, Calendar } from 'lucide-react';

interface AnalyticsData {
  total_students: number;
  present_today: number;
  absent_today: number;
}

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/analytics');
      setData(response.data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch analytics. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-gray-400 font-bold">Calculating attendance metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-3xl flex flex-col items-center text-center space-y-3">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-700 font-bold text-lg">{error}</p>
        <button 
          onClick={fetchAnalytics}
          className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Attendance Analytics</h1>
          <p className="text-gray-500 font-medium mt-2">Overall class statistics and performance metrics.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm font-black text-gray-400 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
          <Calendar size={16} />
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Total Students Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-2xl shadow-gray-200/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 translate-x-1/2 -translate-y-1/2 bg-blue-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-200/50">
              <Users size={28} />
            </div>
            <p className="text-gray-400 font-black text-xs uppercase tracking-[0.2em]">Registered Students</p>
            <h2 className="text-5xl font-black text-gray-900 mt-3">{data?.total_students}</h2>
            <div className="mt-8 flex items-center gap-2 text-blue-600 font-bold text-sm">
              <BarChart3 size={16} />
              <span>Full Database</span>
            </div>
          </div>
        </div>

        {/* Present Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-2xl shadow-gray-200/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 translate-x-1/2 -translate-y-1/2 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-emerald-200/50">
              <UserPlus size={28} />
            </div>
            <p className="text-gray-400 font-black text-xs uppercase tracking-[0.2em]">Present Today</p>
            <h2 className="text-5xl font-black text-emerald-600 mt-3">{data?.present_today}</h2>
            <div className="mt-8 flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>Active Attendance</span>
            </div>
          </div>
        </div>

        {/* Absent Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-2xl shadow-gray-200/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 translate-x-1/2 -translate-y-1/2 bg-amber-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-amber-200/50">
              <UserMinus size={28} />
            </div>
            <p className="text-gray-400 font-black text-xs uppercase tracking-[0.2em]">Absent Today</p>
            <h2 className="text-5xl font-black text-amber-600 mt-3">{data?.absent_today}</h2>
            <div className="mt-8 flex items-center gap-2 text-amber-600 font-bold text-sm">
              <AlertCircle size={16} />
              <span>Pending Check-in</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-12 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h3 className="text-3xl font-black tracking-tight mb-4">Class Performance</h3>
            <p className="text-slate-400 font-medium leading-relaxed">
              Your class is currently at <span className="text-white font-bold">{Math.round((data?.present_today || 0) / (data?.total_students || 1) * 100)}%</span> attendance rate for today. 
              Keep monitoring to ensure everyone is accounted for.
            </p>
          </div>
          <div className="flex items-center gap-12">
            <div className="text-center">
              <p className="text-4xl font-black mb-1">{Math.round((data?.present_today || 0) / (data?.total_students || 1) * 100)}%</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Efficiency</p>
            </div>
            <div className="w-px h-16 bg-slate-800 hidden md:block"></div>
            <div className="text-center">
              <p className="text-4xl font-black mb-1 text-emerald-400 text shadow-emerald-400/20 shadow-sm">{data?.present_today}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Successful</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
