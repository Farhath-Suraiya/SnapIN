import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-white font-sans p-6">
      
      {/* Center Content */}
      <div className="flex flex-col items-center justify-center flex-grow text-center space-y-6">

        {/* App Name */}
        <h1 className="text-7xl md:text-8xl font-black tracking-tight text-slate-900">
          Snap<span className="text-blue-600">IN</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg text-slate-500 font-medium">
          Mark attendance instantly
        </p>

      </div>

      {/* Bottom Button */}
      <div className="w-full flex justify-center pb-6">
        <Link
          to="/login"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold transition-all hover:bg-blue-700 hover:-translate-y-0.5"
        >
          Next →
        </Link>
      </div>

    </div>
  );
};

export default Landing;