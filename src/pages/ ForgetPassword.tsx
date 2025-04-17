import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const ForgetPassword: React.FC = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const passwordChecks = {
    length: password.length >= 8,
    capital: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const allValid =
    passwordChecks.length &&
    passwordChecks.capital &&
    passwordChecks.number &&
    passwordChecks.special;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!userId || !name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!allValid) {
      setError("Password does not meet all requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await api.put(`/api/auth/${userId}`, {
        name,
        email,
        password,
      });
      setSuccess("Password updated successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const getCheckClass = (valid: boolean) =>
    valid ? "text-green-600" : "text-gray-400";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-100 to-green-50 px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200"
      >
        <h2 className="text-2xl font-semibold mb-5 text-center text-gray-900">
          Forgot Password
        </h2>

        {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-3 text-center">{success}</p>}

        <label className="block text-sm mb-1 text-gray-700">User ID</label>
        <input
          type="text"
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <label className="block text-sm mb-1 text-gray-700">Name</label>
        <input
          type="text"
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block text-sm mb-1 text-gray-700">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block text-sm mb-1 text-gray-700">New Password</label>
        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500 text-sm"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <ul className="text-sm mb-3 space-y-1">
          <li className={getCheckClass(passwordChecks.length)}>
            • At least 8 characters
          </li>
          <li className={getCheckClass(passwordChecks.capital)}>
            • One uppercase letter
          </li>
          <li className={getCheckClass(passwordChecks.number)}>
            • One number
          </li>
          <li className={getCheckClass(passwordChecks.special)}>
            • One special character
          </li>
        </ul>

        <label className="block text-sm mb-1 text-gray-700">Confirm Password</label>
        <div className="relative mb-6">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500 text-sm"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading || !allValid}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ForgetPassword;