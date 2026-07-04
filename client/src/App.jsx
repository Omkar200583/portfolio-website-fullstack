import { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { trackPageView } from "./services/analyticsService";

// ─── Layouts ─────────────────────────────────────────────────────────────────
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// ─── Public Pages ────────────────────────────────────────────────────────────
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Skills from "./pages/Skills/Skills";
import Projects from "./pages/Projects/Projects";
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails";
import Certificates from "./pages/Certificates/Certificates";
import Experience from "./pages/Experience/Experience";
import Blog from "./pages/Blog/Blog";
import BlogPost from "./pages/Blog/BlogPost";
import Contact from "./pages/Contact/Contact";
import Resume from "./pages/Resume/Resume";

// ─── AI Tools ────────────────────────────────────────────────────────────────
import AIToolsDashboard from "./pages/AIAssistant/AIToolsDashboard";
import ChatAssistant from "./pages/AIAssistant/ChatAssistant";
import ResumeBuilder from "./pages/AIAssistant/ResumeBuilder";
import ResumeAnalyzer from "./pages/AIAssistant/ResumeAnalyzer";
import MockInterview from "./pages/AIAssistant/MockInterview";
import CareerGuide from "./pages/AIAssistant/CareerGuide";
import AIToolAuthGate from "./components/ai/AIToolAuthGate";

// ─── Admin Pages ─────────────────────────────────────────────────────────────
import AdminLogin from "./pages/admin/login/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/Dashboard/Dashboard";
import AdminProjects from "./pages/admin/Projects/Projects";
import AdminSkills from "./pages/admin/Skills/Skills";
import AdminCertificates from "./pages/admin/Certificates/Certificates";
import AdminExperience from "./pages/admin/Experience/Experience";
import AdminBlogs from "./pages/admin/Blogs/Blogs";
import AdminMessages from "./pages/admin/Messages/Messages";
import AdminAI from "./pages/admin/AdminAI/AdminAI";
import AdminAnalytics from "./pages/admin/Analytics/Analytics";
import AdminSettings from "./pages/admin/Settings/Settings";
import AdminUsers from "./pages/admin/Users/Users";
import AdminAIUsers from "./pages/admin/AIUsers/AdminAIUsers";

// ─── Protection ──────────────────────────────────────────────────────────────
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute.jsx";

// ─── Shared Components ───────────────────────────────────────────────────────
import AIChatWidget from "./components/ai/AIChatWidget";

// ─── 404 ─────────────────────────────────────────────────────────────────────
import NotFound from "./pages/NotFound/NotFound";

// ─── Analytics Tracker ───────────────────────────────────────────────────────
const PageTracker = () => {
  const location = useLocation();
  const tracked = useRef(new Set());

  useEffect(() => {
    const path = location.pathname + location.search;

    // Don't track admin pages — that's you, not a visitor
    if (path.startsWith("/admin")) return;

    // Don't double-track the same path in one session
    if (tracked.current.has(path)) return;
    tracked.current.add(path);

    trackPageView(path);
  }, [location]);

  return null;
};

// ─── Wrapper: Adds AI Widget to Public Pages ─────────────────────────────────
const PublicLayout = ({ children }) => (
  <>
    {children}
    <AIChatWidget />
  </>
);

// ═══════════════════════════════════════════════════════════════════════════════
function App() {
  return (
    <>
      <PageTracker />
      <Routes>

        {/* ── PUBLIC ROUTES ──────────────────────────────────────────────── */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <MainLayout />
            </PublicLayout>
          }
        >
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="skills" element={<Skills />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="experience" element={<Experience />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<BlogPost />} />
          <Route path="contact" element={<Contact />} />
          <Route path="resume" element={<Resume />} />

          {/* AI TOOLS — Dashboard is public, individual tools are OTP-gated */}
          <Route path="ai-tools" element={<AIToolsDashboard />} />
          <Route
            path="ai-tools/chat"
            element={<AIToolAuthGate><ChatAssistant /></AIToolAuthGate>}
          />
          <Route
            path="ai-tools/resume-builder"
            element={<AIToolAuthGate><ResumeBuilder /></AIToolAuthGate>}
          />
          <Route
            path="ai-tools/resume-analyzer"
            element={<AIToolAuthGate><ResumeAnalyzer /></AIToolAuthGate>}
          />
          <Route
            path="ai-tools/mock-interview"
            element={<AIToolAuthGate><MockInterview /></AIToolAuthGate>}
          />
          <Route
            path="ai-tools/career-guide"
            element={<AIToolAuthGate><CareerGuide /></AIToolAuthGate>}
          />
        </Route>

        {/* ── ADMIN LOGIN (standalone, no layout, no protection) ─────────── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ── ADMIN ROUTES (PROTECTED) ───────────────────────────────────── */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="certificates" element={<AdminCertificates />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="ai" element={<AdminAI />} />
          <Route path="ai-users" element={<AdminAIUsers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* ── 404 CATCH-ALL ──────────────────────────────────────────────── */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
}

export default App;