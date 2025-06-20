import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch as useReduxDispatch } from "react-redux";

// Action to clear error in authSlice
const clearAuthError = () => ({ type: "auth/clearError" });

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const reduxDispatch = useReduxDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { status, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "succeeded" && !error) {
      navigate("/account");
    }
  }, [status, error, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reduxDispatch(clearAuthError());
    dispatch(login({ email, password }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-700 tracking-tight">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="text-gray-700 font-medium">Email:</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                reduxDispatch(clearAuthError());
              }}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2 bg-gray-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 font-medium">Password:</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                reduxDispatch(clearAuthError());
              }}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2 bg-gray-50"
            />
          </label>
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 shadow"
          >
            {status === "loading" ? "Logging in..." : "Login"}
          </button>
        </form>
        {error && (
          <p className="mt-6 text-center text-red-500 font-medium">{error}</p>
        )}
        <div className="mt-8 text-center">
          <span className="text-gray-600">New to Blog App? </span>
          <a
            href="/register"
            className="text-blue-600 hover:underline font-semibold"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
