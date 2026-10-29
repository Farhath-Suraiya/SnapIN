import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Analytics from './pages/Analytics';
import AttendanceRecords from './pages/AttendanceRecords';
import TakeAttendance from './pages/TakeAttendance';
import AddStudent from './pages/AddStudent';

// Helper component to conditionally show Navbar
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/login', '/signup'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-700">
      {!shouldHideNavbar && <Navbar />}
      <main className={!shouldHideNavbar ? "py-12 px-6" : ""}>
        <div className={!shouldHideNavbar ? "max-w-7xl mx-auto" : ""}>
          {children}
        </div>
      </main>
      {!shouldHideNavbar && (
        <footer className="mt-20 border-t border-gray-200 py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 font-bold text-sm">© 2026 Smart SnapIN Attendance System. All rights reserved.</p>
            <div className="flex gap-6 text-gray-400 font-bold text-sm">
              <a href="#" className="hover:text-gray-600 transition-colors cursor-pointer">Privacy Policy</a>
              <a href="#" className="hover:text-gray-600 transition-colors cursor-pointer">Terms of Service</a>
              <a href="#" className="hover:text-gray-600 transition-colors cursor-pointer">Support</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/take-attendance" 
            element={
              <ProtectedRoute>
                <TakeAttendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-student" 
            element={
              <ProtectedRoute>
                <AddStudent />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/attendance-records" 
            element={
              <ProtectedRoute>
                <AttendanceRecords />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/students" 
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
