import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Users, UserCheck, UserX, Loader2, LogOut, ArrowRight, LayoutDashboard, UserPlus } from 'lucide-react';

interface AnalyticsData {
  total_students: number;
  present_today: number;
  absent_today: number;
}

const Dashboard = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
      setError("Failed to fetch dashboard data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4 font-sans">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-gray-400 font-bold">Initializing Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <LayoutDashboard className="text-blue-600" size={32} />
            Dashboard
          </h1>
          <p className="text-slate-500 font-medium mt-2">Welcome back! Here's a quick overview of today's status.</p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 bg-white text-red-500 border border-red-100 rounded-2xl font-black text-sm hover:bg-red-50 transition-all shadow-sm"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {error && (
        <div className="p-6 bg-red-50 border border-red-100 rounded-3xl text-red-600 font-bold text-center">
          {error}
        </div>
      )}

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:border-blue-200 transition-all">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <Users size={28} />
          </div>
          <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Total Students</p>
          <h2 className="text-5xl font-black text-slate-900 mt-2">{data?.total_students}</h2>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:border-emerald-200 transition-all">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
            <UserCheck size={28} />
          </div>
          <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Present Today</p>
          <h2 className="text-5xl font-black text-emerald-600 mt-2">{data?.present_today}</h2>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:border-amber-200 transition-all">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
            <UserX size={28} />
          </div>
          <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Absent Today</p>
          <h2 className="text-5xl font-black text-amber-600 mt-2">{data?.absent_today}</h2>
        </div>
      </div>

      {/* Primary Action */}
      <div className="bg-blue-600 p-10 rounded-[2.5rem] text-white flex flex-col items-center justify-between gap-8 shadow-2xl shadow-blue-200">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tight">Manage Your Database</h2>
          <p className="text-blue-100 font-medium text-lg">Extend your roster or verify presence with our AI tools.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link 
            to="/take-attendance"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-5 bg-white text-blue-600 rounded-[1.5rem] font-black text-lg hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-800/20 group"
          >
            Mark Attendance
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/add-student"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-5 bg-blue-500 text-white rounded-[1.5rem] font-black text-lg hover:bg-blue-400 border-2 border-blue-400 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-800/20 group"
          >
            <UserPlus size={20} />
            Add Student
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
