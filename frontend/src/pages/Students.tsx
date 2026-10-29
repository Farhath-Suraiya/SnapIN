import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Mail, MoreHorizontal, Loader2, AlertCircle, UserSearch, User } from 'lucide-react';

interface Student {
  name: string;
  roll_number: string;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/students');
      // Backend returns { "students": [...] }
      setStudents(response.data.students || []);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch student list. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Active Students</h1>
          <p className="text-gray-500 font-medium">Browse and manage records of all students in the database.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search name or roll number..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 ring-blue-50 transition-all shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-400 font-bold">Fetching student database...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-red-50 border border-red-100 rounded-3xl flex flex-col items-center text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <p className="text-red-700 font-bold text-lg">{error}</p>
          <button 
            onClick={fetchStudents}
            className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student, index) => (
              <div key={index} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:border-blue-200 hover:-translate-y-1 transition-all group">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-lg border-2 border-white shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {student.name.charAt(0)}
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <Mail size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-extrabold text-gray-800 tracking-tight">{student.name}</h3>
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <User size={14} />
                    <span className="text-xs font-black uppercase tracking-widest italic">{student.roll_number}</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 w-fit px-2 py-0.5 rounded border border-emerald-100">Registered Student</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 space-y-4">
              <UserSearch size={64} className="opacity-20" />
              <p className="font-bold">No students found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Students;
