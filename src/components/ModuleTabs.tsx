
import { TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  Package, 
  Wrench, 
  Receipt, 
  Users, 
  Factory, 
  User, 
  Wallet, 
  BarChart2, 
  Settings, 
  ShoppingCart 
} from "lucide-react";

const ModuleTabs = () => {
  const { hasPermission } = useAuth();
  
  const modules = [
    { id: "dashboard", name: "Dashboard", icon: <LayoutDashboard size={16} />, path: "/dashboard" },
    { id: "products", name: "Produtos", icon: <Package size={16} />, path: "/produtos" },
    { id: "services", name: "Serviços", icon: <Wrench size={16} />, path: "/servicos" },
    { id: "sales", name: "Vendas", icon: <Receipt size={16} />, path: "/vendas" },
    { id: "clients", name: "Clientes", icon: <Users size={16} />, path: "/clientes" },
    { id: "suppliers", name: "Fornecedores", icon: <Factory size={16} />, path: "/fornecedores" },
    { id: "1", name: "Usuários", icon: <User size={16} />, path: "/usuarios" },
    { id: "financial", name: "Financeiro", icon: <Wallet size={16} />, path: "/financeiro" },
    { id: "reports", name: "Relatórios", icon: <BarChart2 size={16} />, path: "/relatorios" },
    { id: "settings", name: "Configurações", icon: <Settings size={16} />, path: "/configuracoes" },
    { id: "client-area", name: "Área do Cliente", icon: <ShoppingCart size={16} />, path: "/area-cliente" },
  ];

  // Filter out modules the user doesn't have permission to access
  const accessibleModules = modules.filter(module => 
    module.id === "dashboard" || hasPermission(module.id, 'access')
  );

  return (
    <div className="w-full px-4 py-2 border-b bg-background">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="w-full justify-start">
          {accessibleModules.map((module) => (
            <TabsTrigger 
              key={module.id} 
              to={module.path}
              className="flex items-center gap-1"
            >
              {module.icon}
              <span>{module.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ModuleTabs;
