// src/layouts/AdminLayout.jsx
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  LayoutDashboard, FolderOpen, Award, BookOpen, Mail, Briefcase,
  Brain, Users, BarChart2, Settings, LogOut, Menu, X, Bot,
  ChevronDown, Shield, Bell, ExternalLink, Sparkles
} from "lucide-react";

const NAV_GROUPS = [
  { items: [{ label: "Dashboard", to: "/admin", icon: LayoutDashboard, exact: true }] },
  {
    label: "Content",
    items: [
      { label: "Projects", to: "/admin/projects", icon: FolderOpen },
      { label: "Skills", to: "/admin/skills", icon: Award },
      { label: "Blogs", to: "/admin/blogs", icon: BookOpen },
      { label: "Certificates", to: "/admin/certificates", icon: Award },
      { label: "Experience", to: "/admin/experience", icon: Briefcase },
    ],
  },
  { label: "Communication", items: [{ label: "Messages", to: "/admin/messages", icon: Mail }] },
  {
    label: "System",
    items: [
      { label: "AI Usage", to: "/admin/ai", icon: Brain },
      { label: "AI Users", to: "/admin/ai-users", icon: Sparkles },
      { label: "Users", to: "/admin/users", icon: Users },
      { label: "Analytics", to: "/admin/analytics", icon: BarChart2 },
      { label: "Settings", to: "/admin/settings", icon: Settings },
    ],
  },
];

const PAGE_TITLES = {
  "/admin": "Dashboard", "/admin/projects": "Projects", "/admin/skills": "Skills",
  "/admin/blogs": "Blogs", "/admin/certificates": "Certificates",
  "/admin/experience": "Experience", "/admin/messages": "Messages",
  "/admin/ai": "AI Usage", "/admin/ai-users": "AI Users", "/admin/users": "Users",
  "/admin/analytics": "Analytics", "/admin/settings": "Settings",
};

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const currentPageTitle = PAGE_TITLES[location.pathname] || "Admin";
  const userInitial = user?.name?.[0]?.toUpperCase() || "A";

  const handleLogout = async () => {
    setProfileOpen(false);
    setSidebarOpen(false);
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="h-screen w-full overflow-hidden flex bg-[#08080c]">

      {/* ═══════ SIDEBAR ═══════ */}
      <aside
        className={`
          w-[250px] h-full bg-[#0c0c12] border-r border-white/[0.06]
          flex flex-col shrink-0
          fixed top-0 left-0 z-50
          lg:relative lg:z-auto
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-14 px-4 border-b border-white/[0.06] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <span className="font-bold text-white text-sm">Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-gray-500 hover:text-white rounded-md hover:bg-white/[0.05]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} className={gi > 0 ? "mt-5" : ""}>
              {group.label && (
                <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600">
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map(({ label, to, icon: Icon, exact }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={exact}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `relative flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-150 ${
                          isActive
                            ? "text-cyan-400 bg-cyan-500/[0.08]"
                            : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-cyan-400 rounded-r-full" />
                          )}
                          <Icon
                            className={`w-4 h-4 shrink-0 ${isActive ? "text-cyan-400" : "text-gray-600"}`}
                            strokeWidth={isActive ? 2 : 1.5}
                          />
                          <span>{label}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Card */}
        <div className="p-2.5 border-t border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-md bg-white/[0.02]">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-400 flex items-center justify-center text-black font-bold text-[11px] shrink-0">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-white truncate">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
            </div>
            <Shield className="w-3 h-3 text-cyan-500/50 shrink-0" />
          </div>
        </div>
      </aside>

      {/* ═══════ MOBILE BACKDROP ═══════ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ═══════ MAIN AREA ═══════ */}
      <div className="flex-1 flex flex-col h-full min-w-0">

        {/* Header */}
        <header className="h-14 shrink-0 bg-[#0c0c12] border-b border-white/[0.06] flex items-center justify-between px-4 lg:px-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-white/[0.05] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-semibold text-white">{currentPageTitle}</h1>
          </div>

          <div className="flex items-center gap-1.5">
            <button className="relative p-2 text-gray-500 hover:text-white rounded-md hover:bg-white/[0.05] transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-cyan-500 rounded-full" />
            </button>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] text-gray-500 hover:text-cyan-400 border border-white/[0.06] rounded-md hover:border-cyan-500/30 transition-all"
            >
              <ExternalLink className="w-3 h-3" /> View Site
            </a>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 pr-2 rounded-md hover:bg-white/[0.05] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-400 flex items-center justify-center text-black font-bold text-[11px]">
                  {userInitial}
                </div>
                <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-[#14141e] border border-white/[0.08] rounded-lg shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/[0.06]">
                      <p className="text-sm font-medium text-white">{user?.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { setProfileOpen(false); navigate("/admin/settings"); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5" /> Settings
                      </button>
                    </div>
                    <div className="border-t border-white/[0.06] py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#08080c]">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="h-10 shrink-0 bg-[#0c0c12] border-t border-white/[0.06] flex items-center justify-between px-5 text-[10px] text-gray-600">
          <span>© {new Date().getFullYear()} Omkar Portfolio</span>
          <span className="hidden sm:inline">React + Node.js</span>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;