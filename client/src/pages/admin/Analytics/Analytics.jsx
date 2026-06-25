// ─────────────────────────────────────────────────────────────────────────────
// AdminAnalytics.jsx  — Same zero-safe approach, no fake data
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { Eye, Globe, BarChart3, TrendingUp, Users, Activity, Clock, MousePointerClick, ArrowUpRight } from "lucide-react";
import { analyticsService } from "../../../services/analyticsService";
import { Link } from "react-router-dom";

const T = {
  card: "bg-[#12121a] border border-[#1e1e2e] hover:border-[#2a2a3e]",
  text: "text-white", muted: "text-[#6b6b80]", sub: "text-[#9090a8]",
};

const EmptyState = ({ icon: Icon, title, desc }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="p-4 rounded-2xl bg-[#1a1a2a] mb-4"><Icon className="w-8 h-8 text-[#3a3a50]" /></div>
    <p className={`${T.sub} text-sm font-medium`}>{title}</p>
    <p className={`${T.muted} text-xs mt-1 max-w-xs`}>{desc}</p>
  </div>
);

const SOURCE_COLORS = ["from-cyan-500 to-cyan-400", "from-purple-500 to-purple-400", "from-emerald-500 to-emerald-400", "from-pink-500 to-pink-400", "from-yellow-500 to-yellow-400", "from-orange-500 to-orange-400"];
const DOT_COLORS = ["bg-cyan-400", "bg-purple-400", "bg-emerald-400", "bg-pink-400", "bg-yellow-400", "bg-orange-400"];
const EVENT_ICONS = { visit: <MousePointerClick className="w-3.5 h-3.5" />, contact: <ArrowUpRight className="w-3.5 h-3.5" />, page_view: <Eye className="w-3.5 h-3.5" />, blog_view: <Eye className="w-3.5 h-3.5" /> };

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [pageViews, setPageViews] = useState([]);
  const [dailyVisits, setDailyVisits] = useState([]);
  const [trafficSources, setTrafficSources] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [dashRes, trafficRes, actRes] = await Promise.all([
          analyticsService.getDashboard(),
          analyticsService.getTrafficSources(),
          analyticsService.getActivity(),
        ]);
        const d = dashRes?.data?.data || dashRes?.data || {};
        setStats(d.stats || {});
        setPageViews(d.pageViews || []);
        setDailyVisits(d.dailyVisits || []);
        setTrafficSources(trafficRes?.data || []);
        setActivity(actRes?.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const maxVisits = Math.max(...dailyVisits.map((d) => d.count), 1);
  const totalPV = pageViews.reduce((a, p) => a + (p.views || 0), 0);
  const totalTraffic = trafficSources.reduce((a, t) => a + (t.count || 0), 0);
  const peakDay = dailyVisits.reduce((max, d) => (d.count > (max?.count || 0) ? d : max), null);
  const hasData = dailyVisits.length > 0 || pageViews.length > 0 || trafficSources.length > 0 || activity.length > 0;

  if (loading) return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center"><span className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="px-8 pt-8 pb-2">
        <h1 className={`${T.text} text-3xl font-bold tracking-tight`}>Analytics</h1>
        <p className={`${T.muted} text-sm mt-1`}>Real-time data from your portfolio</p>
      </div>

      <div className="px-8 pb-8">
        {error && (
          <div className="mt-6 mb-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-sm">
            <strong>Connection failed:</strong> {error}
          </div>
        )}

        {!hasData && !error ? (
          <div className="mt-8 bg-[#12121a] border border-dashed border-[#2a2a3e] rounded-2xl p-10">
            <EmptyState
              icon={Activity}
              title="No analytics data yet"
              desc="Visit your portfolio site as a regular user to generate page view events. Make sure PageViewTracker is in App.jsx and the backend is running."
            />
            <div className="flex items-center justify-center gap-3 mt-6">
              <a href="/" target="_blank" rel="noopener" className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-xl text-sm hover:bg-cyan-500/20 transition inline-flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4" /> Open Portfolio
              </a>
              <Link to="/admin" className="px-4 py-2 bg-[#1a1a2a] text-[#9090a8] rounded-xl text-sm hover:bg-[#22222e] transition">
                Back to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6 mb-8">
              {[
                { icon: <Eye className="w-5 h-5 text-cyan-400" />, label: "Total Visitors", value: stats?.recentVisits?.toLocaleString() || 0, color: "bg-cyan-500/10" },
                { icon: <Globe className="w-5 h-5 text-purple-400" />, label: "Page Views", value: totalPV.toLocaleString(), color: "bg-purple-500/10" },
                { icon: <BarChart3 className="w-5 h-5 text-emerald-400" />, label: "Active Pages", value: pageViews.length, color: "bg-emerald-500/10" },
                { icon: <Users className="w-5 h-5 text-yellow-400" />, label: "Peak Day", value: peakDay ? peakDay.count : 0, color: "bg-yellow-500/10" },
              ].map((m, i) => (
                <div key={i} className={`${T.card} rounded-2xl p-6 transition-colors`}>
                  <div className={`p-2 rounded-xl ${m.color} inline-block mb-3`}>{m.icon}</div>
                  <p className={`${T.muted} text-sm`}>{m.label}</p>
                  <p className={`${T.text} text-3xl font-bold mt-1 tracking-tight`}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* Chart + Traffic */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`${T.text} text-lg font-bold flex items-center gap-2`}><TrendingUp className="w-5 h-5 text-cyan-400" /> Daily Visitors</h3>
                  <span className={`${T.muted} text-xs`}>{dailyVisits.length} days</span>
                </div>
                <p className={`${T.muted} text-xs mb-6`}>Peak: {peakDay?._id} ({peakDay?.count})</p>
                {dailyVisits.length > 0 ? (
                  <div className="flex items-end gap-[3px] h-52">
                    {dailyVisits.map((d, i) => (
                      <div key={i} className="flex-1 group relative" title={`${d._id}: ${d.count}`}>
                        <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#1a1a2a] text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-[#2a2a3e]">
                          {d._id.slice(5)}<br /><span className="font-bold">{d.count}</span>
                        </div>
                        <div
                          className={`w-full rounded-t-sm transition-all duration-200 ${d === peakDay ? "bg-gradient-to-t from-pink-500 to-pink-400" : "bg-gradient-to-t from-cyan-500 to-cyan-400 opacity-60 group-hover:opacity-90"}`}
                          style={{ height: `${Math.max((d.count / maxVisits) * 100, 2)}%`, minHeight: 2 }}
                        />
                      </div>
                    ))}
                  </div>
                ) : <EmptyState icon={TrendingUp} title="No daily data" desc="Visits will chart here after tracking starts" />}
              </div>

              <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6">
                <h3 className={`${T.text} text-lg font-bold mb-6 flex items-center gap-2`}><Activity className="w-5 h-5 text-emerald-400" /> Traffic Sources</h3>
                {trafficSources.length > 0 ? (
                  <div className="space-y-4">
                    {trafficSources.map((src, i) => {
                      const share = totalTraffic > 0 ? ((src.count / totalTraffic) * 100).toFixed(1) : 0;
                      return (
                        <div key={src.source}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <div className={`w-2.5 h-2.5 rounded-full ${DOT_COLORS[i % DOT_COLORS.length]}`} />
                              <span className={`${T.sub} text-sm`}>{src.source}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`${T.text} text-sm font-semibold`}>{src.count}</span>
                              <span className={`${T.muted} text-xs w-10 text-right`}>{share}%</span>
                            </div>
                          </div>
                          <div className="h-1.5 bg-[#1e1e2e] rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${SOURCE_COLORS[i % SOURCE_COLORS.length]} rounded-full`} style={{ width: `${share}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : <EmptyState icon={Activity} title="No source data" desc="Referrer data appears after visits from external links" />}
              </div>
            </div>

            {/* Pages + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`${T.text} text-lg font-bold flex items-center gap-2`}><BarChart3 className="w-5 h-5 text-purple-400" /> All Active Pages</h3>
                  <span className={`${T.muted} text-xs`}>{pageViews.length} routes</span>
                </div>
                {pageViews.length > 0 ? (
                  <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-2" style={{ scrollbarWidth: "thin", scrollbarColor: "#2a2a3e transparent" }}>
                    {pageViews.map((p, i) => {
                      const share = totalPV > 0 ? (p.views / totalPV) * 100 : 0;
                      return (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#16161f] transition-colors group">
                          <span className={`${T.muted} text-xs w-5 text-right shrink-0`}>{i + 1}</span>
                          <span className={`${T.sub} text-sm font-mono truncate`}>{p._id || "/"}</span>
                          <div className="flex-1 h-1 bg-[#1e1e2e] rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${T.accent?.purple?.bar || "from-purple-500 to-purple-400"} rounded-full`} style={{ width: `${share}%` }} />
                          </div>
                          <span className={`${T.text} text-sm font-semibold w-12 text-right shrink-0`}>{p.views}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : <EmptyState icon={BarChart3} title="No pages tracked" desc="Pages appear after visitors browse your site" />}
              </div>

              <div className="lg:col-span-2 bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-6">
                <h3 className={`${T.text} text-lg font-bold mb-6 flex items-center gap-2`}><Clock className="w-5 h-5 text-yellow-400" /> Recent Activity</h3>
                {activity.length > 0 ? (
                  <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2" style={{ scrollbarWidth: "thin", scrollbarColor: "#2a2a3e transparent" }}>
                    {activity.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#16161f] transition-colors">
                        <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5 shrink-0">
                          {EVENT_ICONS[item.type] || EVENT_ICONS.page_view}
                        </div>
                        <div className="min-w-0">
                          <p className={`${T.sub} text-sm truncate`}>
                            <span className="font-medium">{item.type.replace("_", " ")}</span>
                            <span className={`${T.muted} ml-1 font-mono text-xs`}>{item.page}</span>
                          </p>
                          <p className={`${T.muted} text-xs mt-0.5 flex items-center gap-1`}><Clock className="w-3 h-3" />{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <EmptyState icon={Clock} title="No activity yet" desc="Recent events will stream here in real-time" />}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;