import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserPlus, ArrowLeft, Loader2 } from "lucide-react";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://127.0.0.1:8000/signup", {
        name,
        email,
        password,
      });

      // Show success message or just redirect to login
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 font-sans">
      <div className="w-full max-w-md space-y-6">

        <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-semibold">
          <ArrowLeft size={16} /> Back
        </Link>

        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50">
          <div className="flex justify-center mb-4">
            <UserPlus size={28} className="text-blue-600" />
          </div>

          <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">Sign Up</h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-all font-medium"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-all font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-all font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Loading...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {error && (
            <p className="text-red-500 text-sm text-center mt-4 font-medium animate-in fade-in duration-300">
              {error}
            </p>
          )}

          <p className="text-sm text-center mt-6 text-slate-500 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;