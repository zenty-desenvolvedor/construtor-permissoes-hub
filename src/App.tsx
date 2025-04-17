
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import ModuleManagement from "./components/modules/ModuleManagement";
import UserTypeManagement from "./components/users/UserTypeManagement";
import PermissionManagement from "./components/permissions/PermissionManagement";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, moduleId }: { children: React.ReactNode; moduleId?: string }) => {
  const { authState, hasPermission } = useAuth();

  if (!authState.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (moduleId && !hasPermission(moduleId, 'access')) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

// DashboardLayout component
const DashboardLayout = () => (
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
);

// Page components with permission checks
const ModulesPage = () => (
  <ProtectedRoute moduleId="3">
    <ModuleManagement />
  </ProtectedRoute>
);

const UserTypesPage = () => (
  <ProtectedRoute moduleId="2">
    <UserTypeManagement />
  </ProtectedRoute>
);

const PermissionsPage = () => (
  <ProtectedRoute moduleId="4">
    <PermissionManagement />
  </ProtectedRoute>
);

// Placeholder pages
const PlaceholderPage = ({ title, moduleId }: { title: string; moduleId: string }) => (
  <ProtectedRoute moduleId={moduleId}>
    <div className="p-6">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">Esta página está em construção</p>
      <div className="mt-8 p-4 bg-construction-light rounded-lg">
        <p>Este módulo seria implementado em uma versão completa do sistema.</p>
      </div>
    </div>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<DashboardLayout />} />
            <Route path="/modulos" element={<ModulesPage />} />
            <Route path="/tipos-usuario" element={<UserTypesPage />} />
            <Route path="/permissoes" element={<PermissionsPage />} />
            <Route path="/usuarios" element={<PlaceholderPage title="Usuários" moduleId="1" />} />
            <Route path="/vendas" element={<PlaceholderPage title="Vendas" moduleId="5" />} />
            <Route path="/pedidos" element={<PlaceholderPage title="Pedidos" moduleId="6" />} />
            <Route path="/configuracoes" element={<PlaceholderPage title="Configurações" moduleId="settings" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
