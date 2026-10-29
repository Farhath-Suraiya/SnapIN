import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Search, Loader2, AlertCircle, UserCheck, UserX, FileText } from 'lucide-react';

interface Record {
  name: string;
  roll_number: string;
  status: string;
  date: string;
}

const AttendanceRecords = () => {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRecords();
  }, [date]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/attendance?date=${date}`);
      setRecords(response.data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch historical records. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.roll_number.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: records.length,
    present: records.filter(r => r.status === "Present").length,
    absent: records.filter(r => r.status === "Absent").length,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      {/* Header & Date Picker */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Attendance Records</h1>
          <p className="text-slate-500 font-medium mt-2">Historical log of all marked attendance sessions.</p>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Select Date</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 ring-blue-50 transition-all font-bold text-slate-700 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Total Records</p>
              <h3 className="text-2xl font-black text-slate-900">{stats.total}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <UserCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Present</p>
              <h3 className="text-2xl font-black text-emerald-600">{stats.present}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
              <UserX size={24} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Absent</p>
              <h3 className="text-2xl font-black text-amber-600">{stats.absent}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Daily Log</h2>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter by name or roll..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 ring-blue-500/10 transition-all font-medium text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4 text-slate-400">
              <Loader2 className="animate-spin" size={32} />
              <p className="font-bold">Syncing with server...</p>
            </div>
          ) : error ? (
            <div className="py-20 flex flex-col items-center gap-4 text-red-500">
              <AlertCircle size={32} />
              <p className="font-bold">{error}</p>
            </div>
          ) : filteredRecords.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Name</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Roll Number</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRecords.map((record, index) => (
                  <tr key={index} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                          {record.name[0]}
                        </div>
                        <span className="font-bold text-slate-700">{record.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-mono text-sm text-slate-500 font-bold">#{record.roll_number}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        record.status === "Present" 
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-medium text-slate-400 text-sm italic">{record.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 text-center text-slate-400 font-bold">
              No records found for this date.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceRecords;
