import React, { useState, useEffect } from "react";
import { Users as UsersIcon, Shield, Ban, CheckCircle, Trash2, Search } from "lucide-react";
import userService from "../../../services/userService";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getAll(search);
      setUsers(res.data.data || res.data?.users || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 0);
    return () => clearTimeout(timer);
  }, [search]);

  const handleToggleActive = async (user) => {
    try {
      await userService.toggleActive(user._id);
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isActive: !u.isActive } : u));
    } catch (err) { alert("Failed to update user"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user permanently?")) return;
    try { await userService.delete(id); fetchUsers(); }
    catch (err) { alert("Delete failed"); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <UsersIcon className="text-cyan-400" /> Users
          </h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} total users</p>
        </div>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500" />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/40 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4 hidden md:table-cell">Role</th>
              <th className="px-6 py-4 hidden md:table-cell">AI Usage</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No users found</td></tr>
            ) : users.map((u) => (
              <tr key={u._id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {u.avatar?.url ? <img src={u.avatar.url} alt="" className="w-8 h-8 rounded-full bg-gray-800" /> : <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 text-xs font-bold">{u.name?.[0]}</div>}
                    <div>
                      <p className="font-medium text-white">{u.name}</p>
                      <p className="text-gray-500 text-xs">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${u.role === "admin" ? "bg-cyan-500/10 text-cyan-400" : "bg-gray-800 text-gray-400"}`}>
                    <Shield className="w-3 h-3 inline mr-1" />{u.role}
                  </span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <p className="text-gray-400 text-sm font-mono">{u.aiUsage?.totalRequests || 0} requests</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded border ${u.isActive ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                    {u.isActive ? <><CheckCircle className="w-3 h-3 inline mr-1" />Active</> : <><Ban className="w-3 h-3 inline mr-1" />Inactive</>}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleToggleActive(u)} className={`p-2 transition ${u.isActive ? "text-yellow-500 hover:bg-yellow-500/10" : "text-green-400 hover:bg-green-500/10"}`} title={u.isActive ? "Deactivate" : "Activate"}>
                      {u.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                    {u.role !== "admin" && (
                      <button onClick={() => handleDelete(u._id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;