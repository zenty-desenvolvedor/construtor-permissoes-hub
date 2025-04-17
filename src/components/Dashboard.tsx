
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Package, ShoppingCart, Users, LockKeyhole, CreditCard, Wrench, Receipt, Factory, BarChart2, Calendar } from 'lucide-react';

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
      path: '/usuarios',
      stats: '15 usuários ativos'
    },
    {
      title: 'Vendas',
      description: 'Acompanhamento de vendas',
      icon: <Receipt className="h-12 w-12 text-construction-success" />,
      moduleId: '5',
      path: '/vendas',
      stats: 'R$ 5.320,00 hoje'
    },
    {
      title: 'Produtos',
      description: 'Gestão de estoque e produtos',
      icon: <Package className="h-12 w-12 text-construction-warning" />,
      moduleId: 'products',
      path: '/produtos',
      stats: '238 itens em estoque'
    },
    {
      title: 'Clientes',
      description: 'Gerenciamento de clientes',
      icon: <Users className="h-12 w-12 text-blue-500" />,
      moduleId: 'clients',
      path: '/clientes',
      stats: '126 clientes cadastrados'
    },
    {
      title: 'Serviços',
      description: 'Agendamento e controle de serviços',
      icon: <Wrench className="h-12 w-12 text-orange-500" />,
      moduleId: 'services',
      path: '/servicos',
      stats: '8 serviços agendados'
    },
    {
      title: 'Financeiro',
      description: 'Controle financeiro',
      icon: <CreditCard className="h-12 w-12 text-green-500" />,
      moduleId: 'financial',
      path: '/financeiro',
      stats: '3 contas a pagar hoje'
    },
    {
      title: 'Fornecedores',
      description: 'Gestão de fornecedores',
      icon: <Factory className="h-12 w-12 text-purple-500" />,
      moduleId: 'suppliers',
      path: '/fornecedores',
      stats: '42 fornecedores'
    },
    {
      title: 'Relatórios',
      description: 'Análise de desempenho',
      icon: <BarChart2 className="h-12 w-12 text-construction-danger" />,
      moduleId: 'reports',
      path: '/relatorios',
      stats: 'Exportação em PDF/Excel'
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-700">Resumo do Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Vendas hoje</span>
                <span className="font-semibold text-blue-700">R$ 5.320,00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pedidos</span>
                <span className="font-semibold text-blue-700">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Serviços agendados</span>
                <span className="font-semibold text-blue-700">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Alertas de estoque</span>
                <span className="font-semibold text-red-500">3 produtos</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-green-700">Agenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-700" />
                <span className="text-sm text-gray-600">Entregas hoje: <span className="font-medium text-green-700">5</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-700" />
                <span className="text-sm text-gray-600">Instalações agendadas: <span className="font-medium text-green-700">3</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-700" />
                <span className="text-sm text-gray-600">Visitas técnicas: <span className="font-medium text-green-700">2</span></span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-orange-700">Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">A receber (hoje)</span>
                <span className="font-semibold text-green-600">R$ 3.450,00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">A pagar (hoje)</span>
                <span className="font-semibold text-red-500">R$ 1.230,00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Saldo em caixa</span>
                <span className="font-semibold text-orange-700">R$ 12.540,00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Módulos Disponíveis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleCards.map((card) => (
            <Card key={card.moduleId} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-2">{card.description}</CardDescription>
                <div className="text-sm font-medium text-muted-foreground">{card.stats}</div>
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
