// frontend/src/pages/admin/AIUsers/AdminAIUsers.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Users, Search, Download, Sparkles, Mail, RefreshCw, AlertCircle } from "lucide-react";
import { aiLeadService } from "../../../services/aiLeadService";

const TOOL_COLORS = {
  "AI Chat Assistant": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Resume Builder": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Resume Analyzer": "bg-green-500/10 text-green-400 border-green-500/20",
  "Mock Interview": "bg-pink-500/10 text-pink-400 border-pink-500/20",
  "Career Guide AI": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

const AdminAIUsers = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [toolFilter, setToolFilter] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    try {
        const res = await aiLeadService.getAll();
      setLeads(res.data?.data || []);
    } catch (err) {
      // Silently ignore 404 since the backend route isn't built yet
      if (err.response?.status !== 404) {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadLeads = async () => {
      await fetchLeads();
    };
    loadLeads();
  }, []);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchesSearch =
        !search ||
        l.name?.toLowerCase().includes(search.toLowerCase()) ||
        l.email?.toLowerCase().includes(search.toLowerCase());
      const matchesTool = !toolFilter || l.tool === toolFilter;
      return matchesSearch && matchesTool;
    });
  }, [leads, search, toolFilter]);

  const uniqueEmails = useMemo(() => new Set(leads.map((l) => l.email)).size, [leads]);
  const tools = useMemo(() => [...new Set(leads.map((l) => l.tool).filter(Boolean))], [leads]);

  const handleExportCSV = () => {
    const rows = [
      ["Name", "Email", "Tool", "Date"],
      ...filtered.map((l) => [l.name, l.email, l.tool, l.createdAt ? new Date(l.createdAt).toLocaleString() : ""]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-tool-users.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="text-cyan-400" /> AI Tool Users
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Everyone who unlocked the AI tools with their name and email
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-white border border-gray-700 rounded-lg hover:border-gray-500 transition disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleExportCSV}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-bold px-4 py-2 rounded-lg transition text-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <Users className="w-6 h-6 text-cyan-400 mb-3" />
          <p className="text-gray-400 text-sm">Unique Users</p>
          <p className="text-2xl font-bold text-white mt-1">{uniqueEmails}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <Sparkles className="w-6 h-6 text-purple-400 mb-3" />
          <p className="text-gray-400 text-sm">Total Tool Uses</p>
          <p className="text-2xl font-bold text-white mt-1">{leads.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <Mail className="w-6 h-6 text-green-400 mb-3" />
          <p className="text-gray-400 text-sm">Tools In Use</p>
          <p className="text-2xl font-bold text-white mt-1">{tools.length}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <select
          value={toolFilter}
          onChange={(e) => setToolFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
        >
          <option value="">All tools</option>
          {tools.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/40 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Tool</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-600">No AI tool users yet</td></tr>
            ) : (
              filtered.map((l, i) => (
                <tr key={l._id || i} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 text-white font-medium">{l.name}</td>
                  <td className="px-6 py-4 text-gray-300">{l.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full border ${TOOL_COLORS[l.tool] || "bg-gray-800 text-gray-400 border-gray-700"}`}>
                      {l.tool || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {l.createdAt ? new Date(l.createdAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAIUsers;