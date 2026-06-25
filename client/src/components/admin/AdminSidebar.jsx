// ═══════════════════════════════════════════════════════════════
//  ADMIN SIDEBAR — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React from 'react';
import { LayoutDashboard, FolderOpen, Award, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard />, path: "/admin" },
    { name: "Projects", icon: <FolderOpen />, path: "/admin/projects" },
    { name: "Skills", icon: <Award />, path: "/admin/skills" },
    { name: "Certificates", icon: <Award />, path: "/admin/certificates" },
  ];

  return (
    <aside className="w-64 bg-[#171717] min-h-screen border-r border-[#D4AF37]/10 fixed left-0 top-0 p-6">
      <h2 className="text-2xl font-bold text-[#FFFFFF] mb-10 font-display">Admin Panel</h2>
      
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li key={item.name}>
            <NavLink 
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' 
                    : 'text-[#A3A3A3] hover:bg-[#D4AF37]/[0.04] hover:text-[#FFFFFF]'
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <button className="mt-auto flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg w-full transition-colors cursor-pointer">
        <LogOut /> Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;