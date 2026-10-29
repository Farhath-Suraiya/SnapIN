import AttendanceSystem from '../components/AttendanceSystem';

const TakeAttendance = () => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 font-sans">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">AI Face Recognition</h1>
        <p className="text-gray-500 font-medium tracking-tight">Upload a class photo to automatically mark attendance.</p>
      </div>
      <AttendanceSystem />
    </div>
  );
};

export default TakeAttendance;
