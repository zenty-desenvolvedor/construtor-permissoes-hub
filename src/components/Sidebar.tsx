
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  Settings, 
  LayoutDashboard, 
  LockKeyhole, 
  List, 
  ShoppingCart, 
  Package, 
  Users2, 
  Menu, 
  X,
  Wrench,
  Receipt,
  Factory,
  Wallet,
  BarChart2, 
  User
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  moduleId: string;
  collapsed: boolean;
}

const NavItem = ({ to, icon, label, moduleId, collapsed }: NavItemProps) => {
  const { hasPermission } = useAuth();
  
  if (!hasPermission(moduleId, 'access') && moduleId !== "dashboard") {
    return null;
  }
  
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-150",
          collapsed ? "justify-center" : "",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
        )
      }
    >
      {icon}
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </NavLink>
  );
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);
  
  const navItems = [
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard", moduleId: "dashboard" },
    { to: "/produtos", icon: <Package size={20} />, label: "Produtos", moduleId: "products" },
    { to: "/servicos", icon: <Wrench size={20} />, label: "Serviços", moduleId: "services" },
    { to: "/vendas", icon: <Receipt size={20} />, label: "Vendas", moduleId: "5" },
    { to: "/clientes", icon: <Users size={20} />, label: "Clientes", moduleId: "clients" },
    { to: "/fornecedores", icon: <Factory size={20} />, label: "Fornecedores", moduleId: "suppliers" },
    { to: "/usuarios", icon: <User size={20} />, label: "Usuários", moduleId: "1" },
    { to: "/financeiro", icon: <Wallet size={20} />, label: "Financeiro", moduleId: "financial" },
    { to: "/relatorios", icon: <BarChart2 size={20} />, label: "Relatórios", moduleId: "reports" },
    { to: "/tipos-usuario", icon: <Users2 size={20} />, label: "Tipos de Usuário", moduleId: "2" },
    { to: "/modulos", icon: <List size={20} />, label: "Módulos", moduleId: "3" },
    { to: "/permissoes", icon: <LockKeyhole size={20} />, label: "Permissões", moduleId: "4" },
    { to: "/pedidos", icon: <ShoppingCart size={20} />, label: "Pedidos", moduleId: "6" },
    { to: "/configuracoes", icon: <Settings size={20} />, label: "Configurações", moduleId: "settings" },
    { to: "/area-cliente", icon: <Users size={20} />, label: "Área do Cliente", moduleId: "client-area" }
  ];
  
  return (
    <div
      className={cn(
        "h-screen sticky top-0 border-r border-sidebar-border bg-sidebar flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="text-lg font-semibold text-sidebar-foreground">
            Construmax
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 text-sidebar-foreground",
            collapsed ? "mx-auto" : ""
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>
      
      <ScrollArea className="flex-1 py-2 custom-scrollbar">
        <div className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              moduleId={item.moduleId}
              collapsed={collapsed}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
