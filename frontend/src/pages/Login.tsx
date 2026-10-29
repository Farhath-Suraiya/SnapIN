import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LogIn, ArrowLeft, Loader2 } from "lucide-react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/login", {
        email,
        password,
      });

      // Save token to localStorage
      localStorage.setItem("token", response.data.token);
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "An error occurred during login. Please try again.");
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
            <LogIn size={28} className="text-blue-600" />
          </div>

          <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">Login</h2>

          <form onSubmit={handleLogin} className="space-y-4">
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
                "Login"
              )}
            </button>
          </form>

          {error && (
            <p className="text-red-500 text-sm text-center mt-4 font-medium animate-in fade-in duration-300">
              {error}
            </p>
          )}

          <p className="text-sm text-center mt-6 text-slate-500 font-medium">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;