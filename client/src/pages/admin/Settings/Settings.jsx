import React, { useState } from "react";
import { Save, Shield, Bot } from "lucide-react";

const Settings = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inp = "w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition";

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

      <form onSubmit={handleSave} className="space-y-8">
        {/* General */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-400" /> General Info
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Portfolio Title</label>
              <input type="text" defaultValue="Omkar Jadhav Portfolio" className={inp} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Contact Email</label>
              <input type="email" defaultValue="contact@omkar.dev" className={inp} />
            </div>
          </div>
        </div>

        {/* AI */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400" /> AI Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Groq API Key</label>
              <input type="password" placeholder="gsk_..." className={inp} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Enable Voice Assistant</span>
              <button type="button" className="w-11 h-6 bg-gray-700 rounded-full relative cursor-pointer">
                <span className="absolute right-1 top-1 w-4 h-4 bg-gray-400 rounded-full" />
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-gray-900 border border-red-500/20 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-red-400 mb-4">Danger Zone</h3>
          <p className="text-gray-500 text-sm mb-4">These actions are irreversible.</p>
          <button type="button" className="px-4 py-2 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 text-sm transition">
            Clear All Analytics Data
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold transition-all ${
              saved ? "bg-green-500 text-black" : "bg-cyan-500 text-black hover:bg-cyan-400"
            }`}
          >
            <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;