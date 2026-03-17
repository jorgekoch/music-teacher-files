import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { SharedFilePage } from "./pages/SharedFilePage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicOnlyRoute } from "./routes/PublicOnlyRoute";
import { BillingSuccessPage } from "./pages/BillingSuccessPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { FeaturesPage } from "./pages/FeaturesPage";
import { StoragePage } from "./pages/StoragePage";
import { ShareFoldersPage } from "./pages/ShareFoldersPage";
import { StoreDocumentsPage } from "./pages/StoreDocumentsPage";
import { OrganizeCloudDocumentsPage } from "./pages/OrganizeCloudDocumentsPage";
import { HowToOrganizeFilesCloudPage } from "./pages/HowToOrganizeFilesCloudPage";
import { GoogleDriveAlternativePage } from "./pages/GoogleDriveAlternativePage";
import { SeoTopicPage } from "./pages/SeoTopicPage";
import { UseCasePage } from "./pages/UseCasePage";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 2500,
              style: {
                borderRadius: "14px",
                padding: "12px 14px",
              },
            }}
          />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/armazenamento-de-arquivos-online" element={<StoragePage />} />
            <Route path="/compartilhar-pastas-online" element={<ShareFoldersPage />} />
            <Route path="/armazenar-documentos-online" element={<StoreDocumentsPage />} />
            <Route path="/organizar-arquivos-na-nuvem" element={<OrganizeCloudDocumentsPage />} />
            <Route path="/como-organizar-arquivos-na-nuvem" element={<HowToOrganizeFilesCloudPage />} />
            <Route path="/alternativa-google-drive" element={<GoogleDriveAlternativePage />} />

            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <RegisterPage />
                </PublicOnlyRoute>
              }
            />

            <Route
              path="/forgot-password"
              element={
                <PublicOnlyRoute>
                  <ForgotPasswordPage />
                </PublicOnlyRoute>
              }
            />

            <Route
              path="/reset-password"
              element={
                <PublicOnlyRoute>
                  <ResetPasswordPage />
                </PublicOnlyRoute>
              }
            />

            <Route path="/shared/:token" element={<SharedFilePage />} />
            <Route path="/billing/success" element={<BillingSuccessPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route path="/:slug" element={<SeoTopicPage />} />
            <Route path="/uso/:slug" element={<UseCasePage />} />

          </Routes>
          
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}