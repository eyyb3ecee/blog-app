import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import { register } from "./authSlice";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { status, error } = useSelector((state: RootState) => state.auth);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "succeeded" && !error) {
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  }, [status, error, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(register({ email, password }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {success ? (
          <div className="text-green-600 text-center font-semibold mb-4">
            Registration successful! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-gray-700">Email:</span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Password:</span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mt-1"
              />
            </label>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {status === "loading" ? "Registering..." : "Register"}
            </button>
          </form>
        )}
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        <div className="mt-6 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
