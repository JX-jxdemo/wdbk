import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import ArticleDetail from "@/pages/ArticleDetail";
import About from "@/pages/About";
import Resources from "@/pages/Resources";
import NotFound from "@/pages/NotFound";
import LikePage from "@/pages/Like";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminLikes from "@/pages/admin/AdminLikes";
import AdminMusic from "@/pages/admin/AdminMusic";
import AdminNotice from "@/pages/admin/AdminNotice";
import AdminResources from "@/pages/admin/AdminResources";
import AdminSettings from "@/pages/admin/AdminSettings";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SiteProvider } from "@/contexts/SiteContext";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SiteProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<ArticleDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/like" element={<LikePage />} />
                {/* 后台管理 - 追加菜单 */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="likes" element={<AdminLikes />} />
                  <Route path="resources" element={<AdminResources />} />
                  <Route path="music" element={<AdminMusic />} />
                  <Route path="notice" element={<AdminNotice />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </Router>
        </SiteProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
