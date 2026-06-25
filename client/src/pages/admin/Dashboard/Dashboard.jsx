// ─────────────────────────────────────────────────────────────────────────────
// Dashboard.jsx  — Proper zero-state handling, no fake data
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from "react";
import {
  FolderOpen, BookOpen, Mail, Brain, Eye, MessageCircle,
  ArrowUpRight, Activity, Zap, MousePointerClick,
} from "lucide-react";
import { analyticsService } from "../../../services/analyticsService";
import { Link } from "react-router-dom";

const T = {
  card: "bg-[#12121a] border border-[#1e1e2e] hover:border-[#2a2a3e]",
  text: "text-white",
  muted: "text-[#6b6b80]",
  sub: "text-[#9090a8]",
};

const StatCard = ({ title, value, icon, color, to }) => (
  <Link to={to || "#"} className={`block ${T.card} rounded-2xl p-6 transition-all group relative overflow-hidden`}>
    <div className={`absolute -top-10 -right-10 w-20 h-20 ${color} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
    <div className="relative">
      <div className={`p-2.5 rounded-xl ${color} group-hover:scale-110 transition-transform mb-4`}>{icon}</div>
      <p className={`${T.muted} text-sm`}>{title}</p>
      <p className={`${T.text} text-3xl font-bold mt-1 tracking-tight`}>{value ?? "—"}</p>
    </div>
  </Link>
);

const EmptyState = ({ icon: Icon, title, desc }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="p-4 rounded-2xl bg-[#1a1a2a] mb-4">
      <Icon className="w-8 h-8 text-[#3a3a50]" />
    </div>
    <p className={`${T.sub} text-sm font-medium`}>{title}</p>
    <p className={`${T.muted} text-xs mt-1 max-w-xs`}>{desc}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0, totalBlogs: 0, totalContacts: 0,
    totalInterviews: 0, recentVisits: 0, unreadContacts: 0,
  });
  const [pageViews, setPageViews] = useState([]);
  const [dailyVisits, setDailyVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await analyticsService.getDashboard();
        const d = res?.data?.data || res?.data || {};
        setStats(d.stats || {});
        setPageViews(d.pageViews || []);
        setDailyVisits(d.dailyVisits || []);
      } catch (err) {
        console.error("Dashboard fetch:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const maxVisits = Math.max(...dailyVisits.map((d) => d.count), 1);
  const totalPV = pageViews.reduce((s, p) => s + (p.views || 0), 0);
  const hasAnalytics = dailyVisits.length > 0 || pageViews.length > 0;
  const hasAnyData = stats.totalProjects > 0 || stats.totalBlogs > 0 || stats.totalContacts > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="px-8 pt-8 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-1.5 rounded-lg bg-cyan-500/10">
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <h1 className={`${T.text} text-3xl font-bold tracking-tight`}>Dashboard</h1>
        </div>
        <p className={`${T.muted} text-sm ml-10`}>Live data from your portfolio backend</p>
      </div>

      <div className="px-8 pb-8">
        {/* ── Error Banner ────────────────────────────────────────────── */}
        {error && (
          <div className="mt-6 mb-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-sm">
            <strong>Connection failed:</strong> {error}. Make sure your backend is running on port 5000.
          </div>
        )}

        {/* ── Stat Cards ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6 mb-8">
          <StatCard
            title="Total Projects" value={stats.totalProjects}
            icon={<FolderOpen className="w-5 h-5 text-cyan-400" />}
            color="bg-cyan-500/10" to="/admin/projects"
          />
          <StatCard
            title="Published Blogs" value={stats.totalBlogs}
            icon={<BookOpen className="w-5 h-5 text-purple-400" />}
            color="bg-purple-500/10" to="/admin/blogs"
          />
          <StatCard
            title="Messages" value={stats.totalContacts}
            icon={<Mail className="w-5 h-5 text-emerald-400" />}
            color="bg-emerald-500/10" to="/admin/messages"
          />
          <StatCard
            title="AI Interviews" value={stats.totalInterviews}
            icon={<Brain className="w-5 h-5 text-pink-400" />}
            color="bg-pink-500/10" to="/admin/ai"
          />
        </div>

        {/* ── Unread Banner ──────────────────────────────────────────── */}
        {stats.unreadContacts > 0 && (
          <Link to="/admin/messages" className="flex items-center gap-3 bg-yellow-500/5 border border-yellow-500/20 text-yellow-400 px-5 py-4 rounded-2xl hover:bg-yellow-500/10 transition-all mb-6 group">
            <MessageCircle className="w-5 h-5 shrink-0" />
            <span className="font-medium text-sm">
              You have <strong className="text-yellow-300">{stats.unreadContacts}</strong> unread message{stats.unreadContacts > 1 ? "s" : ""}. Click to view.
            </span>
            <ArrowUpRight className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
          </Link>
        )}

        {/* ── Charts Row ─────────────────────────────────────────────── */}
        {hasAnalytics ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Visitor Chart */}
            <div className="lg:col-span-2 bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className={`${T.text} text-lg font-bold flex items-center gap-2`}>
                  <Activity className="w-5 h-5 text-cyan-400" /> Visitors
                </h2>
                <span className={`${T.muted} text-xs`}>Last 30 days</span>
              </div>
              <p className={`${T.text} text-4xl font-bold tracking-tight mb-6`}>
                {stats.recentVisits.toLocaleString()}
              </p>
              <div className="flex items-end gap-[3px] h-36">
                {dailyVisits.map((d, i) => (
                  <div key={i} className="flex-1 group relative" title={`${d._id}: ${d.count}`}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a1a2a] text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-[#2a2a3e]">
                      {d.count}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-sm opacity-60 group-hover:opacity-100 transition-all"
                      style={{ height: `${Math.max((d.count / maxVisits) * 100, 3)}%`, minHeight: 2 }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-5">
              <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6">
                <p className={`${T.muted} text-sm mb-2`}>Page Views</p>
                <p className={`${T.text} text-3xl font-bold`}>{totalPV.toLocaleString()}</p>
              </div>
              <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6">
                <p className={`${T.muted} text-sm mb-2`}>Active Pages</p>
                <p className={`${T.text} text-3xl font-bold`}>{pageViews.length}</p>
              </div>
              <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6">
                <p className={`${T.muted} text-sm mb-2`}>Days Tracked</p>
                <p className={`${T.text} text-3xl font-bold`}>{dailyVisits.length}</p>
              </div>
            </div>
          </div>
        ) : (
          /* ── NO ANALYTICS YET ──────────────────────────────────────── */
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6 mb-6">
            <EmptyState
              icon={MousePointerClick}
              title="No visitor data yet"
              desc="Analytics appear here once visitors browse your portfolio. Make sure PageViewTracker is in your App.jsx and your backend is running."
            />
          </div>
        )}

        {/* ── Active Pages ───────────────────────────────────────────── */}
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`${T.text} text-lg font-bold flex items-center gap-2`}>
              <Eye className="w-5 h-5 text-purple-400" /> Active Pages
            </h2>
            {pageViews.length > 0 && (
              <span className={`${T.muted} text-xs`}>{pageViews.length} pages with views</span>
            )}
          </div>

          {pageViews.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1e1e2e]">
                    <th className="text-left text-[#6b6b80] text-xs font-medium uppercase tracking-wider pb-3 pr-4">#</th>
                    <th className="text-left text-[#6b6b80] text-xs font-medium uppercase tracking-wider pb-3 pr-4">Page</th>
                    <th className="text-left text-[#6b6b80] text-xs font-medium uppercase tracking-wider pb-3 pr-4">Views</th>
                    <th className="text-left text-[#6b6b80] text-xs font-medium uppercase tracking-wider pb-3">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e2e]">
                  {pageViews.map((p, i) => {
                    const share = totalPV > 0 ? ((p.views / totalPV) * 100).toFixed(1) : 0;
                    return (
                      <tr key={i} className="group hover:bg-[#16161f] transition-colors">
                        <td className="py-3 pr-4"><span className={`${T.muted} text-sm`}>{i + 1}</span></td>
                        <td className="py-3 pr-4"><span className={`${T.sub} text-sm font-mono`}>{p._id || "/"}</span></td>
                        <td className="py-3 pr-4"><span className={`${T.text} text-sm font-semibold`}>{p.views.toLocaleString()}</span></td>
                        <td className="py-3 w-48">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-[#1e1e2e] rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" style={{ width: `${share}%` }} />
                            </div>
                            <span className={`${T.muted} text-xs w-10 text-right`}>{share}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={Eye}
              title="No pages tracked yet"
              desc="Pages will appear here after visitors browse your site. Each unique route gets tracked automatically."
            />
          )}
        </div>

        {/* ── Fully empty state ──────────────────────────────────────── */}
        {!hasAnyData && !hasAnalytics && !error && (
          <div className="mt-8 bg-[#12121a] border border-dashed border-[#2a2a3e] rounded-2xl p-10 text-center">
            <div className="p-4 rounded-2xl bg-[#1a1a2a] inline-block mb-4">
              <Zap className="w-10 h-10 text-[#3a3a50]" />
            </div>
            <h3 className={`${T.sub} text-lg font-bold mb-2`}>Dashboard is empty</h3>
            <p className={`${T.muted} text-sm max-w-md mx-auto mb-6`}>
              No projects, blogs, messages, or analytics data found.
              Add content through the admin panel and visit your portfolio to generate analytics.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/admin/projects/new" className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-xl text-sm hover:bg-cyan-500/20 transition">
                Add Project
              </Link>
              <Link to="/admin/blogs/new" className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-xl text-sm hover:bg-purple-500/20 transition">
                Add Blog
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;