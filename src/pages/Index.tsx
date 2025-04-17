
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (authState.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [authState.isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen auth-page flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:block">
          <h1 className="text-4xl font-bold text-construction-dark mb-4">Construmax</h1>
          <p className="text-xl mb-6 text-construction-dark/80">
            Sistema de gerenciamento de materiais de construção e serviços
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-construction-primary text-white p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Gerenciamento de Usuários</h3>
                <p className="text-sm text-muted-foreground">
                  Controle detalhado de permissões por tipo de usuário
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-construction-success text-white p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Módulos Dinâmicos</h3>
                <p className="text-sm text-muted-foreground">
                  Adicione novos módulos sem precisar alterar o código-fonte
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-construction-warning text-white p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Controle de Permissões</h3>
                <p className="text-sm text-muted-foreground">
                  Defina quem pode acessar, cadastrar, editar e excluir
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default Index;
