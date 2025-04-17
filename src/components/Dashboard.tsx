
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Package, ShoppingCart, Users, LockKeyhole } from 'lucide-react';

export default function Dashboard() {
  const { authState } = useAuth();
  
  // Find out what modules the user has access to
  const accessibleModules = authState.permissions
    .filter(p => p.canAccess)
    .map(p => p.moduleName);
  
  // Cards to show on dashboard
  const dashboardCards = [
    {
      title: 'Usuários',
      description: 'Gerenciamento de usuários do sistema',
      icon: <Users className="h-12 w-12 text-construction-primary" />,
      moduleId: '1',
      path: '/usuarios'
    },
    {
      title: 'Vendas',
      description: 'Acompanhamento de vendas',
      icon: <ShoppingCart className="h-12 w-12 text-construction-success" />,
      moduleId: '5',
      path: '/vendas'
    },
    {
      title: 'Pedidos',
      description: 'Gerenciamento de pedidos',
      icon: <Package className="h-12 w-12 text-construction-warning" />,
      moduleId: '6',
      path: '/pedidos'
    },
    {
      title: 'Permissões',
      description: 'Configuração de permissões',
      icon: <LockKeyhole className="h-12 w-12 text-construction-danger" />,
      moduleId: '4',
      path: '/permissoes'
    }
  ];
  
  // Filter cards based on user permissions
  const visibleCards = dashboardCards.filter(card => {
    return authState.permissions.some(p => p.moduleId === card.moduleId && p.canAccess);
  });
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bem-vindo, {authState.user?.fullName}</h1>
        <p className="text-muted-foreground">
          Você está logado como <span className="font-medium">{authState.user?.userType?.typeName}</span>
        </p>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Módulos Disponíveis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleCards.map((card) => (
            <Card key={card.moduleId} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <CardDescription>{card.description}</CardDescription>
                <a 
                  href={card.path} 
                  className="mt-4 inline-block text-construction-primary hover:text-construction-secondary font-medium"
                >
                  Acessar →
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="bg-construction-light rounded-lg p-4 border">
        <h2 className="text-xl font-semibold mb-2">Informações do Sistema</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Usuário:</span> {authState.user?.fullName}</p>
          <p><span className="font-medium">Tipo de Usuário:</span> {authState.user?.userType?.typeName}</p>
          <p><span className="font-medium">Módulos com Acesso:</span> {accessibleModules.length}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {accessibleModules.map((module, index) => (
              <span key={index} className="bg-white px-2 py-1 rounded text-sm">
                {module}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
