import React, { useState, useEffect } from "react";
import { Brain, Zap, MessageSquare, BarChart2, Users } from "lucide-react";
import { aiService } from "../../../services/aiService";

const AdminAI = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    aiService.getStats()
      .then((res) => setStats(res.data.data))
      .catch((e) => setError(e.response?.data?.message || "Failed to load AI stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500 pt-20">Loading AI stats...</div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;

  const { total, users = [], interviews = {} } = stats || {};

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Brain className="text-pink-400" /> AI Usage Dashboard
      </h1>
      <p className="text-gray-500 text-sm mb-8">Monitor AI API consumption and interview sessions</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <Zap className="w-6 h-6 text-yellow-400 mb-3" />
          <p className="text-gray-400 text-sm">Total Tokens Used</p>
          <p className="text-2xl font-bold text-white mt-1">{total?.tokens?.toLocaleString() ?? 0}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <MessageSquare className="w-6 h-6 text-cyan-400 mb-3" />
          <p className="text-gray-400 text-sm">Total AI Requests</p>
          <p className="text-2xl font-bold text-white mt-1">{total?.requests?.toLocaleString() ?? 0}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <BarChart2 className="w-6 h-6 text-purple-400 mb-3" />
          <p className="text-gray-400 text-sm">Mock Interviews</p>
          <p className="text-2xl font-bold text-white mt-1">{interviews.total ?? 0}</p>
          <p className="text-gray-600 text-xs mt-1">{interviews.completed ?? 0} completed</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <Users className="w-6 h-6 text-green-400 mb-3" />
          <p className="text-gray-400 text-sm">Active Users</p>
          <p className="text-2xl font-bold text-white mt-1">{users.filter((u) => u.aiUsage?.totalRequests > 0).length}</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="font-bold text-white">Per-User Token Usage</h2>
        </div>
        {users.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No user AI usage yet</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-black/40 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Total Tokens</th>
                <th className="px-6 py-3">Requests</th>
                <th className="px-6 py-3">Monthly Tokens</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{u.name}</p>
                    <p className="text-gray-500 text-xs">{u.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-mono">{(u.aiUsage?.totalTokens || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-300 font-mono">{u.aiUsage?.totalRequests || 0}</td>
                  <td className="px-6 py-4 text-gray-300 font-mono">{(u.aiUsage?.monthlyTokens || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminAI;